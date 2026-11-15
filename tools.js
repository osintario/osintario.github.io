"use strict";
/* Multi-OSINT Lite · OSINTario · Todo corre en el navegador del usuario. */
const $ = (s) => document.querySelector(s);
const enc = encodeURIComponent;

function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === "text") n.textContent = v; else if (k === "class") n.className = v; else n.setAttribute(k, v);
  }
  for (const k of kids) if (k != null) n.append(k);
  return n;
}
function safeUrl(u) { try { const x = new URL(u); return ["http:", "https:"].includes(x.protocol) ? x.href : null; } catch { return null; } }
async function sha256Hex(data) {
  const buf = typeof data === "string" ? new TextEncoder().encode(data) : data;
  return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", buf))).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function getJSON(url, { timeout = 20000, headers = {} } = {}) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), timeout);
  try {
    const r = await fetch(url, { signal: ctl.signal, headers: { accept: "application/json, application/dns-json", ...headers }, referrerPolicy: "no-referrer" });
    if (r.status === 404) return { __notFound: true };
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally { clearTimeout(t); }
}
const F = (category, title, source, url = "", confidence = "media", note = "") => ({ category, title, source, url, confidence, note });

/* ---------- Validación ---------- */
const RE = {
  domain: /^(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/,
  ipv4: /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/,
  alias: /^[A-Za-z0-9][A-Za-z0-9._-]{1,39}$/,
  email: /^[A-Za-z0-9][A-Za-z0-9._%+-]{0,63}@[A-Za-z0-9.-]{1,253}\.[A-Za-z]{2,24}$/,
};
const cleanDomain = (v) => v.trim().toLowerCase().replace(/^https?:\/\//, "").split(/[/?#]/)[0].replace(/^www\./, "");
function isPrivateIp(ip) {
  const [a, b] = ip.split(".").map(Number);
  return a === 10 || a === 127 || a === 0 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254) || a >= 224 || (a === 100 && b >= 64 && b <= 127);
}

/* ---------- Fuentes ---------- */
async function dnsQuery(name, type) {
  const j = await getJSON(`https://dns.google/resolve?name=${enc(name)}&type=${type}`);
  return (j.Answer || []).filter((a) => a.type === { A: 1, AAAA: 28, MX: 15, NS: 2, TXT: 16, CAA: 257, PTR: 12, CNAME: 5 }[type]).map((a) => a.data.replace(/^"|"$/g, "").replace(/" "/g, ""));
}

async function srcDNS(domain, out) {
  const types = ["A", "AAAA", "MX", "NS", "TXT", "CAA"];
  const res = await Promise.all(types.map((t) => dnsQuery(domain, t).catch(() => [])));
  types.forEach((t, i) => res[i].slice(0, 15).forEach((v) => out.push(F(`DNS ${t}`, v, "Google DNS", "", "alta"))));
  const txt = res[4].join(" ");
  const spf = res[4].find((t) => t.startsWith("v=spf1"));
  out.push(F("Correo y suplantación", spf ? "SPF configurado" : "Sin registro SPF", "Google DNS", "", "alta", spf || "Cualquiera podría enviar emails haciéndose pasar por este dominio."));
  const dmarc = (await dnsQuery(`_dmarc.${domain}`, "TXT").catch(() => [])).find((t) => t.startsWith("v=DMARC1"));
  const policy = dmarc ? (dmarc.match(/p=(\w+)/) || [])[1] : null;
  out.push(F("Correo y suplantación", dmarc ? `DMARC con política "${policy}"` : "Sin DMARC", "Google DNS", "", "alta",
    dmarc ? (policy === "none" ? "Política en modo observación: no bloquea la suplantación." : dmarc) : "Recomendable para evitar phishing con este dominio."));
  const verif = (txt.match(/(google-site-verification|MS=|facebook-domain-verification|atlassian-domain-verification|apple-domain-verification|stripe-verification|docusign|zoom|hubspot|adobe-idp-site-verification)/gi) || []);
  if (verif.length) out.push(F("Servicios que usa", [...new Set(verif.map((v) => v.replace(/[-=].*$/, "").toLowerCase()))].join(", "), "Registros TXT", "", "media", "Los registros de verificación revelan proveedores SaaS de la organización."));
  return res[0];
}

async function srcCrt(domain, out) {
  const j = await getJSON(`https://crt.sh/?q=${enc("%." + domain)}&output=json`, { timeout: 30000 });
  if (j.__notFound || !Array.isArray(j)) return;
  const subs = new Set();
  for (const row of j) for (const n of String(row.name_value || "").split("\n")) {
    const s = n.trim().toLowerCase().replace(/^\*\./, "");
    if (s.endsWith(domain) && s !== domain) subs.add(s);
  }
  const list = [...subs].sort();
  const juicy = /(dev|test|staging|stage|uat|qa|admin|vpn|jenkins|git|jira|internal|old|backup|api|beta|mail|portal)/;
  list.slice(0, 150).forEach((s) => out.push(F("Subdominios (transparencia de certificados)", s, "crt.sh", `https://crt.sh/?q=${enc(s)}`, "alta", juicy.test(s) ? "Nombre sensible: revisa si está expuesto." : "")));
  if (list.length > 150) out.push(F("Subdominios (transparencia de certificados)", `${list.length - 150} más no mostrados`, "crt.sh", `https://crt.sh/?q=${enc("%." + domain)}`, "alta"));
  if (!list.length) out.push(F("Subdominios (transparencia de certificados)", "No se encontraron subdominios", "crt.sh", "", "media"));
}

async function srcRDAP(domain, out) {
  const j = await getJSON(`https://rdap.org/domain/${enc(domain)}`);
  if (j.__notFound) { out.push(F("Registro del dominio", "Sin datos RDAP (algunos países no publican RDAP)", "RDAP", "", "baja")); return; }
  for (const ev of j.events || []) {
    const map = { registration: "Registrado", expiration: "Vence", "last changed": "Último cambio" };
    if (map[ev.eventAction]) out.push(F("Registro del dominio", `${map[ev.eventAction]}: ${String(ev.eventDate).slice(0, 10)}`, "RDAP", "", "alta"));
  }
  for (const ent of j.entities || []) {
    const fn = ((ent.vcardArray || [])[1] || []).find((v) => v[0] === "fn");
    if ((ent.roles || []).includes("registrar") && fn) out.push(F("Registro del dominio", `Registrador: ${fn[3]}`, "RDAP", "", "alta"));
    if ((ent.roles || []).includes("registrant") && fn && !/redacted|privacy|proxy/i.test(fn[3])) out.push(F("Registro del dominio", `Titular: ${fn[3]}`, "RDAP", "", "media"));
  }
  const reg = (j.events || []).find((e) => e.eventAction === "registration");
  if (reg) {
    const days = (Date.now() - new Date(reg.eventDate)) / 86400000;
    if (days < 90) out.push(F("Señales de riesgo", `Dominio creado hace ${Math.round(days)} días`, "RDAP", "", "alta", "Los dominios muy nuevos son frecuentes en phishing y estafas."));
  }
}

async function srcWayback(target, out) {
  const j = await getJSON(`https://archive.org/wayback/available?url=${enc(target)}&timestamp=19960101`);
  const s = j.archived_snapshots && j.archived_snapshots.closest;
  if (s) {
    const d = s.timestamp; out.push(F("Historial web", `Primera captura cercana: ${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`, "Wayback Machine", s.url, "alta"));
  } else out.push(F("Historial web", "Sin capturas en Wayback Machine", "Wayback Machine", "", "media"));
  out.push(F("Historial web", "Ver todas las capturas", "Wayback Machine", `https://web.archive.org/web/*/${target}*`, "alta"));
}

async function srcOTX(kind, value, out) {
  const path = kind === "ip" ? `IPv4/${value}` : `domain/${value}`;
  const j = await getJSON(`https://otx.alienvault.com/api/v1/indicators/${path}/general`);
  const n = (j.pulse_info && j.pulse_info.count) || 0;
  out.push(F("Reputación e inteligencia de amenazas", n ? `Aparece en ${n} reportes de amenazas` : "Sin reportes de amenazas", "AlienVault OTX",
    `https://otx.alienvault.com/indicator/${kind === "ip" ? "ip" : "domain"}/${value}`, n ? "media" : "alta", n ? "Revisa los reportes: puede ser un falso positivo (por ejemplo, un servicio compartido)." : ""));
  (j.pulse_info?.pulses || []).slice(0, 5).forEach((p) => out.push(F("Reputación e inteligencia de amenazas", p.name, "AlienVault OTX", `https://otx.alienvault.com/pulse/${p.id}`, "media", (p.tags || []).slice(0, 5).join(", "))));
}

async function srcInternetDB(ip, out) {
  const j = await getJSON(`https://internetdb.shodan.io/${ip}`);
  if (j.__notFound) { out.push(F("Exposición (Shodan)", `${ip}: sin datos de puertos abiertos`, "Shodan InternetDB", "", "media")); return; }
  out.push(F("Exposición (Shodan)", `${ip}: puertos abiertos ${(j.ports || []).join(", ") || "ninguno"}`, "Shodan InternetDB", `https://www.shodan.io/host/${ip}`, "alta",
    [(j.hostnames || []).slice(0, 5).join(", "), (j.cpes || []).slice(0, 4).join(", ")].filter(Boolean).join(" · ")));
  (j.vulns || []).slice(0, 10).forEach((v) => out.push(F("Vulnerabilidades conocidas (sin verificar)", v, "Shodan InternetDB", `https://nvd.nist.gov/vuln/detail/${v}`, "baja", `En ${ip}. Shodan las infiere por versión: confirma antes de reportar.`)));
}

async function srcIpinfo(ip, out) {
  const j = await getJSON(`https://ipinfo.io/${ip}/json`);
  if (j.bogon) { out.push(F("Ubicación y red", "IP privada o reservada", "ipinfo", "", "alta")); return; }
  out.push(F("Ubicación y red", [j.city, j.region, j.country].filter(Boolean).join(", "), "ipinfo", `https://ipinfo.io/${ip}`, "media", "La geolocalización por IP es aproximada (ciudad del proveedor, no del usuario)."));
  if (j.org) out.push(F("Ubicación y red", `Red: ${j.org}`, "ipinfo", "", "alta"));
  if (j.hostname) out.push(F("Ubicación y red", `Nombre inverso: ${j.hostname}`, "ipinfo", "", "alta"));
}

/* ---------- Herramientas ---------- */
const PLATFORMS = [
  ["GitHub", "https://github.com/{u}"], ["GitLab", "https://gitlab.com/{u}"], ["X / Twitter", "https://x.com/{u}"], ["Instagram", "https://www.instagram.com/{u}/"],
  ["TikTok", "https://www.tiktok.com/@{u}"], ["YouTube", "https://www.youtube.com/@{u}"], ["Reddit", "https://www.reddit.com/user/{u}"], ["Telegram", "https://t.me/{u}"],
  ["Facebook", "https://www.facebook.com/{u}"], ["LinkedIn", "https://www.linkedin.com/in/{u}"], ["Threads", "https://www.threads.net/@{u}"], ["Bluesky", "https://bsky.app/profile/{u}.bsky.social"],
  ["Pinterest", "https://www.pinterest.com/{u}/"], ["Twitch", "https://www.twitch.tv/{u}"], ["Medium", "https://medium.com/@{u}"], ["Dev.to", "https://dev.to/{u}"],
  ["Keybase", "https://keybase.io/{u}"], ["HackerOne", "https://hackerone.com/{u}"], ["Bugcrowd", "https://bugcrowd.com/{u}"], ["TryHackMe", "https://tryhackme.com/p/{u}"],
  ["Hack The Box", "https://app.hackthebox.com/search?q={u}"], ["Steam", "https://steamcommunity.com/id/{u}"], ["SoundCloud", "https://soundcloud.com/{u}"], ["Spotify", "https://open.spotify.com/user/{u}"],
  ["Patreon", "https://www.patreon.com/{u}"], ["Linktree", "https://linktr.ee/{u}"], ["About.me", "https://about.me/{u}"], ["Flickr", "https://www.flickr.com/people/{u}"],
  ["Vimeo", "https://vimeo.com/{u}"], ["Behance", "https://www.behance.net/{u}"], ["Dribbble", "https://dribbble.com/{u}"], ["Kaggle", "https://www.kaggle.com/{u}"],
  ["Replit", "https://replit.com/@{u}"], ["npm", "https://www.npmjs.com/~{u}"], ["PyPI", "https://pypi.org/user/{u}/"], ["Docker Hub", "https://hub.docker.com/u/{u}"],
  ["Hacker News", "https://news.ycombinator.com/user?id={u}"], ["CodePen", "https://codepen.io/{u}"], ["Pastebin", "https://pastebin.com/u/{u}"], ["Mastodon (búsqueda)", "https://mastodon.social/search?q={u}"],
];

const TOOLS = {
  domain: {
    title: "Dominio o empresa", label: "Dominio", ph: "empresa.com", examples: ["wikipedia.org", "osintario.github.io"],
    desc: "DNS, protección contra suplantación (SPF/DMARC), subdominios por certificados, registro, historial web, reputación y puertos expuestos de sus IPs.",
    sources: ["Google DNS", "crt.sh", "RDAP", "Wayback Machine", "AlienVault OTX", "Shodan InternetDB", "ipinfo"],
    parse(v) { const d = cleanDomain(v); if (!RE.domain.test(d)) throw new Error("Escribe un dominio válido, por ejemplo empresa.com."); return d; },
    async run(d, out, mark) {
      const ips = await step(mark, "Google DNS", () => srcDNS(d, out)) || [];
      await Promise.all([
        step(mark, "crt.sh", () => srcCrt(d, out)),
        step(mark, "RDAP", () => srcRDAP(d, out)),
        step(mark, "Wayback Machine", () => srcWayback(d, out)),
        step(mark, "AlienVault OTX", () => srcOTX("domain", d, out)),
        step(mark, "Shodan InternetDB", async () => { for (const ip of ips.filter((i) => RE.ipv4.test(i) && !isPrivateIp(i)).slice(0, 3)) await srcInternetDB(ip, out); }),
        step(mark, "ipinfo", async () => { const ip = ips.find((i) => RE.ipv4.test(i) && !isPrivateIp(i)); if (ip) await srcIpinfo(ip, out); }),
      ]);
      out.push(F("Pivotes sugeridos", `Buscar "${d.split(".")[0]}" en registros mercantiles`, "OpenCorporates", `https://opencorporates.com/companies?q=${enc(d.split(".")[0])}`, "baja", "Coincidencia por nombre: verifica que sea la misma organización."));
      out.push(F("Pivotes sugeridos", "Análisis de la URL con capturas", "URLScan", `https://urlscan.io/search/#${enc("domain:" + d)}`, "media"));
      out.push(F("Pivotes sugeridos", "Reputación en VirusTotal", "VirusTotal", `https://www.virustotal.com/gui/domain/${d}`, "media"));
    },
  },
  ip: {
    title: "Dirección IP", label: "IPv4", ph: "8.8.8.8", examples: ["8.8.8.8", "1.1.1.1"],
    desc: "Ubicación aproximada y red, nombre inverso, puertos abiertos y vulnerabilidades conocidas según Shodan, y reputación.",
    sources: ["ipinfo", "Shodan InternetDB", "Google DNS", "AlienVault OTX"],
    parse(v) { const ip = v.trim(); if (!RE.ipv4.test(ip)) throw new Error("Escribe una IPv4 válida, por ejemplo 8.8.8.8."); if (isPrivateIp(ip)) throw new Error("Es una IP privada o reservada: no tiene información pública."); return ip; },
    async run(ip, out, mark) {
      await Promise.all([
        step(mark, "ipinfo", () => srcIpinfo(ip, out)),
        step(mark, "Shodan InternetDB", () => srcInternetDB(ip, out)),
        step(mark, "Google DNS", async () => { const ptr = await dnsQuery(ip.split(".").reverse().join(".") + ".in-addr.arpa", "PTR"); ptr.forEach((p) => out.push(F("Ubicación y red", `PTR: ${p}`, "Google DNS", "", "alta"))); }),
        step(mark, "AlienVault OTX", () => srcOTX("ip", ip, out)),
      ]);
      out.push(F("Pivotes sugeridos", "Ruido o ataque dirigido", "GreyNoise", `https://viz.greynoise.io/ip/${ip}`, "media"));
      out.push(F("Pivotes sugeridos", "Reputación en VirusTotal", "VirusTotal", `https://www.virustotal.com/gui/ip-address/${ip}`, "media"));
      out.push(F("Pivotes sugeridos", "Ficha completa en Shodan", "Shodan", `https://www.shodan.io/host/${ip}`, "media"));
    },
  },
  alias: {
    title: "Alias o nombre de usuario", label: "Alias", ph: "nombre_de_usuario", examples: ["torvalds", "octocat"],
    desc: "Consulta GitHub y Keybase con datos verificables y te prepara los enlaces directos a 40 plataformas para revisar a mano. Para un barrido automático de miles de sitios usa Maigret o Sherlock (ver directorio).",
    sources: ["GitHub API", "Keybase"],
    parse(v) { const u = v.trim().replace(/^@/, ""); if (!RE.alias.test(u)) throw new Error("El alias solo puede tener letras, números, punto, guion y guion bajo."); return u; },
    async run(u, out, mark, extra) {
      await Promise.all([
        step(mark, "GitHub API", async () => {
          const j = await getJSON(`https://api.github.com/users/${enc(u)}`);
          if (j.__notFound) { out.push(F("Cuentas verificadas", "GitHub: no existe", "GitHub API", "", "alta")); return; }
          out.push(F("Cuentas verificadas", `GitHub: ${j.name || j.login}`, "GitHub API", j.html_url, "alta",
            [j.bio, j.company && `Empresa: ${j.company}`, j.location && `Ubicación declarada: ${j.location}`, j.blog && `Web: ${j.blog}`, `Creada: ${String(j.created_at).slice(0, 10)}`, `${j.public_repos} repos públicos`].filter(Boolean).join(" · ")));
          if (j.blog) { const w = safeUrl(j.blog.startsWith("http") ? j.blog : "https://" + j.blog); if (w) out.push(F("Pivotes sugeridos", `Web declarada: ${j.blog}`, "GitHub API", w, "media")); }
          out.push(F("Pivotes sugeridos", "Commits públicos (pueden revelar emails)", "GitHub", `https://github.com/search?q=author%3A${enc(u)}&type=commits`, "media"));
        }),
        step(mark, "Keybase", async () => {
          const j = await getJSON(`https://keybase.io/_/api/1.0/user/lookup.json?usernames=${enc(u)}&fields=basics,proofs_summary,profile`);
          const them = (j.them || [])[0];
          if (!them) { out.push(F("Cuentas verificadas", "Keybase: no existe", "Keybase", "", "alta")); return; }
          out.push(F("Cuentas verificadas", `Keybase: ${them.profile?.full_name || u}`, "Keybase", `https://keybase.io/${u}`, "alta", them.profile?.bio || ""));
          (them.proofs_summary?.all || []).forEach((p) => out.push(F("Identidades probadas criptográficamente", `${p.proof_type}: ${p.nametag}`, "Keybase", safeUrl(p.service_url) || "", "alta", "Keybase verificó que la misma persona controla esta cuenta.")));
        }),
      ]);
      out.push(F("Advertencia", "Un mismo alias en dos sitios es una hipótesis, no una identidad", "OSINTario", "", "baja", "Compara foto, fecha de creación, idioma y contactos antes de vincular cuentas."));
      extra.links = PLATFORMS.map(([n, t]) => [n, t.replace("{u}", enc(u))]);
    },
  },
  email: {
    title: "Email", label: "Email", ph: "nombre@dominio.com", examples: [],
    desc: "Perfil público de Gravatar, configuración del dominio (MX, SPF, DMARC), brechas conocidas del dominio y enlaces para seguir investigando. No envía nada al buzón investigado.",
    sources: ["Gravatar", "Google DNS", "Have I Been Pwned"],
    parse(v) { const e = v.trim().toLowerCase(); if (!RE.email.test(e)) throw new Error("Escribe un email válido, por ejemplo nombre@dominio.com."); return e; },
    async run(e, out, mark, extra) {
      const domain = e.split("@")[1];
      const free = /^(gmail|googlemail|hotmail|outlook|live|yahoo|icloud|me|proton|protonmail|gmx|aol|yandex|mail)\./.test(domain);
      await Promise.all([
        step(mark, "Gravatar", async () => {
          const h = await sha256Hex(e);
          const j = await getJSON(`https://gravatar.com/${h}.json`).catch(() => ({ __notFound: true }));
          const p = j.entry && j.entry[0];
          if (!p) { out.push(F("Perfil público", "Sin perfil de Gravatar", "Gravatar", "", "alta")); return; }
          out.push(F("Perfil público", `Gravatar: ${p.displayName || p.preferredUsername}`, "Gravatar", p.profileUrl, "alta", [p.aboutMe, p.currentLocation].filter(Boolean).join(" · ")));
          (p.accounts || []).forEach((a) => out.push(F("Cuentas vinculadas en Gravatar", `${a.shortname || a.name}: ${a.display || a.username || ""}`, "Gravatar", safeUrl(a.url) || "", "alta")));
          (p.urls || []).forEach((u) => out.push(F("Cuentas vinculadas en Gravatar", u.title || u.value, "Gravatar", safeUrl(u.value) || "", "media")));
        }),
        step(mark, "Google DNS", async () => {
          const mx = await dnsQuery(domain, "MX");
          out.push(F("Dominio del email", mx.length ? `Recibe correo: ${mx.slice(0, 3).join(", ")}` : "El dominio no tiene MX: el email probablemente no existe", "Google DNS", "", "alta"));
          if (!free) out.push(F("Dominio del email", `Es un dominio propio (${domain}): investígalo en la pestaña Dominio`, "OSINTario", "", "media"));
          else out.push(F("Dominio del email", `Proveedor gratuito (${domain})`, "OSINTario", "", "alta"));
        }),
        step(mark, "Have I Been Pwned", async () => {
          if (free) { out.push(F("Brechas del dominio", "Proveedor gratuito: revisa el email puntual en HIBP", "Have I Been Pwned", "https://haveibeenpwned.com/", "media")); return; }
          const j = await getJSON(`https://haveibeenpwned.com/api/v3/breaches?domain=${enc(domain)}`);
          if (!Array.isArray(j) || !j.length) { out.push(F("Brechas del dominio", "El servicio de este dominio no figura como fuente de brechas", "Have I Been Pwned", "", "alta")); return; }
          j.forEach((b) => out.push(F("Brechas del dominio", `${b.Title} (${b.BreachDate})`, "Have I Been Pwned", `https://haveibeenpwned.com/PwnedWebsites#${b.Name}`, "alta", `${Number(b.PwnCount).toLocaleString("es-ES")} cuentas · ${(b.DataClasses || []).slice(0, 5).join(", ")}`)));
        }),
      ]);
      extra.links = [
        ["Have I Been Pwned (email puntual)", "https://haveibeenpwned.com/"],
        ["Epieos (cuentas Google y más)", "https://epieos.com/"],
        ["Hunter (verificar email)", `https://hunter.io/email-verifier/${enc(e)}`],
        ["Búsqueda exacta en Google", `https://www.google.com/search?q=${enc('"' + e + '"')}`],
        ["Búsqueda exacta en Bing", `https://www.bing.com/search?q=${enc('"' + e + '"')}`],
        ["En GitHub (commits y código)", `https://github.com/search?q=${enc('"' + e + '"')}&type=code`],
        ["En Pastebin vía Google", `https://www.google.com/search?q=${enc('site:pastebin.com "' + e + '"')}`],
        ["Intelligence X", `https://intelx.io/?s=${enc(e)}`],
      ];
    },
  },
  phone: {
    title: "Teléfono", label: "Teléfono con código de país", ph: "+351 912 345 678", examples: [],
    desc: "Normaliza el número y prepara búsquedas en sus distintos formatos. Los directorios de teléfonos envejecen rápido: contrasta siempre con más de una fuente.",
    sources: [],
    parse(v) { const d = v.replace(/[^\d+]/g, ""); if (!/^\+\d{8,15}$/.test(d)) throw new Error("Escribe el número con código de país, por ejemplo +351912345678."); return d; },
    async run(p, out, mark, extra) {
      const n = p.slice(1); const local = n.slice(-9);
      const formats = [p, n, local, `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`, `${local.slice(0, 3)}-${local.slice(3, 6)}-${local.slice(6)}`];
      out.push(F("Formatos a buscar", formats.join(" · "), "OSINTario", "", "alta", "Prueba cada formato: las páginas publican los números de formas distintas."));
      out.push(F("Advertencia", "Un número puede haber cambiado de titular", "OSINTario", "", "baja", "Las líneas se reasignan: verifica la fecha de cada fuente."));
      const q = formats.slice(0, 4).map((f) => `"${f}"`).join(" OR ");
      extra.links = [
        ["Google (todos los formatos)", `https://www.google.com/search?q=${enc(q)}`],
        ["Bing (todos los formatos)", `https://www.bing.com/search?q=${enc(q)}`],
        ["DuckDuckGo", `https://duckduckgo.com/?q=${enc('"' + p + '"')}`],
        ["En documentos PDF", `https://www.google.com/search?q=${enc("(" + q + ") filetype:pdf")}`],
        ["Contexto de estafa", `https://www.google.com/search?q=${enc('"' + p + '" estafa OR scam OR fraude')}`],
        ["Truecaller (requiere cuenta)", `https://www.truecaller.com/search/global/${enc(n)}`],
        ["Sync.me", `https://sync.me/search/?number=${enc(p)}`],
        ["Telegram", `https://t.me/${enc(p)}`],
      ];
    },
  },
  image: {
    title: "Imagen y metadatos", label: "Imagen", file: true,
    desc: "Lee los metadatos EXIF (cámara, fecha, software, GPS) y calcula el hash SHA-256 del archivo para tu cadena de custodia. La imagen no sale de tu equipo.",
    sources: [],
  },
  dorks: {
    title: "Generador de dorks", label: "Dominio u organización", ph: "empresa.com", examples: ["empresa.com"],
    desc: "Arma búsquedas avanzadas de Google para encontrar documentos, paneles expuestos, filtraciones y menciones. Úsalas solo sobre objetivos que tienes autorización para investigar.",
    sources: [],
    parse(v) { const d = cleanDomain(v); if (!RE.domain.test(d)) throw new Error("Escribe un dominio, por ejemplo empresa.com."); return d; },
    async run(d, out, mark, extra) {
      const name = d.split(".")[0];
      const dorks = [
        ["Documentos públicos", `site:${d} (filetype:pdf OR filetype:docx OR filetype:xlsx OR filetype:pptx)`],
        ["Listados de directorios", `site:${d} intitle:"index of"`],
        ["Paneles de acceso", `site:${d} (inurl:login OR inurl:admin OR inurl:signin OR intitle:"dashboard")`],
        ["Archivos de configuración o logs", `site:${d} (ext:env OR ext:log OR ext:sql OR ext:bak OR ext:conf OR ext:ini)`],
        ["Errores que revelan tecnología", `site:${d} ("sql syntax" OR "stack trace" OR "Warning: mysql" OR "Fatal error")`],
        ["Subdominios indexados", `site:*.${d} -www`],
        ["Emails del dominio", `"@${d}" -site:${d}`],
        ["Menciones en Pastebin y similares", `"${d}" (site:pastebin.com OR site:ghostbin.co OR site:justpaste.it)`],
        ["Código en GitHub o GitLab", `"${d}" (site:github.com OR site:gitlab.com)`],
        ["Tableros y documentos compartidos", `"${d}" (site:trello.com OR site:docs.google.com OR site:notion.site)`],
        ["Buckets en la nube", `"${name}" (site:s3.amazonaws.com OR site:blob.core.windows.net OR site:storage.googleapis.com)`],
        ["Empleados en LinkedIn", `site:linkedin.com/in "${name}"`],
        ["Presentaciones y charlas", `"${name}" (site:slideshare.net OR site:speakerdeck.com)`],
      ];
      dorks.forEach(([t, q]) => out.push(F("Dorks listos para usar", t, "Google", `https://www.google.com/search?q=${enc(q)}`, "media", q)));
    },
  },
};

async function step(mark, name, fn) {
  mark(name, "run");
  try { const r = await fn(); mark(name, "ok"); return r; }
  catch (e) { mark(name, "err", e.name === "AbortError" ? "tardó demasiado" : (e.message === "Failed to fetch" || !e.message ? "no respondió" : e.message)); return null; }
}

/* ---------- Interfaz ---------- */
let current = "domain";
function selectTool(key) {
  current = key; const t = TOOLS[key];
  document.querySelectorAll(".tool-nav button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tool === key)));
  $("#t-title").textContent = t.title; $("#t-desc").textContent = t.desc;
  $("#t-label").textContent = t.label; $("#t-input").hidden = !!t.file; $("#t-file").hidden = !t.file; $("#t-go").hidden = !!t.file;
  $("#t-input").placeholder = t.ph || ""; $("#t-input").setAttribute("aria-label", t.label); $("#t-file").setAttribute("aria-label", t.label);
  $("#t-msg").textContent = ""; $("#t-out").innerHTML = "";
  const ex = $("#t-examples"); ex.innerHTML = "";
  if (t.examples && t.examples.length) {
    ex.append("Prueba con:");
    t.examples.forEach((v) => { const b = el("button", { type: "button", text: v }); b.addEventListener("click", () => { $("#t-input").value = v; $("#t-form").requestSubmit(); }); ex.append(b); });
  }
  if (location.hash !== "#" + key) history.replaceState(null, "", "#" + key);
}
document.querySelectorAll(".tool-nav button").forEach((b) => b.addEventListener("click", () => selectTool(b.dataset.tool)));

$("#t-form").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const t = TOOLS[current]; $("#t-msg").textContent = "";
  let target;
  try { target = t.parse($("#t-input").value); } catch (e) { $("#t-msg").textContent = e.message; return; }
  $("#t-go").disabled = true;
  const out = []; const extra = {};
  const prog = el("div", { class: "progress", "aria-label": "Fuentes consultadas" });
  const chips = {};
  const mark = (name, state, err) => {
    if (!chips[name]) { chips[name] = el("span", { class: "src", text: name }); prog.append(chips[name]); }
    chips[name].className = "src" + (state === "ok" ? " ok" : state === "err" ? " err" : "");
    chips[name].textContent = name + (state === "run" ? " …" : state === "err" ? ` · ${err}` : " ✓");
  };
  const box = $("#t-out"); box.innerHTML = ""; box.append(el("div", { class: "report" }, el("p", { class: "meta", text: `Investigando ${target}…` }), prog));
  try { await t.run(target, out, mark, extra); } finally { $("#t-go").disabled = false; }
  const errors = Object.entries(chips).filter(([, c]) => c.classList.contains("err")).map(([n, c]) => c.textContent);
  await renderReport({ tool: current, title: t.title, target, findings: out, links: extra.links || [], errors }, prog);
});

async function renderReport(r, prog) {
  const report = { generator: "Multi-OSINT Lite · OSINTario", version: 1, tool: r.tool, target: r.target, generated_at_utc: new Date().toISOString(),
    findings: r.findings, manual_links: r.links.map(([n, u]) => ({ name: n, url: u })), unavailable_sources: r.errors,
    disclaimer: "Hallazgos de fuentes abiertas. Cada resultado es una pista: valídalo con una segunda fuente antes de concluir." };
  const json = JSON.stringify(report, null, 2);
  const hash = await sha256Hex(json);
  const wrap = el("article", { class: "report" });
  const actions = el("div", { class: "actions" });
  const dl = (name, text, type) => { const a = el("a", { href: URL.createObjectURL(new Blob([text], { type })), download: name }); document.body.append(a); a.click(); a.remove(); };
  const md = toMarkdown(report, hash);
  [["Descargar JSON", () => dl(`osintario-${r.tool}-${r.target}.json`, json, "application/json")],
   ["Descargar Markdown", () => dl(`osintario-${r.tool}-${r.target}.md`, md, "text/markdown")],
   ["Copiar resumen", async (b) => { try { await navigator.clipboard.writeText(md); b.textContent = "Copiado"; } catch { b.textContent = "No se pudo copiar"; } }],
   ["Imprimir / PDF", () => window.print()]].forEach(([t, fn]) => { const b = el("button", { type: "button", text: t }); b.addEventListener("click", () => fn(b)); actions.append(b); });
  wrap.append(el("div", { class: "report-head" },
    el("div", {}, el("h3", { text: `${r.title}: ${r.target}` }), el("div", { class: "meta", text: `${report.generated_at_utc} · ${r.findings.length} hallazgos · SHA-256 ${hash}` })), actions), prog);
  const groups = {};
  r.findings.forEach((f) => (groups[f.category] ||= []).push(f));
  for (const [cat, items] of Object.entries(groups)) {
    wrap.append(el("h4", { class: "cat", text: `${cat} (${items.length})` }));
    items.forEach((f) => {
      const u = safeUrl(f.url);
      wrap.append(el("div", { class: "item" },
        el("div", {}, u ? el("a", { href: u, target: "_blank", rel: "noopener noreferrer", text: f.title }) : el("span", { text: f.title }), el("div", { class: "s", text: f.source })),
        el("span", { class: `pill c-${f.confidence}`, text: `confianza ${f.confidence}` }),
        f.note ? el("div", { class: "note", text: f.note }) : null));
    });
  }
  if (r.links.length) {
    wrap.append(el("h4", { class: "cat", text: `Revisión manual (${r.links.length})` }));
    const grid = el("div", { class: "links" });
    r.links.forEach(([n, u]) => { const s = safeUrl(u); if (s) grid.append(el("a", { href: s, target: "_blank", rel: "noopener noreferrer" }, n, el("span", { text: new URL(s).hostname }))); });
    wrap.append(grid);
  }
  wrap.append(el("p", { class: "disclaimer", text: report.disclaimer }));
  $("#t-out").innerHTML = ""; $("#t-out").append(wrap);
}

function toMarkdown(rep, hash) {
  const lines = [`# Informe OSINT: ${rep.target}`, "", `- Herramienta: ${rep.generator} (${rep.tool})`, `- Fecha (UTC): ${rep.generated_at_utc}`, `- SHA-256 del informe JSON: ${hash}`, ""];
  const g = {}; rep.findings.forEach((f) => (g[f.category] ||= []).push(f));
  for (const [c, items] of Object.entries(g)) {
    lines.push(`## ${c}`, "");
    items.forEach((f) => lines.push(`- ${f.url ? `[${f.title}](${f.url})` : f.title} — ${f.source}, confianza ${f.confidence}${f.note ? `. ${f.note}` : ""}`));
    lines.push("");
  }
  if (rep.manual_links.length) { lines.push("## Revisión manual", ""); rep.manual_links.forEach((l) => lines.push(`- [${l.name}](${l.url})`)); lines.push(""); }
  if (rep.unavailable_sources.length) lines.push("## Fuentes no disponibles", "", ...rep.unavailable_sources.map((e) => `- ${e}`), "");
  lines.push(`> ${rep.disclaimer}`);
  return lines.join("\n");
}

/* Imagen: análisis local */
$("#t-file").addEventListener("change", async (e) => {
  const file = e.target.files[0]; const box = $("#t-out"); box.innerHTML = ""; if (!file) return;
  const buf = await file.arrayBuffer(); const hash = await sha256Hex(buf);
  const table = el("table", { class: "kv" }); const row = (k, v) => table.append(el("tr", {}, el("td", { text: k }), el("td", { text: String(v) })));
  row("Archivo", file.name); row("Tipo", file.type || "desconocido"); row("Tamaño", `${(file.size / 1024).toFixed(1)} KB`); row("Última modificación (según tu equipo)", new Date(file.lastModified).toISOString()); row("SHA-256", hash);
  let meta = null; try { meta = await exifr.parse(buf, { tiff: true, exif: true, gps: true, xmp: true, iptc: true, icc: false }); } catch { meta = null; }
  const links = el("div", { class: "links" });
  if (meta && Object.keys(meta).length) {
    ["Make", "Model", "LensModel", "Software", "DateTimeOriginal", "CreateDate", "ModifyDate", "OffsetTimeOriginal", "Artist", "Copyright", "ImageDescription", "Creator", "City", "Country", "latitude", "longitude", "GPSAltitude"]
      .forEach((k) => { if (meta[k] != null) row(k, meta[k] instanceof Date ? meta[k].toISOString() : meta[k]); });
    if (meta.latitude != null && meta.longitude != null) {
      const la = meta.latitude.toFixed(6), lo = meta.longitude.toFixed(6);
      links.append(el("a", { href: `https://www.openstreetmap.org/?mlat=${la}&mlon=${lo}#map=17/${la}/${lo}`, target: "_blank", rel: "noopener noreferrer" }, "Ubicación GPS en OpenStreetMap", el("span", { text: `${la}, ${lo}` })));
      links.append(el("a", { href: `https://www.google.com/maps?q=${la},${lo}`, target: "_blank", rel: "noopener noreferrer" }, "Ubicación en Google Maps", el("span", { text: "maps" })));
    }
    if (meta.Software && /photoshop|gimp|lightroom|snapseed|canva|picsart/i.test(meta.Software)) row("Señal", "La imagen pasó por un editor: pudo ser modificada.");
  } else row("Metadatos", "No tiene EXIF. Las redes sociales y las apps de mensajería los borran al subir la imagen.");
  [["Google Lens", "https://lens.google.com/"], ["TinEye", "https://tineye.com/"], ["Yandex Imágenes", "https://yandex.com/images/"], ["Bing Visual Search", "https://www.bing.com/visualsearch"], ["FotoForensics (análisis ELA)", "https://fotoforensics.com/"]]
    .forEach(([n, u]) => links.append(el("a", { href: u, target: "_blank", rel: "noopener noreferrer" }, n, el("span", { text: "subir la imagen allí" }))));
  box.append(el("div", { class: "report" }, el("div", { class: "report-head" }, el("h3", { text: `Imagen: ${file.name}` })), table,
    el("h4", { class: "cat", text: "Búsqueda inversa y forense" }), links,
    el("p", { class: "disclaimer", text: "La búsqueda inversa muestra dónde apareció una imagen, no dónde se tomó. Guarda el SHA-256 junto al archivo original como evidencia." })));
});

selectTool(TOOLS[location.hash.slice(1)] ? location.hash.slice(1) : "domain");
