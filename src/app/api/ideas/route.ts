import { NextResponse } from "next/server";

type Triple = { who: string; want: string; twist: string };

const SYSTEM = `Deal startup-idea triples as JSON: {"ideas":[{"who":"...","want":"...","twist":"..."}]} x6.
WHO: specific audience with context (2-5 words). WANT: concrete product with a mechanism (3-7 words). TWIST: hard constraint (2-5 words).
GOOD: {"who":"night-shift nurses","want":"a shift-swap board","twist":"over SMS"} {"who":"landlords with 3 flats","want":"a receipt vault","twist":"auto-reminds yearly"} {"who":"thesis writers","want":"a citation catcher","twist":"from phone photos"}
BANNED: vague trackers/generators, crypto, generic chatbots, hardware, social networks, marketplaces. NEVER: invites/RSVP, bubble games, prompt queues, movie DBs, jewellery try-ons, quit-smoking, WhatsApp tools, countdowns, text converters.
All lowercase, no periods, all six different. ONLY JSON.`;

const MODEL = "openai/gpt-oss-20b";

// Server-side pool: one Groq call deals 6, we serve 3 and stash 3 —
// halves API burn so the free quota survives real traffic.
let pool: Triple[] = [];

function clean(s: unknown) {
  return typeof s === "string" ? s.trim().toLowerCase().slice(0, 60) : "";
}

export async function POST() {
  if (pool.length >= 3) return NextResponse.json({ ideas: pool.splice(0, 3) });
  const key = process.env.GROQ_API_KEY;
  if (!key) return NextResponse.json({ error: "missing key" }, { status: 500 });
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.8,
        response_format: { type: "json_object" },
        max_tokens: 500,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: "Deal 6 idea triples." },
        ],
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) {
      // quota hiccup? serve the stash instead of failing the machine.
      if (pool.length) return NextResponse.json({ ideas: pool.splice(0, pool.length), stale: true });
      return NextResponse.json({ error: "groq error" }, { status: 502 });
    }
    const json = await res.json();
    const raw = JSON.parse(json.choices?.[0]?.message?.content ?? "{}") as { ideas?: Triple[] };
    const ideas = (raw.ideas ?? [])
      .map((t) => ({ who: clean(t.who), want: clean(t.want), twist: clean(t.twist) }))
      .filter((t) => t.who && t.want && t.twist)
      .slice(0, 6);
    if (!ideas.length) {
      if (pool.length) return NextResponse.json({ ideas: pool.splice(0, pool.length), stale: true });
      return NextResponse.json({ error: "bad shape" }, { status: 502 });
    }
    pool = ideas.slice(3);
    return NextResponse.json({ ideas: ideas.slice(0, 3) });
  } catch {
    if (pool.length) return NextResponse.json({ ideas: pool.splice(0, pool.length), stale: true });
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
