(async () => {
  try {
    const j = await (await fetch("https://api.github.com/repos/osintario/osintario.github.io")).json();
    if (typeof j.stargazers_count === "number") document.getElementById("stars").textContent = j.stargazers_count;
  } catch (e) { /* sin conexión a GitHub */ }
})();
