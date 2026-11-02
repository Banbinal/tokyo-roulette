// Chi-square tests of the draw used in index.html (line uniform, then stop uniform within the line).
// Usage: node test/distribution.mjs [runs=100] [draws=100000]
import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
if (!globalThis.crypto) Object.defineProperty(globalThis, "crypto", { value: webcrypto });

const js = readFileSync(new URL("../index.html", import.meta.url), "utf8").split("<script>")[1];
const LINES = new Function(js.slice(js.indexOf("const LINES"), js.indexOf("const K=")) + "return LINES;")();
const randInt = new Function(js.slice(js.indexOf("const buf"), js.indexOf("const pick")) + "return randInt;")();
const K = LINES.length;

function lgamma(x) {
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
    12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  x -= 1; let a = c[0]; const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}
function pValue(chi2, df) { // upper tail of chi-square = Q(df/2, chi2/2)
  const a = df / 2, x = chi2 / 2;
  if (x < a + 1) {
    let s = 1 / a, d = s, ap = a;
    for (let n = 0; n < 5000; n++) { ap++; d *= x / ap; s += d; if (Math.abs(d) < Math.abs(s) * 1e-14) break; }
    return 1 - s * Math.exp(-x + a * Math.log(x) - lgamma(a));
  }
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 5000; i++) { const an = -i * (i - a); b += 2; d = 1 / (an * d + b); c = b + an / c; const e = d * c; h *= e; if (Math.abs(e - 1) < 1e-14) break; }
  return Math.exp(-x + a * Math.log(x) - lgamma(a)) * h;
}

const runs = +process.argv[2] || 100, N = +process.argv[3] || 100000;
const p = { lines: [], stops: [] };
for (let r = 0; r < runs; r++) {
  const L = new Array(K).fill(0), S = LINES.map(l => new Array(l.stops.length).fill(0));
  for (let i = 0; i < N; i++) { const li = randInt(K), si = randInt(LINES[li].stops.length); L[li]++; S[li][si]++; }
  let x = 0; for (const v of L) x += (v - N / K) ** 2 / (N / K);
  let y = 0, df = -1;
  LINES.forEach((l, li) => S[li].forEach(v => { const e = N / K / l.stops.length; y += (v - e) ** 2 / e; df++; }));
  p.lines.push(pValue(x, K - 1)); p.stops.push(pValue(y, df));
}
const stops = LINES.reduce((a, l) => a + l.stops.length, 0);
console.log(`${K} lines, ${stops} stops — ${runs} runs × ${N} draws`);
for (const [k, ps] of Object.entries(p)) {
  const rej = ps.filter(v => v < 0.05).length / runs, mean = ps.reduce((a, b) => a + b, 0) / runs;
  console.log(`${k.padEnd(5)}  mean p = ${mean.toFixed(3)} (expected ≈ 0.5)   p < 0.05 in ${(rej * 100).toFixed(0)} % of runs (expected ≈ 5 %)`);
}
