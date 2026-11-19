"use strict";
/* Multi-OSINT Lite · OSINTario · Todo corre en el navegador del usuario. Idiomas: ES / EN / PT. */
const LI = { es: 0, en: 1, pt: 2 }[document.documentElement.lang.slice(0, 2)] ?? 0;
const tr = (es, en, pt) => [es, en, pt][LI];
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
async function getJSON(url, { timeout = 20000, headers = {}, text = false } = {}) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), timeout);
  try {
    const r = await fetch(url, { signal: ctl.signal, headers: { accept: "application/json, application/dns-json", ...headers }, referrerPolicy: "no-referrer" });
    if (r.status === 404) return { __notFound: true };
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return text ? await r.text() : await r.json();
  } finally { clearTimeout(t); }
}
const F = (category, title, source, url = "", confidence = "media", note = "") => ({ category, title, source, url, confidence, note });
const CONF = { alta: tr("confianza alta", "high confidence", "confiança alta"), media: tr("confianza media", "medium confidence", "confiança média"), baja: tr("confianza baja", "low confidence", "confiança baixa") };
const fmtN = (n) => Number(n).toLocaleString(["es-ES", "en-US", "pt-PT"][LI]);

/* ---------- Validación ---------- */
const RE = {
  domain: /^(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/,
  ipv4: /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/,
  alias: /^[A-Za-z0-9][A-Za-z0-9._-]{1,39}$/,
  email: /^[A-Za-z0-9][A-Za-z0-9._%+-]{0,63}@[A-Za-z0-9.-]{1,253}\.[A-Za-z]{2,24}$/,
  onion: /^[a-z2-7]{56}\.onion$/,
};
const cleanDomain = (v) => v.trim().toLowerCase().replace(/^https?:\/\//, "").split(/[/?#]/)[0].replace(/^www\./, "");
function isPrivateIp(ip) {
  const [a, b] = ip.split(".").map(Number);
  return a === 10 || a === 127 || a === 0 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254) || a >= 224 || (a === 100 && b >= 64 && b <= 127);
}

/* ---------- Categorías de hallazgos ---------- */
const C = {
  pivots: tr("Pivotes sugeridos", "Suggested pivots", "Pivôs sugeridos"),
  mail: tr("Correo y suplantación", "Email and spoofing", "Email e falsificação"),
  saas: tr("Servicios que usa", "Services in use", "Serviços em uso"),
  subs: tr("Subdominios (transparencia de certificados)", "Subdomains (certificate transparency)", "Subdomínios (transparência de certificados)"),
  reg: tr("Registro del dominio", "Domain registration", "Registro do domínio"),
  risk: tr("Señales de riesgo", "Risk signals", "Sinais de risco"),
  hist: tr("Historial web", "Web history", "Histórico web"),
  rep: tr("Reputación e inteligencia de amenazas", "Reputation and threat intelligence", "Reputação e inteligência de ameaças"),
  exp: tr("Exposición (Shodan)", "Exposure (Shodan)", "Exposição (Shodan)"),
  vulns: tr("Vulnerabilidades conocidas (sin verificar)", "Known vulnerabilities (unverified)", "Vulnerabilidades conhecidas (não verificadas)"),
  net: tr("Ubicación y red", "Location and network", "Localização e rede"),
  tor: tr("Red Tor", "Tor network", "Rede Tor"),
  verified: tr("Cuentas verificadas", "Verified accounts", "Contas verificadas"),
  proofs: tr("Identidades probadas criptográficamente", "Cryptographically proven identities", "Identidades provadas criptograficamente"),
  warn: tr("Advertencia", "Warning", "Aviso"),
  profile: tr("Perfil público", "Public profile", "Perfil público"),
  linked: tr("Cuentas vinculadas", "Linked accounts", "Contas vinculadas"),
  edomain: tr("Dominio del email", "Email domain", "Domínio do email"),
  breaches: tr("Brechas del dominio", "Domain breaches", "Vazamentos do domínio"),
  formats: tr("Formatos a buscar", "Formats to search", "Formatos para buscar"),
  dorks: tr("Dorks listos para usar", "Ready-to-use dorks", "Dorks prontos para usar"),
  onion: tr("Servicio .onion", ".onion service", "Serviço .onion"),
};

/* ---------- Fuentes ---------- */
const DNS_T = { A: 1, AAAA: 28, MX: 15, NS: 2, TXT: 16, CAA: 257, PTR: 12, CNAME: 5 };
async function dnsQuery(name, type) {
  const j = await getJSON(`https://dns.google/resolve?name=${enc(name)}&type=${type}`);
  return (j.Answer || []).filter((a) => a.type === DNS_T[type]).map((a) => a.data.replace(/^"|"$/g, "").replace(/" "/g, ""));
}

async function srcDNS(domain, out) {
  const types = ["A", "AAAA", "MX", "NS", "TXT", "CAA"];
  const res = await Promise.all(types.map((t) => dnsQuery(domain, t).catch(() => [])));
  types.forEach((t, i) => res[i].slice(0, 15).forEach((v) => out.push(F(`DNS ${t}`, v, "Google DNS", "", "alta"))));
  const txt = res[4].join(" ");
  const spf = res[4].find((t) => t.startsWith("v=spf1"));
  out.push(F(C.mail, spf ? tr("SPF configurado", "SPF configured", "SPF configurado") : tr("Sin registro SPF", "No SPF record", "Sem registro SPF"), "Google DNS", "", "alta",
    spf || tr("Cualquiera podría enviar emails haciéndose pasar por este dominio.", "Anyone could send email pretending to be this domain.", "Qualquer um poderia enviar emails se passando por este domínio.")));
  const dmarc = (await dnsQuery(`_dmarc.${domain}`, "TXT").catch(() => [])).find((t) => t.startsWith("v=DMARC1"));
  const policy = dmarc ? (dmarc.match(/p=(\w+)/) || [])[1] : null;
  out.push(F(C.mail, dmarc ? tr(`DMARC con política "${policy}"`, `DMARC with "${policy}" policy`, `DMARC com política "${policy}"`) : tr("Sin DMARC", "No DMARC", "Sem DMARC"), "Google DNS", "", "alta",
    dmarc ? (policy === "none" ? tr("Política en modo observación: no bloquea la suplantación.", "Monitoring-only policy: it does not block spoofing.", "Política em modo observação: não bloqueia a falsificação.") : dmarc)
      : tr("Recomendable para evitar phishing con este dominio.", "Recommended to prevent phishing with this domain.", "Recomendável para evitar phishing com este domínio.")));
  const verif = (txt.match(/(google-site-verification|MS=|facebook-domain-verification|atlassian-domain-verification|apple-domain-verification|stripe-verification|docusign|zoom|hubspot|adobe-idp-site-verification)/gi) || []);
  if (verif.length) out.push(F(C.saas, [...new Set(verif.map((v) => v.replace(/[-=].*$/, "").toLowerCase()))].join(", "), "TXT", "", "media",
    tr("Los registros de verificación revelan proveedores SaaS de la organización.", "Verification records reveal the organization's SaaS providers.", "Os registros de verificação revelam fornecedores SaaS da organização.")));
  return res[0];
}

async function srcCrt(domain, out) {
  const url = `https://crt.sh/?q=${enc("%." + domain)}&output=json`;
  let j;
  try { j = await getJSON(url, { timeout: 30000 }); }
  catch { await new Promise((r) => setTimeout(r, 2500)); j = await getJSON(url, { timeout: 40000 }); } // crt.sh falla a menudo: un reintento
  if (j.__notFound || !Array.isArray(j)) return;
  const subs = new Set();
  for (const row of j) for (const n of String(row.name_value || "").split("\n")) {
    const s = n.trim().toLowerCase().replace(/^\*\./, "");
    if (s.endsWith(domain) && s !== domain) subs.add(s);
  }
  const list = [...subs].sort();
  const juicy = /(dev|test|staging|stage|uat|qa|admin|vpn|jenkins|git|jira|internal|old|backup|api|beta|mail|portal)/;
  list.slice(0, 150).forEach((s) => out.push(F(C.subs, s, "crt.sh", `https://crt.sh/?q=${enc(s)}`, "alta", juicy.test(s) ? tr("Nombre sensible: revisa si está expuesto.", "Sensitive name: check whether it is exposed.", "Nome sensível: verifique se está exposto.") : "")));
  if (list.length > 150) out.push(F(C.subs, tr(`${list.length - 150} más no mostrados`, `${list.length - 150} more not shown`, `${list.length - 150} a mais não exibidos`), "crt.sh", `https://crt.sh/?q=${enc("%." + domain)}`, "alta"));
  if (!list.length) out.push(F(C.subs, tr("No se encontraron subdominios", "No subdomains found", "Nenhum subdomínio encontrado"), "crt.sh", "", "media"));
}

async function srcRDAP(domain, out) {
  const j = await getJSON(`https://rdap.org/domain/${enc(domain)}`);
  if (j.__notFound) { out.push(F(C.reg, tr("Sin datos RDAP (algunos países no publican RDAP)", "No RDAP data (some countries don't publish RDAP)", "Sem dados RDAP (alguns países não publicam RDAP)"), "RDAP", "", "baja")); return; }
  const map = { registration: tr("Registrado", "Registered", "Registrado"), expiration: tr("Vence", "Expires", "Expira"), "last changed": tr("Último cambio", "Last changed", "Última alteração") };
  for (const ev of j.events || []) if (map[ev.eventAction]) out.push(F(C.reg, `${map[ev.eventAction]}: ${String(ev.eventDate).slice(0, 10)}`, "RDAP", "", "alta"));
  for (const ent of j.entities || []) {
    const fn = ((ent.vcardArray || [])[1] || []).find((v) => v[0] === "fn");
    if ((ent.roles || []).includes("registrar") && fn) out.push(F(C.reg, `${tr("Registrador", "Registrar", "Registrador")}: ${fn[3]}`, "RDAP", "", "alta"));
    if ((ent.roles || []).includes("registrant") && fn && !/redacted|privacy|proxy/i.test(fn[3])) out.push(F(C.reg, `${tr("Titular", "Registrant", "Titular")}: ${fn[3]}`, "RDAP", "", "media"));
  }
  const reg = (j.events || []).find((e) => e.eventAction === "registration");
  if (reg) {
    const days = Math.round((Date.now() - new Date(reg.eventDate)) / 86400000);
    if (days < 90) out.push(F(C.risk, tr(`Dominio creado hace ${days} días`, `Domain created ${days} days ago`, `Domínio criado há ${days} dias`), "RDAP", "", "alta",
      tr("Los dominios muy nuevos son frecuentes en phishing y estafas.", "Very new domains are common in phishing and scams.", "Domínios muito novos são comuns em phishing e golpes.")));
  }
}

async function srcWayback(target, out) {
  const j = await getJSON(`https://archive.org/wayback/available?url=${enc(target)}&timestamp=19960101`);
  const s = j.archived_snapshots && j.archived_snapshots.closest;
  if (s) { const d = s.timestamp; out.push(F(C.hist, `${tr("Primera captura cercana", "Earliest nearby capture", "Primeira captura próxima")}: ${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`, "Wayback Machine", s.url, "alta")); }
  else out.push(F(C.hist, tr("Sin capturas en Wayback Machine", "No Wayback Machine captures", "Sem capturas na Wayback Machine"), "Wayback Machine", "", "media"));
  out.push(F(C.hist, tr("Ver todas las capturas", "See all captures", "Ver todas as capturas"), "Wayback Machine", `https://web.archive.org/web/*/${target}*`, "alta"));
}

async function srcOTX(kind, value, out) {
  const j = await getJSON(`https://otx.alienvault.com/api/v1/indicators/${kind === "ip" ? "IPv4/" + value : "domain/" + value}/general`);
  const n = (j.pulse_info && j.pulse_info.count) || 0;
  out.push(F(C.rep, n ? tr(`Aparece en ${n} reportes de amenazas`, `Appears in ${n} threat reports`, `Aparece em ${n} relatórios de ameaças`) : tr("Sin reportes de amenazas", "No threat reports", "Sem relatórios de ameaças"), "AlienVault OTX",
    `https://otx.alienvault.com/indicator/${kind === "ip" ? "ip" : "domain"}/${value}`, n ? "media" : "alta",
    n ? tr("Revisa los reportes: puede ser un falso positivo (por ejemplo, un servicio compartido).", "Review the reports: it may be a false positive (e.g. a shared service).", "Revise os relatórios: pode ser um falso positivo (por exemplo, um serviço compartilhado).") : ""));
  (j.pulse_info?.pulses || []).slice(0, 5).forEach((p) => out.push(F(C.rep, p.name, "AlienVault OTX", `https://otx.alienvault.com/pulse/${p.id}`, "media", (p.tags || []).slice(0, 5).join(", "))));
}

async function srcInternetDB(ip, out) {
  const j = await getJSON(`https://internetdb.shodan.io/${ip}`);
  if (j.__notFound) { out.push(F(C.exp, `${ip}: ${tr("sin datos de puertos abiertos", "no open port data", "sem dados de portas abertas")}`, "Shodan InternetDB", "", "media")); return; }
  out.push(F(C.exp, `${ip}: ${tr("puertos abiertos", "open ports", "portas abertas")} ${(j.ports || []).join(", ") || tr("ninguno", "none", "nenhuma")}`, "Shodan InternetDB", `https://www.shodan.io/host/${ip}`, "alta",
    [(j.hostnames || []).slice(0, 5).join(", "), (j.cpes || []).slice(0, 4).join(", ")].filter(Boolean).join(" · ")));
  (j.vulns || []).slice(0, 10).forEach((v) => out.push(F(C.vulns, v, "Shodan InternetDB", `https://nvd.nist.gov/vuln/detail/${v}`, "baja",
    tr(`En ${ip}. Shodan las infiere por versión: confirma antes de reportar.`, `On ${ip}. Shodan infers them from versions: confirm before reporting.`, `Em ${ip}. O Shodan as infere pela versão: confirme antes de reportar.`))));
}

async function srcIpinfo(ip, out) {
  const j = await getJSON(`https://ipinfo.io/${ip}/json`);
  if (j.bogon) { out.push(F(C.net, tr("IP privada o reservada", "Private or reserved IP", "IP privado ou reservado"), "ipinfo", "", "alta")); return; }
  out.push(F(C.net, [j.city, j.region, j.country].filter(Boolean).join(", "), "ipinfo", `https://ipinfo.io/${ip}`, "media",
    tr("La geolocalización por IP es aproximada (ciudad del proveedor, no del usuario).", "IP geolocation is approximate (the provider's city, not the user's).", "A geolocalização por IP é aproximada (cidade do provedor, não do usuário).")));
  if (j.org) out.push(F(C.net, `${tr("Red", "Network", "Rede")}: ${j.org}`, "ipinfo", "", "alta"));
  if (j.hostname) out.push(F(C.net, `${tr("Nombre inverso", "Reverse name", "Nome reverso")}: ${j.hostname}`, "ipinfo", "", "alta"));
}

async function srcOnionoo(ip, out) {
  const j = await getJSON(`https://onionoo.torproject.org/details?search=${enc(ip)}&fields=nickname,running,flags,first_seen,last_seen,country_name,as_name,or_addresses,exit_addresses`);
  const hit = (j.relays || []).find((r) => (r.or_addresses || []).some((a) => a.split(":")[0] === ip) || (r.exit_addresses || []).includes(ip));
  if (!hit) {
    out.push(F(C.tor, tr("No figura como nodo de Tor actual", "Not listed as a current Tor relay", "Não consta como nó Tor atual"), "Tor Onionoo", "", "alta",
      tr("Para fechas pasadas usa ExoneraTor.", "For past dates, use ExoneraTor.", "Para datas passadas, use o ExoneraTor.")));
    return;
  }
  const exit = (hit.flags || []).includes("Exit");
  out.push(F(C.tor, `${exit ? tr("Nodo de SALIDA de Tor", "Tor EXIT relay", "Nó de SAÍDA do Tor") : tr("Nodo de Tor", "Tor relay", "Nó Tor")}: ${hit.nickname} (${hit.running ? tr("activo", "running", "ativo") : tr("inactivo", "not running", "inativo")})`,
    "Tor Onionoo", `https://metrics.torproject.org/rs.html#search/${ip}`, "alta",
    `${tr("Visto desde", "Seen since", "Visto desde")} ${String(hit.first_seen).slice(0, 10)} · ${hit.as_name || ""} · ${hit.country_name || ""}` +
    (exit ? " · " + tr("El tráfico de esta IP puede venir de cualquier usuario de Tor: no la atribuyas a una persona.", "Traffic from this IP can come from any Tor user: don't attribute it to a person.", "O tráfego deste IP pode vir de qualquer usuário Tor: não o atribua a uma pessoa.") : "")));
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
  ["Hacker News", "https://news.ycombinator.com/user?id={u}"], ["CodePen", "https://codepen.io/{u}"], ["Pastebin", "https://pastebin.com/u/{u}"], ["Mastodon", "https://mastodon.social/search?q={u}"],
];

const TOOLS = {
  domain: {
    title: tr("Dominio o empresa", "Domain or company", "Domínio ou empresa"), ph: "empresa.com", examples: ["wikipedia.org", "osintario.github.io"],
    desc: tr("DNS, protección contra suplantación (SPF/DMARC), subdominios por certificados, registro, historial web, reputación y puertos expuestos de sus IPs.",
      "DNS, spoofing protection (SPF/DMARC), subdomains from certificates, registration, web history, reputation and exposed ports on its IPs.",
      "DNS, proteção contra falsificação (SPF/DMARC), subdomínios por certificados, registro, histórico web, reputação e portas expostas dos seus IPs."),
    parse(v) { const d = cleanDomain(v); if (!RE.domain.test(d)) throw new Error(tr("Escribe un dominio válido, por ejemplo empresa.com.", "Enter a valid domain, e.g. company.com.", "Digite um domínio válido, por exemplo empresa.com.")); return d; },
    async run(d, out, mark) {
      const ips = await step(mark, "Google DNS", () => srcDNS(d, out)) || [];
      const pub = ips.filter((i) => RE.ipv4.test(i) && !isPrivateIp(i));
      await Promise.all([
        step(mark, "crt.sh", () => srcCrt(d, out)),
        step(mark, "RDAP", () => srcRDAP(d, out)),
        step(mark, "Wayback Machine", () => srcWayback(d, out)),
        step(mark, "AlienVault OTX", () => srcOTX("domain", d, out)),
        step(mark, "Shodan InternetDB", async () => { for (const ip of pub.slice(0, 3)) await srcInternetDB(ip, out); }),
        step(mark, "ipinfo", async () => { if (pub[0]) await srcIpinfo(pub[0], out); }),
      ]);
      const name = d.split(".")[0];
      out.push(F(C.pivots, tr(`Buscar "${name}" en registros mercantiles`, `Search "${name}" in company registries`, `Buscar "${name}" em registros comerciais`), "OpenCorporates", `https://opencorporates.com/companies?q=${enc(name)}`, "baja",
        tr("Coincidencia por nombre: verifica que sea la misma organización.", "Name match: verify it's the same organization.", "Coincidência por nome: verifique se é a mesma organização.")));
      out.push(F(C.pivots, tr("Infecciones de infostealers del dominio", "Infostealer infections for the domain", "Infecções de infostealers do domínio"), "Hudson Rock", "https://www.hudsonrock.com/free-tools", "media"));
      out.push(F(C.pivots, tr("Exposición en la dark web (registro gratuito)", "Dark web exposure (free sign-up)", "Exposição na dark web (cadastro grátis)"), "SOCRadar", "https://socradar.io/free-tools/dark-web-report", "media"));
      out.push(F(C.pivots, tr("Análisis de la URL con capturas", "URL analysis with screenshots", "Análise da URL com capturas"), "URLScan", `https://urlscan.io/search/#${enc("domain:" + d)}`, "media"));
      out.push(F(C.pivots, tr("Reputación en VirusTotal", "VirusTotal reputation", "Reputação no VirusTotal"), "VirusTotal", `https://www.virustotal.com/gui/domain/${d}`, "media"));
    },
  },
  ip: {
    title: tr("Dirección IP", "IP address", "Endereço IP"), ph: "8.8.8.8", examples: ["8.8.8.8", "185.220.101.1"],
    desc: tr("Ubicación aproximada y red, nombre inverso, puertos abiertos y vulnerabilidades según Shodan, reputación y si es un nodo de Tor.",
      "Approximate location and network, reverse name, open ports and vulnerabilities per Shodan, reputation and whether it's a Tor relay.",
      "Localização aproximada e rede, nome reverso, portas abertas e vulnerabilidades segundo o Shodan, reputação e se é um nó Tor."),
    parse(v) {
      const ip = v.trim();
      if (!RE.ipv4.test(ip)) throw new Error(tr("Escribe una IPv4 válida, por ejemplo 8.8.8.8.", "Enter a valid IPv4, e.g. 8.8.8.8.", "Digite um IPv4 válido, por exemplo 8.8.8.8."));
      if (isPrivateIp(ip)) throw new Error(tr("Es una IP privada o reservada: no tiene información pública.", "It's a private or reserved IP: there's no public data.", "É um IP privado ou reservado: não há informação pública."));
      return ip;
    },
    async run(ip, out, mark) {
      await Promise.all([
        step(mark, "ipinfo", () => srcIpinfo(ip, out)),
        step(mark, "Shodan InternetDB", () => srcInternetDB(ip, out)),
        step(mark, "Google DNS", async () => { const ptr = await dnsQuery(ip.split(".").reverse().join(".") + ".in-addr.arpa", "PTR"); ptr.forEach((p) => out.push(F(C.net, `PTR: ${p}`, "Google DNS", "", "alta"))); }),
        step(mark, "AlienVault OTX", () => srcOTX("ip", ip, out)),
        step(mark, "Tor Onionoo", () => srcOnionoo(ip, out)),
      ]);
      out.push(F(C.pivots, tr("¿Fue nodo de Tor en una fecha concreta?", "Was it a Tor relay on a specific date?", "Foi nó Tor em uma data específica?"), "ExoneraTor", `https://metrics.torproject.org/exonerator.html?ip=${ip}`, "alta"));
      out.push(F(C.pivots, tr("Ruido o ataque dirigido", "Background noise or targeted attack", "Ruído ou ataque direcionado"), "GreyNoise", `https://viz.greynoise.io/ip/${ip}`, "media"));
      out.push(F(C.pivots, tr("Reputación en VirusTotal", "VirusTotal reputation", "Reputação no VirusTotal"), "VirusTotal", `https://www.virustotal.com/gui/ip-address/${ip}`, "media"));
      out.push(F(C.pivots, tr("Ficha completa en Shodan (requiere registro)", "Full Shodan record (login required)", "Ficha completa no Shodan (requer cadastro)"), "Shodan", `https://www.shodan.io/host/${ip}`, "media"));
    },
  },
  alias: {
    title: tr("Alias o nombre de usuario", "Username or handle", "Apelido ou nome de usuário"), ph: "username", examples: ["torvalds", "octocat"],
    desc: tr("Consulta GitHub y Keybase con datos verificables y prepara enlaces directos a 40 plataformas para revisar a mano. Para un barrido de miles de sitios usa Consensus OSINT o Maigret (ver directorio).",
      "Queries GitHub and Keybase for verifiable data and prepares direct links to 40 platforms for manual review. For a sweep of thousands of sites, use Consensus OSINT or Maigret (see directory).",
      "Consulta GitHub e Keybase com dados verificáveis e prepara links diretos para 40 plataformas para revisar à mão. Para varrer milhares de sites, use Consensus OSINT ou Maigret (ver diretório)."),
    parse(v) { const u = v.trim().replace(/^@/, ""); if (!RE.alias.test(u)) throw new Error(tr("El alias solo puede tener letras, números, punto, guion y guion bajo.", "Usernames may only contain letters, numbers, dots, hyphens and underscores.", "O apelido só pode ter letras, números, ponto, hífen e sublinhado.")); return u; },
    async run(u, out, mark, extra) {
      await Promise.all([
        step(mark, "GitHub API", async () => {
          const j = await getJSON(`https://api.github.com/users/${enc(u)}`);
          if (j.__notFound) { out.push(F(C.verified, tr("GitHub: no existe", "GitHub: not found", "GitHub: não existe"), "GitHub API", "", "alta")); return; }
          out.push(F(C.verified, `GitHub: ${j.name || j.login}`, "GitHub API", j.html_url, "alta",
            [j.bio, j.company && `${tr("Empresa", "Company", "Empresa")}: ${j.company}`, j.location && `${tr("Ubicación declarada", "Stated location", "Localização declarada")}: ${j.location}`,
              j.blog && `Web: ${j.blog}`, `${tr("Creada", "Created", "Criada")}: ${String(j.created_at).slice(0, 10)}`, `${j.public_repos} ${tr("repos públicos", "public repos", "repos públicos")}`].filter(Boolean).join(" · ")));
          if (j.blog) { const w = safeUrl(j.blog.startsWith("http") ? j.blog : "https://" + j.blog); if (w) out.push(F(C.pivots, `${tr("Web declarada", "Stated website", "Site declarado")}: ${j.blog}`, "GitHub API", w, "media")); }
          out.push(F(C.pivots, tr("Commits públicos (pueden revelar emails)", "Public commits (may reveal emails)", "Commits públicos (podem revelar emails)"), "GitHub", `https://github.com/search?q=author%3A${enc(u)}&type=commits`, "media"));
        }),
        step(mark, "Keybase", async () => {
          const j = await getJSON(`https://keybase.io/_/api/1.0/user/lookup.json?usernames=${enc(u)}&fields=basics,proofs_summary,profile`);
          const them = (j.them || [])[0];
          if (!them) { out.push(F(C.verified, tr("Keybase: no existe", "Keybase: not found", "Keybase: não existe"), "Keybase", "", "alta")); return; }
          out.push(F(C.verified, `Keybase: ${them.profile?.full_name || u}`, "Keybase", `https://keybase.io/${u}`, "alta", them.profile?.bio || ""));
          (them.proofs_summary?.all || []).forEach((p) => out.push(F(C.proofs, `${p.proof_type}: ${p.nametag}`, "Keybase", safeUrl(p.service_url) || "", "alta",
            tr("Keybase verificó que la misma persona controla esta cuenta.", "Keybase verified the same person controls this account.", "O Keybase verificou que a mesma pessoa controla esta conta."))));
        }),
      ]);
      out.push(F(C.warn, tr("Un mismo alias en dos sitios es una hipótesis, no una identidad", "The same handle on two sites is a hypothesis, not an identity", "O mesmo apelido em dois sites é uma hipótese, não uma identidade"), "OSINTario", "", "baja",
        tr("Compara foto, fecha de creación, idioma y contactos antes de vincular cuentas.", "Compare photo, creation date, language and contacts before linking accounts.", "Compare foto, data de criação, idioma e contatos antes de vincular contas.")));
      extra.links = PLATFORMS.map(([n, t]) => [n, t.replace("{u}", enc(u))]);
      extra.links.unshift([tr("Barrido de 7.700+ sitios: Consensus OSINT (terminal)", "Sweep 7,700+ sites: Consensus OSINT (CLI)", "Varredura de 7.700+ sites: Consensus OSINT (terminal)"), "https://github.com/OSINT-Experts-Society/Consensus-OSINT"]);
      extra.links.push([tr("Alias y emails probables a partir del nombre: NAMINT", "Likely usernames and emails from a name: NAMINT", "Aliases e emails prováveis a partir do nome: NAMINT"), "https://seintpl.github.io/NAMINT/"]);
      extra.links.push([tr("Foros de la dark web: DarkSherlock (terminal)", "Dark web forums: DarkSherlock (CLI)", "Fóruns da dark web: DarkSherlock (terminal)"), "https://github.com/banaxou/dark-sherlock"]);
    },
  },
  email: {
    title: "Email", ph: "nombre@dominio.com", examples: [],
    desc: tr("Perfil público de Gravatar, si tiene cuenta Proton, configuración del dominio (MX), brechas conocidas del servicio y enlaces para seguir. No envía nada al buzón investigado.",
      "Public Gravatar profile, whether it has a Proton account, domain setup (MX), known breaches of the service and links to continue. Nothing is sent to the mailbox.",
      "Perfil público do Gravatar, se tem conta Proton, configuração do domínio (MX), vazamentos conhecidos do serviço e links para continuar. Nada é enviado à caixa investigada."),
    parse(v) { const e = v.trim().toLowerCase(); if (!RE.email.test(e)) throw new Error(tr("Escribe un email válido, por ejemplo nombre@dominio.com.", "Enter a valid email, e.g. name@domain.com.", "Digite um email válido, por exemplo nome@dominio.com.")); return e; },
    async run(e, out, mark, extra) {
      const domain = e.split("@")[1];
      const free = /^(gmail|googlemail|hotmail|outlook|live|yahoo|icloud|me|proton|protonmail|pm|gmx|aol|yandex|mail)\./.test(domain);
      await Promise.all([
        step(mark, "Gravatar", async () => {
          const h = await sha256Hex(e);
          const j = await getJSON(`https://gravatar.com/${h}.json`).catch(() => ({ __notFound: true }));
          const p = j.entry && j.entry[0];
          if (!p) { out.push(F(C.profile, tr("Sin perfil de Gravatar", "No Gravatar profile", "Sem perfil no Gravatar"), "Gravatar", "", "alta")); return; }
          out.push(F(C.profile, `Gravatar: ${p.displayName || p.preferredUsername}`, "Gravatar", p.profileUrl, "alta", [p.aboutMe, p.currentLocation].filter(Boolean).join(" · ")));
          (p.accounts || []).forEach((a) => out.push(F(C.linked, `${a.shortname || a.name}: ${a.display || a.username || ""}`, "Gravatar", safeUrl(a.url) || "", "alta")));
          (p.urls || []).forEach((u) => out.push(F(C.linked, u.title || u.value, "Gravatar", safeUrl(u.value) || "", "media")));
        }),
        step(mark, "Proton", async () => {
          const t = await getJSON(`https://api.protonmail.ch/pks/lookup?op=index&search=${enc(e)}`, { text: true });
          const has = typeof t === "string" && t.toLowerCase().includes(`<${e}>`);
          out.push(F(C.profile, has ? tr("Tiene clave pública de Proton (cuenta Proton probable)", "Has a Proton public key (likely Proton account)", "Tem chave pública Proton (conta Proton provável)") : tr("Sin clave pública en Proton", "No Proton public key", "Sem chave pública no Proton"),
            "Proton keyserver", "", has ? "alta" : "media", has ? tr("Proton publica claves de sus usuarios: confirma que es la cuenta que buscas.", "Proton publishes its users' keys: confirm it's the account you're after.", "O Proton publica chaves dos usuários: confirme que é a conta procurada.") : ""));
        }),
        step(mark, "Google DNS", async () => {
          const mx = await dnsQuery(domain, "MX");
          out.push(F(C.edomain, mx.length ? `${tr("Recibe correo", "Receives mail", "Recebe email")}: ${mx.slice(0, 3).join(", ")}` : tr("El dominio no tiene MX: el email probablemente no existe", "The domain has no MX: the email probably doesn't exist", "O domínio não tem MX: o email provavelmente não existe"), "Google DNS", "", "alta"));
          out.push(F(C.edomain, free ? tr(`Proveedor gratuito (${domain})`, `Free provider (${domain})`, `Provedor gratuito (${domain})`) : tr(`Dominio propio (${domain}): investígalo en la pestaña Dominio`, `Own domain (${domain}): investigate it in the Domain tab`, `Domínio próprio (${domain}): investigue na aba Domínio`), "OSINTario", "", free ? "alta" : "media"));
        }),
        step(mark, "Have I Been Pwned", async () => {
          if (free) { out.push(F(C.breaches, tr("Proveedor gratuito: revisa el email puntual en HIBP", "Free provider: check the specific email on HIBP", "Provedor gratuito: verifique o email específico no HIBP"), "Have I Been Pwned", "https://haveibeenpwned.com/", "media")); return; }
          const j = await getJSON(`https://haveibeenpwned.com/api/v3/breaches?domain=${enc(domain)}`);
          if (!Array.isArray(j) || !j.length) { out.push(F(C.breaches, tr("El servicio de este dominio no figura como fuente de brechas", "This domain's service is not listed as a breach source", "O serviço deste domínio não consta como fonte de vazamentos"), "Have I Been Pwned", "", "alta")); return; }
          j.forEach((b) => out.push(F(C.breaches, `${b.Title} (${b.BreachDate})`, "Have I Been Pwned", `https://haveibeenpwned.com/PwnedWebsites#${b.Name}`, "alta", `${fmtN(b.PwnCount)} · ${(b.DataClasses || []).slice(0, 5).join(", ")}`)));
        }),
      ]);
      extra.links = [
        ["Have I Been Pwned", "https://haveibeenpwned.com/"],
        [tr("Epieos: cuentas asociadas (búsquedas gratis limitadas)", "Epieos: linked accounts (limited free searches)", "Epieos: contas associadas (pesquisas grátis limitadas)"), "https://epieos.com"],
        [tr("Hudson Rock: ¿infectado por infostealer?", "Hudson Rock: infostealer infection?", "Hudson Rock: infectado por infostealer?"), "https://www.hudsonrock.com/free-tools"],
        [tr("Epieos (cuentas Google y más)", "Epieos (Google accounts and more)", "Epieos (contas Google e mais)"), "https://epieos.com/"],
        [tr("Hunter: verificar email (registro)", "Hunter: verify email (login)", "Hunter: verificar email (cadastro)"), `https://hunter.io/email-verifier/${enc(e)}`],
        [tr("Búsqueda exacta en Google", "Exact search on Google", "Busca exata no Google"), `https://www.google.com/search?q=${enc('"' + e + '"')}`],
        [tr("Búsqueda exacta en Bing", "Exact search on Bing", "Busca exata no Bing"), `https://www.bing.com/search?q=${enc('"' + e + '"')}`],
        [tr("En GitHub (código)", "On GitHub (code)", "No GitHub (código)"), `https://github.com/search?q=${enc('"' + e + '"')}&type=code`],
        [tr("En Pastebin vía Google", "On Pastebin via Google", "No Pastebin via Google"), `https://www.google.com/search?q=${enc('site:pastebin.com "' + e + '"')}`],
        [tr("Intelligence X (registro)", "Intelligence X (login)", "Intelligence X (cadastro)"), `https://intelx.io/?s=${enc(e)}`],
      ];
    },
  },
  phone: {
    title: tr("Teléfono", "Phone", "Telefone"), ph: "+351 912 345 678", examples: [],
    desc: tr("Normaliza el número y prepara búsquedas en sus distintos formatos. Los directorios de teléfonos envejecen rápido: contrasta siempre con más de una fuente.",
      "Normalizes the number and prepares searches in its different formats. Phone directories age fast: always cross-check with more than one source.",
      "Normaliza o número e prepara buscas em seus diferentes formatos. Diretórios telefônicos envelhecem rápido: compare sempre com mais de uma fonte."),
    parse(v) { const d = v.replace(/[^\d+]/g, ""); if (!/^\+\d{8,15}$/.test(d)) throw new Error(tr("Escribe el número con código de país, por ejemplo +351912345678.", "Enter the number with country code, e.g. +351912345678.", "Digite o número com código do país, por exemplo +351912345678.")); return d; },
    async run(p, out, mark, extra) {
      const n = p.slice(1); const local = n.slice(-9);
      const formats = [p, n, local, `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`, `${local.slice(0, 3)}-${local.slice(3, 6)}-${local.slice(6)}`];
      out.push(F(C.formats, formats.join(" · "), "OSINTario", "", "alta", tr("Prueba cada formato: las páginas publican los números de formas distintas.", "Try each format: sites publish numbers in different ways.", "Teste cada formato: os sites publicam números de formas diferentes.")));
      out.push(F(C.warn, tr("Un número puede haber cambiado de titular", "A number may have changed owner", "Um número pode ter mudado de titular"), "OSINTario", "", "baja", tr("Las líneas se reasignan: verifica la fecha de cada fuente.", "Lines get reassigned: check each source's date.", "As linhas são reatribuídas: verifique a data de cada fonte.")));
      const q = formats.slice(0, 4).map((f) => `"${f}"`).join(" OR ");
      extra.links = [
        [tr("Google (todos los formatos)", "Google (all formats)", "Google (todos os formatos)"), `https://www.google.com/search?q=${enc(q)}`],
        [tr("Bing (todos los formatos)", "Bing (all formats)", "Bing (todos os formatos)"), `https://www.bing.com/search?q=${enc(q)}`],
        ["DuckDuckGo", `https://duckduckgo.com/?q=${enc('"' + p + '"')}`],
        [tr("En documentos PDF", "In PDF documents", "Em documentos PDF"), `https://www.google.com/search?q=${enc("(" + q + ") filetype:pdf")}`],
        [tr("Contexto de estafa", "Scam context", "Contexto de golpe"), `https://www.google.com/search?q=${enc('"' + p + '" estafa OR scam OR fraude OR golpe')}`],
        [tr("Truecaller (requiere cuenta)", "Truecaller (account required)", "Truecaller (requer conta)"), `https://www.truecaller.com/search/global/${enc(n)}`],
        ["Sync.me", `https://sync.me/search/?number=${enc(p)}`],
        ["Telegram", `https://t.me/${enc(p)}`],
      ];
    },
  },
  onion: {
    title: tr("Sitio .onion (dark web)", ".onion site (dark web)", "Site .onion (dark web)"), ph: "xxxxxxxx….onion", examples: ["duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion"],
    desc: tr("Comprueba sin usar Tor si un servicio .onion v3 existe en el índice de AIL y muestra sus títulos, idioma, etiquetas y fechas. Para visitarlo, usa Tor Browser dentro de una máquina virtual.",
      "Checks, without Tor, whether a v3 .onion service is in the AIL index and shows its titles, language, tags and dates. To visit it, use Tor Browser inside a virtual machine.",
      "Verifica, sem usar Tor, se um serviço .onion v3 está no índice do AIL e mostra títulos, idioma, etiquetas e datas. Para visitá-lo, use o Tor Browser dentro de uma máquina virtual."),
    parse(v) { const o = v.trim().toLowerCase().replace(/^https?:\/\//, "").split(/[/?#]/)[0]; if (!RE.onion.test(o)) throw new Error(tr("Escribe una dirección .onion v3 (56 caracteres + .onion).", "Enter a v3 .onion address (56 characters + .onion).", "Digite um endereço .onion v3 (56 caracteres + .onion).")); return o; },
    async run(o, out, mark, extra) {
      await step(mark, "AIL onion-lookup", async () => {
        const j = await getJSON(`https://onion.ail-project.org/api/lookup/${o}`);
        if (j.__notFound || !j.id) { out.push(F(C.onion, tr("No figura en el índice de AIL", "Not in the AIL index", "Não consta no índice do AIL"), "AIL onion-lookup", "", "media", tr("Puede existir igual: AIL solo conoce lo que rastreó.", "It may still exist: AIL only knows what it crawled.", "Pode existir mesmo assim: o AIL só conhece o que rastreou."))); return; }
        out.push(F(C.onion, `${tr("Visto", "Seen", "Visto")}: ${j.first_seen || "?"} → ${j.last_seen || "?"}`, "AIL onion-lookup", "https://onion.ail-project.org", "alta", (j.languages || []).length ? `${tr("Idiomas", "Languages", "Idiomas")}: ${j.languages.join(", ")}` : ""));
        (j.titles || []).slice(0, 12).forEach((t) => out.push(F(tr("Títulos de páginas", "Page titles", "Títulos de páginas"), t, "AIL onion-lookup", "", "alta")));
        (j.tags || []).slice(0, 10).forEach((t) => out.push(F(tr("Etiquetas automáticas", "Automatic tags", "Etiquetas automáticas"), t, "AIL onion-lookup", "", "media",
          tr("Detección automática de AIL: indica qué tipo de datos aparecieron, no un delito.", "AIL automatic detection: shows what kind of data appeared, not a crime.", "Detecção automática do AIL: indica que tipo de dado apareceu, não um crime."))));
      });
      extra.links = [
        [tr("Sitios vinculados (Ahmia)", "Linked sites (Ahmia)", "Sites vinculados (Ahmia)"), `https://ahmia.fi/search/?q=${enc(o)}`],
        [tr("Descargar el sitio como evidencia", "Download the site as evidence", "Baixar o site como evidência"), "https://darkweb-archive.activetk.jp/"],
        [tr("Buscar menciones en la web", "Search mentions on the web", "Buscar menções na web"), `https://www.google.com/search?q=${enc('"' + o.slice(0, 20) + '"')}`],
        ["Tor Browser", "https://www.torproject.org/download/"],
      ];
    },
  },
  image: {
    title: tr("Imagen y metadatos", "Image and metadata", "Imagem e metadados"), file: true,
    desc: tr("Lee los metadatos EXIF (cámara, fecha, software, GPS) y calcula el hash SHA-256 del archivo para tu cadena de custodia. La imagen no sale de tu equipo.",
      "Reads EXIF metadata (camera, date, software, GPS) and computes the file's SHA-256 hash for your chain of custody. The image never leaves your device.",
      "Lê os metadados EXIF (câmera, data, software, GPS) e calcula o hash SHA-256 do arquivo para sua cadeia de custódia. A imagem não sai do seu equipamento."),
  },
  dorks: {
    title: tr("Generador de dorks", "Dork generator", "Gerador de dorks"), ph: "empresa.com", examples: ["empresa.com"],
    desc: tr("Arma búsquedas avanzadas de Google para encontrar documentos, paneles expuestos, filtraciones y menciones. Úsalas solo sobre objetivos que tienes autorización para investigar.",
      "Builds advanced Google searches to find documents, exposed panels, leaks and mentions. Use them only on targets you're authorized to investigate.",
      "Monta buscas avançadas no Google para encontrar documentos, painéis expostos, vazamentos e menções. Use apenas em alvos que você tem autorização para investigar."),
    parse(v) { const d = cleanDomain(v); if (!RE.domain.test(d)) throw new Error(tr("Escribe un dominio, por ejemplo empresa.com.", "Enter a domain, e.g. company.com.", "Digite um domínio, por exemplo empresa.com.")); return d; },
    async run(d, out) {
      const name = d.split(".")[0];
      [[tr("Documentos públicos", "Public documents", "Documentos públicos"), `site:${d} (filetype:pdf OR filetype:docx OR filetype:xlsx OR filetype:pptx)`],
       [tr("Listados de directorios", "Directory listings", "Listagens de diretórios"), `site:${d} intitle:"index of"`],
       [tr("Paneles de acceso", "Login panels", "Painéis de acesso"), `site:${d} (inurl:login OR inurl:admin OR inurl:signin OR intitle:"dashboard")`],
       [tr("Archivos de configuración o logs", "Config files or logs", "Arquivos de configuração ou logs"), `site:${d} (ext:env OR ext:log OR ext:sql OR ext:bak OR ext:conf OR ext:ini)`],
       [tr("Errores que revelan tecnología", "Errors that reveal technology", "Erros que revelam tecnologia"), `site:${d} ("sql syntax" OR "stack trace" OR "Warning: mysql" OR "Fatal error")`],
       [tr("Subdominios indexados", "Indexed subdomains", "Subdomínios indexados"), `site:*.${d} -www`],
       [tr("Emails del dominio", "Domain emails", "Emails do domínio"), `"@${d}" -site:${d}`],
       [tr("Menciones en Pastebin y similares", "Mentions on Pastebin and similar", "Menções no Pastebin e similares"), `"${d}" (site:pastebin.com OR site:ghostbin.co OR site:justpaste.it)`],
       [tr("Código en GitHub o GitLab", "Code on GitHub or GitLab", "Código no GitHub ou GitLab"), `"${d}" (site:github.com OR site:gitlab.com)`],
       [tr("Tableros y documentos compartidos", "Shared boards and documents", "Quadros e documentos compartilhados"), `"${d}" (site:trello.com OR site:docs.google.com OR site:notion.site)`],
       [tr("Buckets en la nube", "Cloud buckets", "Buckets na nuvem"), `"${name}" (site:s3.amazonaws.com OR site:blob.core.windows.net OR site:storage.googleapis.com)`],
       [tr("Empleados en LinkedIn", "Employees on LinkedIn", "Funcionários no LinkedIn"), `site:linkedin.com/in "${name}"`],
       [tr("Presentaciones y charlas", "Slides and talks", "Apresentações e palestras"), `"${name}" (site:slideshare.net OR site:speakerdeck.com)`],
      ].forEach(([t, q]) => out.push(F(C.dorks, t, "Google", `https://www.google.com/search?q=${enc(q)}`, "media", q)));
    },
  },
};

async function step(mark, name, fn) {
  mark(name, "run");
  try { const r = await fn(); mark(name, "ok"); return r; }
  catch (e) { mark(name, "err", e.name === "AbortError" ? tr("tardó demasiado", "timed out", "demorou demais") : (e.message === "Failed to fetch" || !e.message ? tr("no respondió", "no response", "não respondeu") : e.message)); return null; }
}

/* ---------- Interfaz ---------- */
let current = "domain";
function selectTool(key) {
  current = key; const t = TOOLS[key];
  document.querySelectorAll(".tool-nav button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tool === key)));
  $("#t-title").textContent = t.title; $("#t-desc").textContent = t.desc;
  $("#t-input").hidden = !!t.file; $("#t-file").hidden = !t.file; $("#t-go").hidden = !!t.file;
  $("#t-input").placeholder = t.ph || ""; $("#t-input").setAttribute("aria-label", t.title); $("#t-file").setAttribute("aria-label", t.title);
  $("#t-msg").textContent = ""; $("#t-out").innerHTML = "";
  const ex = $("#t-examples"); ex.innerHTML = "";
  if (t.examples && t.examples.length) {
    ex.append(tr("Prueba con:", "Try:", "Teste com:"));
    t.examples.forEach((v) => { const b = el("button", { type: "button", text: v.length > 30 ? v.slice(0, 14) + "…onion" : v }); b.addEventListener("click", () => { $("#t-input").value = v; $("#t-form").requestSubmit(); }); ex.append(b); });
  }
  renderLockHint(key);
  if (location.hash !== "#" + key) history.replaceState(null, "", "#" + key);
}
document.querySelectorAll(".tool-nav button").forEach((b) => b.addEventListener("click", () => selectTool(b.dataset.tool)));

/* Atajos a herramientas del directorio que aceptan el dato en la URL (dirlinks.js, generado desde directory.js). */
function dirLaunchers(kind, q, existing) {
  if (typeof DIRLINKS === "undefined") return [];
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } };
  const seen = new Set(existing.map(([, u]) => host(u)));
  const lab = { l: tr("registro", "sign-up", "registo"), p: tr("pago", "paid", "pago") };
  const out = [];
  DIRLINKS.forEach(([n, acc, k]) => {
    if (!k[kind]) return;
    const u = k[kind].replace(/\{q\}/g, encodeURIComponent(q));
    if (seen.has(host(u))) return;
    seen.add(host(u));
    out.push([n + (acc ? " · " + [...acc].map((x) => lab[x]).join(", ") : ""), u]);
  });
  return out;
}

/* Herramientas que se destraban con la comunidad (DIRLOCKED, generado desde directory.js). */
function renderLockHint(key) {
  const old = document.getElementById("t-lock"); if (old) old.remove();
  if (typeof DIRLOCKED === "undefined") return;
  const items = DIRLOCKED.filter((x) => x[2] === key);
  if (!items.length) return;
  const by = {}; items.forEach(([n, g]) => { (by[g] = by[g] || []).push(n); });
  const p = el("p", { class: "lockhint", id: "t-lock" }, "🔒 " + tr("Se destraban aquí con la comunidad: ", "Unlocking here with the community: ", "Desbloqueiam aqui com a comunidade: "));
  Object.keys(by).sort((a, b) => a - b).forEach((g, i) => { if (i) p.append(" · "); p.append(by[g].join(", ") + " (" + Number(g).toLocaleString(document.documentElement.lang) + " ⭐)"); });
  p.append(" ", el("a", { href: "#comunidad", text: tr("Ver metas", "See goals", "Ver metas") }));
  $("#t-examples").after(p);
}
(function renderUnlock() {
  if (typeof DIRLOCKED === "undefined") return;
  document.querySelectorAll(".goalcard").forEach((c) => {
    const g = Number(c.dataset.goal); const ul = c.querySelector(".lk");
    DIRLOCKED.filter((x) => x[1] === g).forEach(([n, , tab, d]) => ul.append(el("li", {}, el("b", { text: n }), " — " + d[LI])));
  });
  fetch("https://api.github.com/repos/osintario/osintario.github.io").then((r) => r.json()).then((j) => {
    const s = j.stargazers_count; if (typeof s !== "number") return;
    document.querySelectorAll(".goalcard").forEach((c) => { const g = Number(c.dataset.goal); c.querySelector(".st").textContent = s; c.querySelector(".bar i").style.width = Math.min(100, (s / g) * 100) + "%"; });
  }).catch(() => {});
})();

$("#t-form").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const t = TOOLS[current]; $("#t-msg").textContent = "";
  let target;
  try { target = t.parse($("#t-input").value); } catch (e) { $("#t-msg").textContent = e.message; return; }
  $("#t-go").disabled = true;
  const out = []; const extra = {};
  const prog = el("div", { class: "progress" });
  const chips = {};
  const mark = (name, state, err) => {
    if (!chips[name]) { chips[name] = el("span", { class: "src", text: name }); prog.append(chips[name]); }
    chips[name].className = "src" + (state === "ok" ? " ok" : state === "err" ? " err" : "");
    chips[name].textContent = name + (state === "run" ? " …" : state === "err" ? ` · ${err}` : " ✓");
  };
  const box = $("#t-out"); box.innerHTML = ""; box.append(el("div", { class: "report" }, el("p", { class: "meta", text: tr(`Investigando ${target}…`, `Investigating ${target}…`, `Investigando ${target}…`) }), prog));
  try { await t.run(target, out, mark, extra); } finally { $("#t-go").disabled = false; }
  const errors = Object.values(chips).filter((c) => c.classList.contains("err")).map((c) => c.textContent);
  extra.links = (extra.links || []).concat(dirLaunchers(current, target, extra.links || []));
  await renderReport({ tool: current, title: t.title, target, findings: out, links: extra.links || [], errors }, prog);
});

