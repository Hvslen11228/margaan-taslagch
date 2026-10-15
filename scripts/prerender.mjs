// index.html доторх GAMES/CASES өгөгдлөөс Google-д уншигдах статик HTML ба FAQ JSON-LD үүсгэнэ.
// Ажиллуулах: node scripts/prerender.mjs
import fs from "node:fs";
const file = new URL("../index.html", import.meta.url);
let html = fs.readFileSync(file, "utf8");
const pick = (name) => {
  const m = html.match(new RegExp(`const ${name}=(\\[[\\s\\S]*?\\n\\]);`));
  if (!m) throw new Error(name + " not found");
  return Function(`return ${m[1]}`)();
};
const GAMES = pick("GAMES"), CASES = pick("CASES");
const TAG = { std: ["t-std", "Олон улсын дүрэм"], trad: ["t-trad", "Уламжлалт дүрэм"], agree: ["t-agree", "Тохирох хувилбар"], rec: ["t-rec", "Санал болгох журам"] };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
let out = "";
for (const g of GAMES) {
  const rows = CASES.filter((c) => c[0] === g.id);
  out += `<section class="game"><div class="ghead"><h2>${esc(g.name)}</h2><span class="src">${esc(g.src)}</span></div>`;
  if (g.agree) out += `<div class="agree-box"><h3>Тоглохын өмнө тохирох зүйлс</h3><ul>${g.agree.map((a) => `<li>${esc(a)}</li>`).join("")}</ul></div>`;
  for (const c of rows) {
    const t = TAG[c[4]];
    out += `<article class="slip"><h3 class="q">${esc(c[1])}</h3><div class="verdict"><span class="vbadge">Шийдвэр</span><p>${esc(c[2])}</p></div>${c[3] ? `<p class="why">${esc(c[3])}</p>` : ""}<div class="meta"><span class="tag ${t[0]}">${t[1]}</span><span class="ref">${esc(c[5])}</span></div></article>`;
  }
  out += "</section>";
}
const gameName = Object.fromEntries(GAMES.map((g) => [g.id, g.name]));
const faq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CASES.map((c) => ({
    "@type": "Question",
    name: `${gameName[c[0]]}: ${c[1]}`,
    acceptedAnswer: { "@type": "Answer", text: c[2] + (c[3] ? " " + c[3] : "") + ` (${c[5]})` },
  })),
};
const site = {
  "@context": "https://schema.org", "@type": "WebSite", name: "Маргаан таслагч",
  url: "https://margaan-taslagch.vercel.app/", inLanguage: "mn",
};
const ld = `<!--LD-->\n<script type="application/ld+json">${JSON.stringify(site)}</script>\n<script type="application/ld+json">${JSON.stringify(faq)}</script>\n<!--/LD-->`;
html = html.replace(/<main id="list">[\s\S]*?<\/main>/, `<main id="list">${out}</main>`);
html = /<!--LD-->[\s\S]*?<!--\/LD-->/.test(html) ? html.replace(/<!--LD-->[\s\S]*?<!--\/LD-->/, ld) : html.replace("</head>", ld + "\n</head>");
fs.writeFileSync(file, html);
console.log(`prerendered ${CASES.length} cases`);
