import { NextResponse } from "next/server";

type Triple = { who: string; want: string; twist: string };

const SYSTEM = `You deal startup-idea triples for a portfolio slot machine. Every idea must feel REAL: a specific human, a recurring weekly pain, and a concrete mechanism — something 1-2 builders could ship in weeks, useful enough that someone would pay $5/month for it.

Per idea — WHO (a specific audience with context, 2-5 words), WANT (a concrete product with a mechanism, not a vague category, 3-7 words), TWIST (a hard constraint that shapes the product, 2-5 words).

GOOD (specific, useful):
{"who":"night-shift nurses","want":"a shift-swap board","twist":"over SMS"}
{"who":"landlords with 3 flats","want":"a receipt vault","twist":"that auto-reminds yearly"}
{"who":"thesis writers","want":"a citation catcher","twist":"from phone photos"}

BAD (vague, banned): "quiz generator", "productivity tool", a "tracker" with no mechanism, anything crypto, generic chatbots, anything needing hardware, social networks, marketplaces.

NEVER repeat already-built ideas: invitation/RSVP tools, bubble-popping games, prompt queues, movie databases, jewellery try-ons, quit-smoking apps, WhatsApp multi-chat tools, countdown timers, text converters.

All lowercase, no trailing periods, all three ideas different from each other.
Reply with ONLY JSON: {"ideas":[{"who":"...","want":"...","twist":"..."},{"who":"...","want":"...","twist":"..."},{"who":"...","want":"...","twist":"..."}]}`;

function clean(s: unknown) {
  return typeof s === "string" ? s.trim().toLowerCase().slice(0, 60) : "";
}

export async function POST() {
  const key = process.env.GROQ_API_KEY;
  if (!key) return NextResponse.json({ error: "missing key" }, { status: 500 });
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        temperature: 0.8,
        response_format: { type: "json_object" },
        max_tokens: 400,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: "Deal 3 idea triples." },
        ],
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return NextResponse.json({ error: "groq error" }, { status: 502 });
    const json = await res.json();
    const raw = JSON.parse(json.choices?.[0]?.message?.content ?? "{}") as { ideas?: Triple[] };
    const ideas = (raw.ideas ?? [])
      .map((t) => ({ who: clean(t.who), want: clean(t.want), twist: clean(t.twist) }))
      .filter((t) => t.who && t.want && t.twist)
      .slice(0, 3);
    if (!ideas.length) return NextResponse.json({ error: "bad shape" }, { status: 502 });
    return NextResponse.json({ ideas });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