async function renderReport(r, prog) {
  const report = { generator: "Multi-OSINT Lite · OSINTario", version: 2, tool: r.tool, target: r.target, generated_at_utc: new Date().toISOString(),
    findings: r.findings, manual_links: r.links.map(([n, u]) => ({ name: n, url: u })), unavailable_sources: r.errors,
    disclaimer: tr("Hallazgos de fuentes abiertas. Cada resultado es una pista: valídalo con una segunda fuente antes de concluir.", "Open-source findings. Each result is a lead: validate it with a second source before concluding.", "Achados de fontes abertas. Cada resultado é uma pista: valide com uma segunda fonte antes de concluir.") };
  const json = JSON.stringify(report, null, 2);
  const hash = await sha256Hex(json);
  const wrap = el("article", { class: "report" });
  const actions = el("div", { class: "actions" });
  const dl = (name, text, type) => { const a = el("a", { href: URL.createObjectURL(new Blob([text], { type })), download: name }); document.body.append(a); a.click(); a.remove(); };
  const md = toMarkdown(report, hash);
  [[tr("Descargar JSON", "Download JSON", "Baixar JSON"), () => dl(`osintario-${r.tool}-${r.target}.json`, json, "application/json")],
   [tr("Descargar Markdown", "Download Markdown", "Baixar Markdown"), () => dl(`osintario-${r.tool}-${r.target}.md`, md, "text/markdown")],
   [tr("Copiar resumen", "Copy summary", "Copiar resumo"), async (b) => { try { await navigator.clipboard.writeText(md); b.textContent = tr("Copiado", "Copied", "Copiado"); } catch { b.textContent = tr("No se pudo copiar", "Couldn't copy", "Não foi possível copiar"); } }],
   [tr("Imprimir / PDF", "Print / PDF", "Imprimir / PDF"), () => window.print()]].forEach(([t, fn]) => { const b = el("button", { type: "button", text: t }); b.addEventListener("click", () => fn(b)); actions.append(b); });
  wrap.append(el("div", { class: "report-head" },
    el("div", {}, el("h3", { text: `${r.title}: ${r.target}` }), el("div", { class: "meta", text: `${report.generated_at_utc} · ${r.findings.length} ${tr("hallazgos", "findings", "achados")} · SHA-256 ${hash}` })), actions), prog);
  const groups = {};
  r.findings.forEach((f) => (groups[f.category] ||= []).push(f));
  for (const [cat, items] of Object.entries(groups)) {
    wrap.append(el("h4", { class: "cat", text: `${cat} (${items.length})` }));
    items.forEach((f) => {
      const u = safeUrl(f.url);
      wrap.append(el("div", { class: "item" },
        el("div", {}, u ? el("a", { href: u, target: "_blank", rel: "noopener noreferrer", text: f.title }) : el("span", { text: f.title }), el("div", { class: "s", text: f.source })),
        el("span", { class: `pill c-${f.confidence}`, text: CONF[f.confidence] }),
        f.note ? el("div", { class: "note", text: f.note }) : null));
    });
  }
  if (r.links.length) {
    wrap.append(el("h4", { class: "cat", text: `${tr("Revisión manual", "Manual review", "Revisão manual")} (${r.links.length})` }));
    const grid = el("div", { class: "links" });
    r.links.forEach(([n, u]) => { const s = safeUrl(u); if (s) grid.append(el("a", { href: s, target: "_blank", rel: "noopener noreferrer" }, n, el("span", { text: new URL(s).hostname }))); });
    wrap.append(grid);
  }
  wrap.append(el("p", { class: "disclaimer", text: report.disclaimer }));
  $("#t-out").innerHTML = ""; $("#t-out").append(wrap);
}

