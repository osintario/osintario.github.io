/* OSINTario · Laboratorio en el navegador (ES/EN/PT).
   ExifTool 13.42 compilado a WebAssembly (@uswriting/exiftool + zeroperl, Apache 2.0).
   Todo corre en el navegador: los archivos no salen del equipo. */
import { parseMetadata } from "./lab-exiftool.js";

const L = { es: 0, en: 1, pt: 2 }[document.documentElement.lang.slice(0, 2)] ?? 0;
const tr = (es, en, pt) => [es, en, pt][L];
const $ = (s) => document.querySelector(s);
const WASM = "zeroperl.wasm.gz";
const WASM_SHA = "a6ae97f184fabc444b0b70d77c3d16475bfb3de16ebfb58ab8b2fbf98a53835e";
let wasmBuf = null, current = null;

const out = (txt, cls) => { const o = $("#lab-out"); const d = document.createElement("div"); if (cls) d.className = cls; d.textContent = txt; o.append(d); o.scrollTop = o.scrollHeight; };
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function loadEngine() {
  if (wasmBuf) return;
  const st = $("#lab-status");
  st.textContent = tr("Descargando ExifTool (7,5 MB, una sola vez)…", "Downloading ExifTool (7.5 MB, only once)…", "A descarregar o ExifTool (7,5 MB, uma só vez)…");
  const r = await fetch(WASM);
  if (!r.ok) throw new Error("HTTP " + r.status);
  let buf = await r.arrayBuffer();
  const head = new Uint8Array(buf, 0, 2);
  if (head[0] === 0x1f && head[1] === 0x8b) buf = await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
  st.textContent = tr("Verificando la huella SHA-256 del motor…", "Checking the engine's SHA-256 fingerprint…", "A verificar a impressão SHA-256 do motor…");
  const h = hex(await crypto.subtle.digest("SHA-256", buf));
  if (h !== WASM_SHA) throw new Error(tr("La huella del motor no coincide: no se ejecuta.", "The engine fingerprint does not match: not running it.", "A impressão do motor não coincide: não é executado."));
  wasmBuf = buf;
  st.textContent = tr("Motor listo y verificado (ExifTool 13.42).", "Engine ready and verified (ExifTool 13.42).", "Motor pronto e verificado (ExifTool 13.42).");
}
const wasmFetch = async () => new Response(wasmBuf.slice(0), { headers: { "Content-Type": "application/wasm" } });

async function setFile(file) {
  current = file;
  const h = hex(await crypto.subtle.digest("SHA-256", await file.arrayBuffer()));
  $("#lab-file").textContent = file.name + " · " + file.size.toLocaleString() + " B";
  out("$ sha256sum " + file.name, "cmd");
  out(h + "  " + file.name);
}

function parseArgs(s) {
  const a = []; let cur = "", q = null;
  for (const ch of s.trim()) {
    if (q) { if (ch === q) q = null; else cur += ch; }
    else if (ch === '"' || ch === "'") q = ch;
    else if (/\s/.test(ch)) { if (cur) { a.push(cur); cur = ""; } }
    else cur += ch;
  }
  if (cur) a.push(cur);
  return a.filter((x) => x !== "exiftool");
}

async function run(argStr) {
  if (!current) { out(tr("Primero elige un archivo o una muestra.", "First choose a file or a sample.", "Primeiro escolha um arquivo ou uma amostra."), "err"); return; }
  const btns = document.querySelectorAll(".lab button"); btns.forEach((b) => (b.disabled = true));
  try {
    await loadEngine();
    const args = parseArgs(argStr);
    out("$ exiftool " + args.join(" ") + " " + current.name, "cmd");
    const t0 = performance.now();
    const res = await parseMetadata(current, { args, fetch: wasmFetch });
    const ms = Math.round(performance.now() - t0);
    if (res.success) out(String(res.data).trim() || tr("(sin resultados: el archivo no tiene esos metadatos)", "(no results: the file has no such metadata)", "(sem resultados: o arquivo não tem esses metadados)"));
    else if (/No output data/i.test(String(res.error))) out(tr("(sin resultados: el archivo no tiene esos metadatos)", "(no results: the file has no such metadata)", "(sem resultados: o arquivo não tem esses metadados)"), "warn");
    else out(String(res.error || "error").trim(), "err");
    if (res.warnings && String(res.warnings).trim()) out(String(res.warnings).trim(), "warn");
    out(tr("Tiempo: ", "Time: ", "Tempo: ") + ms + " ms", "note");
    const m = String(res.data || "").match(/GPS Latitude\s*:\s*(-?\d+\.\d+)[\s\S]*GPS Longitude\s*:\s*(-?\d+\.\d+)/);
    if (m) { const a = document.createElement("a"); a.href = "https://www.openstreetmap.org/?mlat=" + m[1] + "&mlon=" + m[2] + "#map=17/" + m[1] + "/" + m[2]; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = "↗ " + tr("Ver estas coordenadas en OpenStreetMap", "See these coordinates on OpenStreetMap", "Ver estas coordenadas no OpenStreetMap"); const d = document.createElement("div"); d.append(a); $("#lab-out").append(d); }
  } catch (e) {
    out(String(e.message || e), "err");
    $("#lab-status").textContent = tr("No se pudo cargar el motor.", "The engine could not be loaded.", "Não foi possível carregar o motor.");
  } finally { btns.forEach((b) => (b.disabled = false)); }
}

document.querySelectorAll("[data-sample]").forEach((b) => b.addEventListener("click", async () => {
  const r = await fetch(b.dataset.sample); const blob = await r.blob();
  await setFile(new File([blob], b.dataset.sample, { type: blob.type }));
  if (b.dataset.args) { $("#lab-args").value = b.dataset.args; run(b.dataset.args); }
}));
$("#lab-input").addEventListener("change", (e) => { if (e.target.files[0]) setFile(e.target.files[0]); });
document.querySelectorAll("[data-args]:not([data-sample])").forEach((b) => b.addEventListener("click", () => { $("#lab-args").value = b.dataset.args; run(b.dataset.args); }));
$("#lab-form").addEventListener("submit", (e) => { e.preventDefault(); run($("#lab-args").value); });
$("#lab-clear").addEventListener("click", () => { $("#lab-out").textContent = ""; });
