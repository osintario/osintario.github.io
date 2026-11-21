"use strict";
/* OSINTario · portada: directorio filtrable y meta de la comunidad (ES/EN/PT). */
(function () {
  const L = { es: 0, en: 1, pt: 2 }[document.documentElement.lang.slice(0, 2)] ?? 0;
  const tr = (es, en, pt) => [es, en, pt][L];
  const S = { ok: [tr("Activa", "Active", "Ativa"), "p-ok"], lim: [tr("Con límites", "Limited", "Com limites"), "p-lim"], risk: [tr("Con precaución", "Use with caution", "Com cautela"), "p-risk"], no: [tr("Descartada", "Discarded", "Descartada"), "p-no"] };
  const ACC = { l: tr("Requiere registro", "Login required", "Requer cadastro"), p: tr("De pago / funciones pagas", "Paid / paid features", "Pago / recursos pagos") };
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  const ALL = tr("Todas", "All", "Todas");
  let cat = ALL;
  const rows = TOOLS.map((t) => ({ c: t[0], cat: CATS[t[0]][L], n: t[1], d: t[2 + L], s: t[5], u: t[6], a: t[7] || "", i: t[8] || "" }));
  const GP = ["instalacion-segura.html", "safe-install.html", "instalacao-segura.html"][L];
  const INS = { py: "Python", go: "Go", docker: "Docker", vm: tr("solo en VM", "VM only", "só em VM"), app: tr("instalador oficial", "official installer", "instalador oficial") };
  const LA = typeof LAUNCH === "undefined" ? {} : LAUNCH;
  const TP = (document.querySelector("nav.main a.cta") || {}).getAttribute ? document.querySelector("nav.main a.cta").getAttribute("href") : "herramientas.html";
  const cats = Object.keys(CATS).filter((k) => rows.some((r) => r.c === k)).map((k) => CATS[k][L]);
  const set = (id, v) => { const e = $(id); if (e) e.textContent = v; };
  set("#count-total", rows.length); set("#count-ok", rows.filter((r) => r.s === "ok").length); set("#count-cat", cats.length);
  set("#count-date", REVIEWED);
  function chips() {
    const el = $("#chips"); el.innerHTML = "";
    [ALL, ...cats].forEach((c) => {
      const b = document.createElement("button"); b.className = "chip"; b.type = "button"; b.setAttribute("aria-pressed", String(c === cat));
      b.innerHTML = esc(c) + '<span class="n">' + (c === ALL ? rows.length : rows.filter((r) => r.cat === c).length) + "</span>";
      b.onclick = () => { cat = c; chips(); render(); }; el.appendChild(b);
    });
  }
  function render() {
    const q = $("#q").value.trim().toLowerCase(), st = $("#st").value, ac = $("#ac").value;
    const list = rows.filter((r) => (cat === ALL || r.cat === cat) && (st === "all" || r.s === st) &&
      (ac === "all" || (ac === "free" ? !r.a : r.a.includes(ac))) && (!q || (r.n + " " + r.d + " " + r.cat).toLowerCase().includes(q)));
    $("#grid").innerHTML = list.length ? list.map((r) => {
      const s = S[r.s];
      const badges = [...r.a].map((k) => '<span class="acc">' + ACC[k] + "</span>").join("");
      const link = r.s === "no" ? '<span class="note">' + tr("No enlazada", "Not linked", "Sem link") + "</span>" :
        '<a class="go" href="' + esc(r.u) + '" target="_blank" rel="noopener noreferrer">' + tr("Abrir", "Open", "Abrir") + "</a>";
      return '<article class="card s-' + r.s + '"><h3>' + esc(r.n) + '<span class="pill ' + s[1] + '">' + s[0] + "</span></h3><p>" + esc(r.d) + "</p>" +
        ((badges || (r.i && r.s !== "no") || (LA[r.n] && r.s !== "no")) ? '<div class="badges">' + badges + (r.i && r.s !== "no" ? '<a class="acc ins" href="' + GP + "#" + r.i + '" title="' + tr("Guía de instalación segura", "Safe installation guide", "Guia de instalação segura") + '">🧪 ' + INS[r.i] + "</a>" : "") + (LA[r.n] && r.s !== "no" ? '<a class="acc live" href="' + TP + "#" + Object.keys(LA[r.n])[0] + '">⚡ ' + tr("Se abre desde Multi-OSINT Lite", "Opens from Multi-OSINT Lite", "Abre a partir do Multi-OSINT Lite") + "</a>" : "") + "</div>" : "") + '<div class="meta"><span class="tag">' + esc(r.cat) + "</span>" + link + "</div></article>";
    }).join("") : '<div class="empty">' + tr("No hay herramientas con esos filtros. Prueba con otra categoría o borra la búsqueda.", "No tools match these filters. Try another category or clear the search.", "Nenhuma ferramenta com esses filtros. Tente outra categoria ou limpe a busca.") + "</div>";
  }
  $("#q").addEventListener("input", render); $("#st").addEventListener("change", render); $("#ac").addEventListener("change", render);
  chips(); render();
  (async () => {
    try {
      const j = await (await fetch("https://api.github.com/repos/osintario/osintario.github.io")).json();
      const s = j.stargazers_count || 0; set("#stars", s); $("#stars-bar").style.width = Math.min(100, s) + "%";
      const j2 = await (await fetch("https://api.github.com/search/issues?q=repo:osintario/osintario.github.io+type:issue")).json();
      const n = j2.total_count || 0; set("#issues", n); $("#issues-bar").style.width = Math.min(100, n * 10) + "%";
    } catch (e) { /* sin conexión a GitHub: se deja el guion */ }
  })();
})();