function toMarkdown(rep, hash) {
  const lines = [`# ${tr("Informe OSINT", "OSINT report", "Relatório OSINT")}: ${rep.target}`, "", `- ${tr("Herramienta", "Tool", "Ferramenta")}: ${rep.generator} (${rep.tool})`,
    `- ${tr("Fecha (UTC)", "Date (UTC)", "Data (UTC)")}: ${rep.generated_at_utc}`, `- SHA-256 (JSON): ${hash}`, ""];
  const g = {}; rep.findings.forEach((f) => (g[f.category] ||= []).push(f));
  for (const [c, items] of Object.entries(g)) {
    lines.push(`## ${c}`, "");
    items.forEach((f) => lines.push(`- ${f.url ? `[${f.title}](${f.url})` : f.title} — ${f.source}, ${CONF[f.confidence]}${f.note ? `. ${f.note}` : ""}`));
    lines.push("");
  }
  if (rep.manual_links.length) { lines.push(`## ${tr("Revisión manual", "Manual review", "Revisão manual")}`, ""); rep.manual_links.forEach((l) => lines.push(`- [${l.name}](${l.url})`)); lines.push(""); }
  if (rep.unavailable_sources.length) lines.push(`## ${tr("Fuentes no disponibles", "Unavailable sources", "Fontes indisponíveis")}`, "", ...rep.unavailable_sources.map((e) => `- ${e}`), "");
  lines.push(`> ${rep.disclaimer}`);
  return lines.join("\n");
}

