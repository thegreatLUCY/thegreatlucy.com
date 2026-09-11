// Generates src/data/contributions.json — a deterministic, representative
// contribution graph for the portfolio heatmap.
//
// Why not the real per-day data? GitHub only reveals private contributions
// to the logged-in owner, and the public events API misses most history
// (it showed 8 commits vs the real 679). So: the yearly total (679) and the
// seasonal shape (quiet winter, dense May→Sep) match the real graph;
// individual daily squares are illustrative. Re-run any time to refresh:
//   node scripts/gen-contributions.mjs

import { writeFileSync } from "node:fs";

const TOTAL = 679;
const END = "2026-09-11";
const START = "2025-09-01";

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260911);

// Observed intensity per month on the real graph (0..1 day-activity rate)
const INTENSITY = {
  "2025-09": 0.01, "2025-10": 0.01, "2025-11": 0.01, "2025-12": 0.01,
  "2026-01": 0.01, "2026-02": 0.01, "2026-03": 0.05, "2026-04": 0.08,
  "2026-05": 0.6, "2026-06": 0.8, "2026-07": 0.85, "2026-08": 0.9,
  "2026-09": 0.7,
};

function dayCount(month) {
  const p = INTENSITY[month] ?? 0.01;
  if (rand() > p) return 0;
  if (p < 0.2) return 1 + Math.floor(rand() * 2);
  const r = rand();
  if (r < 0.6) return 1 + Math.floor(rand() * 4);
  if (r < 0.85) return 5 + Math.floor(rand() * 5);
  return 10 + Math.floor(rand() * 9);
}

const days = [];
{
  const d = new Date(START + "T12:00:00");
  const end = new Date(END + "T12:00:00");
  while (d <= end) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    days.push([key, dayCount(key.slice(0, 7))]);
    d.setDate(d.getDate() + 1);
  }
}

// Calibrate to the exact real total, preserving shape
let diff = TOTAL - days.reduce((s, [, c]) => s + c, 0);
const order = days.map((_, i) => i);
for (let i = order.length - 1; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1));
  [order[i], order[j]] = [order[j], order[i]];
}
let k = 0;
while (diff !== 0) {
  const [, c] = days[order[k % order.length]];
  if (diff > 0 && c > 0 && c < 24) {
    days[order[k % order.length]][1] = c + 1;
    diff--;
  } else if (diff < 0 && c > 1) {
    days[order[k % order.length]][1] = c - 1;
    diff++;
  }
  k++;
  if (k > 200000) break;
}

const sum = days.reduce((s, [, c]) => s + c, 0);
writeFileSync(
  new URL("../src/data/contributions.json", import.meta.url),
  JSON.stringify({ synced: END, total: TOTAL, days })
);
console.log(`wrote ${days.length} days, total ${sum} (target ${TOTAL})`);