/* Imagen: análisis local */
$("#t-file").addEventListener("change", async (e) => {
  const file = e.target.files[0]; const box = $("#t-out"); box.innerHTML = ""; if (!file) return;
  const buf = await file.arrayBuffer(); const hash = await sha256Hex(buf);
  const table = el("table", { class: "kv" }); const row = (k, v) => table.append(el("tr", {}, el("td", { text: k }), el("td", { text: String(v) })));
  row(tr("Archivo", "File", "Arquivo"), file.name); row(tr("Tipo", "Type", "Tipo"), file.type || "?"); row(tr("Tamaño", "Size", "Tamanho"), `${(file.size / 1024).toFixed(1)} KB`);
  row(tr("Última modificación (según tu equipo)", "Last modified (per your device)", "Última modificação (segundo seu equipamento)"), new Date(file.lastModified).toISOString()); row("SHA-256", hash);
  let meta = null; try { meta = await exifr.parse(buf, { tiff: true, exif: true, gps: true, xmp: true, iptc: true, icc: false }); } catch { meta = null; }
  const links = el("div", { class: "links" });
  if (meta && Object.keys(meta).length) {
    ["Make", "Model", "LensModel", "Software", "DateTimeOriginal", "CreateDate", "ModifyDate", "OffsetTimeOriginal", "Artist", "Copyright", "ImageDescription", "Creator", "City", "Country", "latitude", "longitude", "GPSAltitude"]
      .forEach((k) => { if (meta[k] != null) row(k, meta[k] instanceof Date ? meta[k].toISOString() : meta[k]); });
    if (meta.latitude != null && meta.longitude != null) {
      const la = meta.latitude.toFixed(6), lo = meta.longitude.toFixed(6);
      links.append(el("a", { href: `https://www.openstreetmap.org/?mlat=${la}&mlon=${lo}#map=17/${la}/${lo}`, target: "_blank", rel: "noopener noreferrer" }, tr("Ubicación GPS en OpenStreetMap", "GPS location on OpenStreetMap", "Localização GPS no OpenStreetMap"), el("span", { text: `${la}, ${lo}` })));
      links.append(el("a", { href: `https://www.google.com/maps?q=${la},${lo}`, target: "_blank", rel: "noopener noreferrer" }, "Google Maps", el("span", { text: "maps" })));
    }
    if (meta.Software && /photoshop|gimp|lightroom|snapseed|canva|picsart/i.test(meta.Software)) row(tr("Señal", "Signal", "Sinal"), tr("La imagen pasó por un editor: pudo ser modificada.", "The image went through an editor: it may have been modified.", "A imagem passou por um editor: pode ter sido modificada."));
  } else row(tr("Metadatos", "Metadata", "Metadados"), tr("No tiene EXIF. Las redes sociales y las apps de mensajería los borran al subir la imagen.", "No EXIF. Social networks and messaging apps strip it on upload.", "Sem EXIF. Redes sociais e apps de mensagens apagam ao enviar a imagem."));
  [["Google Lens", "https://lens.google.com/"], ["TinEye", "https://tineye.com/"], ["Yandex", "https://yandex.com/images/"], ["Bing Visual Search", "https://www.bing.com/visualsearch"], [tr("FotoForensics (análisis ELA)", "FotoForensics (ELA analysis)", "FotoForensics (análise ELA)"), "https://fotoforensics.com/"]]
    .forEach(([n, u]) => links.append(el("a", { href: u, target: "_blank", rel: "noopener noreferrer" }, n, el("span", { text: tr("subir la imagen allí", "upload the image there", "enviar a imagem lá") }))));
  box.append(el("div", { class: "report" }, el("div", { class: "report-head" }, el("h3", { text: `${tr("Imagen", "Image", "Imagem")}: ${file.name}` })), table,
    el("h4", { class: "cat", text: tr("Búsqueda inversa y forense", "Reverse search and forensics", "Busca reversa e forense") }), links,
    el("p", { class: "disclaimer", text: tr("La búsqueda inversa muestra dónde apareció una imagen, no dónde se tomó. Guarda el SHA-256 junto al archivo original como evidencia.", "Reverse search shows where an image appeared, not where it was taken. Keep the SHA-256 with the original file as evidence.", "A busca reversa mostra onde uma imagem apareceu, não onde foi tirada. Guarde o SHA-256 junto ao arquivo original como evidência.") })));
});

selectTool(TOOLS[location.hash.slice(1)] ? location.hash.slice(1) : "domain");
