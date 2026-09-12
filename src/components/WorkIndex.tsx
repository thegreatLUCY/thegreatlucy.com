"use client";

import { AnimatePresence, animate, motion, useAnimation, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import contribData from "@/data/contributions.json";
import { IconTenawar, IconGame, IconChat, IconStack, IconLab } from "./Invitation";
import { confetti, toast } from "./Eggs";
import { useTheme } from "./Theme";

/* ---------- shared shell ---------- */

function Block({
  id,
  index,
  icon,
  name,
  tagline,
  href,
  cta,
  ask,
  askHref,
  children,
  i,
  wide,
}: {
  id: string;
  index: string;
  icon: React.ReactNode;
  name: string;
  tagline: string;
  href: string;
  cta: string;
  ask: string;
  askHref: string;
  children: React.ReactNode;
  i: number;
  wide?: boolean;
}) {
  return (
    <motion.article
      id={id}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (i % 2) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className={`app-card shine p-5 sm:p-6 flex flex-col scroll-mt-20 min-h-[380px] ${wide ? "md:col-span-2" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <motion.span
            className="shrink-0 block"
            whileHover={{ rotate: -7, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 350, damping: 14 }}
          >
            {icon}
          </motion.span>
          <div>
            <p className="font-mono2 text-[10px] tracking-[0.16em] uppercase t-dim">{index}</p>
            <h2 className="text-[19px] font-extrabold tracking-[-0.02em] leading-tight">{name}</h2>
            <p className="text-[12.5px] t-dim">{tagline}</p>
          </div>
        </div>
        <motion.a
          href={href}
          target="_blank"
          rel="noreferrer"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          className="get-btn"
        >
          {cta}
        </motion.a>
      </div>
      <div className="mt-4 flex-1 flex flex-col">{children}</div>
      <a
        href={askHref}
        className="mt-3 pt-3 border-t t-line text-[12.5px] font-bold text-[#0a66ff] hover:underline underline-offset-4"
      >
        {ask} →
      </a>
    </motion.article>
  );
}

/* ---------- 01 · a working slice of Tenawar ---------- */

type ThemeKey = "sahel" | "layl" | "bahja";

const EVENTS: Record<
  ThemeKey,
  {
    theme: string;
    kind: string;
    en: { over: string; names: string; date: string; msg: string; cta: string };
    ar: { over: string; names: string; date: string; msg: string; cta: string };
    target: string;
  }
> = {
  sahel: {
    theme: "Sahel",
    kind: "Wedding",
    en: { over: "Together with their families", names: "Nour & Omar", date: "12 December 2026", msg: "We would be honored by your presence on our day.", cta: "RSVP" },
    ar: { over: "مع عائلتيهما", names: "نور و عمر", date: "١٢ ديسمبر ٢٠٢٦", msg: "يسعدنا حضوركم في يومنا.", cta: "تأكيد الحضور" },
    target: "2026-12-12T18:00:00",
  },
  layl: {
    theme: "Layl",
    kind: "Wedding",
    en: { over: "Together with their families", names: "Nour & Omar", date: "12 December 2026", msg: "We would be honored by your presence on our day.", cta: "RSVP" },
    ar: { over: "مع عائلتيهما", names: "نور و عمر", date: "١٢ ديسمبر ٢٠٢٦", msg: "يسعدنا حضوركم في يومنا.", cta: "تأكيد الحضور" },
    target: "2026-12-12T18:00:00",
  },
  bahja: {
    theme: "Bahja",
    kind: "Birthday",
    en: { over: "Let's celebrate", names: "Omar's Birthday", date: "15 August 2027", msg: "Your presence makes the party — save your seat.", cta: "RSVP" },
    ar: { over: "هيا نحتفل", names: "عيد ميلاد عمر", date: "١٥ أغسطس ٢٠٢٧", msg: "حضوركم يصنع الحفل.", cta: "تأكيد الحضور" },
    target: "2027-08-15T18:00:00",
  },
};

function useCountdown(target: string) {
  const [t, setT] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now());
      return {
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      };
    };
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return t ?? { d: 0, h: 0, m: 0, s: 0 };
}

const THEME_STYLE: Record<ThemeKey, { bg: string; ink: string; accent: string; nameFont: string }> = {
  sahel: { bg: "#f7f2e6", ink: "#1f3d3a", accent: "#b98a2f", nameFont: "Didot, 'Bodoni MT', Georgia, serif" },
  layl: { bg: "#101a33", ink: "#f2ead8", accent: "#e8b93e", nameFont: "Didot, 'Bodoni MT', Georgia, serif" },
  bahja: { bg: "#fff6ea", ink: "#232323", accent: "#ff4b26", nameFont: "inherit" },
};

type Guest = { name: string; n: number; status: "attending" | "declined" };

const RSVP_SEED: Guest[] = [
  { name: "Nadine Samir", n: 2, status: "attending" },
  { name: "Mariam Khaled", n: 1, status: "attending" },
  { name: "Tarek Adel", n: 3, status: "declined" },
];

function RsvpBlock() {
  const [theme, setTheme] = useState<ThemeKey>("sahel");
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [name, setName] = useState("");
  const [party, setParty] = useState(2);
  const [status, setStatus] = useState<"attending" | "declined">("attending");
  const [guests, setGuests] = useState<Guest[]>(RSVP_SEED);

  const ev = EVENTS[theme];
  const t = ev[lang];
  const st = THEME_STYLE[theme];
  const cd = useCountdown(ev.target);
  const units: [number, string, string][] = [
    [cd.d, "Days", "يوم"],
    [cd.h, "Hours", "ساعة"],
    [cd.m, "Minutes", "دقيقة"],
    [cd.s, "Seconds", "ثانية"],
  ];

  const attending = 127 + guests.filter((g) => g.status === "attending").reduce((s, g) => s + g.n, 0) - 3;
  const declined = 9 + guests.filter((g) => g.status === "declined").reduce((s, g) => s + g.n, 0) - 3;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = name.trim() || "A mystery guest";
    setGuests((g) => [{ name: clean, n: party, status }, ...g].slice(0, 6));
    setName("");
    if (status === "attending") {
      confetti(45);
      toast(`${clean} +${party} — you're on the list.`);
    } else {
      toast(`${clean} — noted with regret. You’ll be missed.`);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(EVENTS) as ThemeKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setTheme(k)}
            aria-pressed={theme === k}
            className={`text-[12px] font-bold rounded-full px-4 py-1.5 transition-colors ${
              theme === k
                ? "bg-[#161616] dark:bg-white text-white dark:text-[#161616]"
                : "t-chip border t-line t-dim hover:t-ink"
            }`}
          >
            {EVENTS[k].theme} · {EVENTS[k].kind}
          </button>
        ))}
        <span className="ml-auto flex gap-1">
          {(["en", "ar"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`text-[11px] font-mono2 font-medium rounded-full px-3 py-1.5 transition-colors ${
                lang === l ? "bg-[#0a66ff] text-white" : "t-chip border t-line t-dim hover:t-ink"
              }`}
            >
              {l === "en" ? "EN" : "عربي"}
            </button>
          ))}
        </span>
      </div>

      {/* the invitation itself */}
      <div
        className="rounded-xl border t-line overflow-hidden text-center px-5 pt-6 pb-5 transition-colors duration-500"
        style={{ background: st.bg, color: st.ink }}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        {theme === "sahel" && (
          <div
            className="mx-auto mb-3 w-24 h-28 rounded-t-full overflow-hidden border-2"
            style={{ borderColor: st.accent, boxShadow: "0 8px 24px -12px rgba(0,0,0,0.4)" }}
          >
            <img
              src="/sahel-couple.png"
              alt="Couple at sunset by the sea"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {theme === "layl" && (
          <div className="flex justify-center gap-1.5 mb-3" aria-hidden>
            <span className="text-[15px]" style={{ color: st.accent }}>☾</span>
            {["·", "·", "·"].map((s, i) => (
              <span key={i} className="text-[10px] opacity-60">{s}✦</span>
            ))}
          </div>
        )}
        {theme === "bahja" && (
          <div className="flex justify-center gap-1.5 mb-3" aria-hidden>
            {["#ff4b26", "#0a66ff", "#e8b93e", "#25D366", "#B45FF0"].map((c) => (
              <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
        )}
        <p className="text-[11px] tracking-[0.18em] uppercase opacity-70">{t.over}</p>
        <p className="mt-1.5 text-[26px] leading-tight font-semibold" style={{ fontFamily: st.nameFont }}>
          {t.names}
        </p>
        <p className="text-[12.5px] opacity-75 mt-0.5">{t.date}</p>
        <div className="mt-3 flex justify-center gap-1.5" dir="ltr">
          {units.map(([v, en, ar]) => (
            <div key={en} className="min-w-[52px] rounded-lg px-1.5 py-1.5" style={{ background: "rgba(127,127,127,0.16)" }}>
              <p className="text-[17px] font-extrabold tabular-nums leading-none">{String(v).padStart(2, "0")}</p>
              <p className="text-[9px] uppercase tracking-wider opacity-70 mt-1">{lang === "ar" ? ar : en}</p>
            </div>
          ))}
        </div>
        <p className="text-[12.5px] mt-3 opacity-85 max-w-[300px] mx-auto leading-relaxed">{t.msg}</p>
      </div>

      {/* RSVP */}
      <form onSubmit={submit} className="flex flex-col gap-2">
        <div className="flex gap-1.5">
          {(["attending", "declined"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              aria-pressed={status === s}
              className={`flex-1 text-[12px] font-bold rounded-full py-1.5 capitalize transition-colors ${
                status === s
                  ? s === "attending"
                    ? "bg-green-600 text-white"
                    : "bg-[#161616] dark:bg-white text-white dark:text-[#161616]"
                  : "t-chip border t-line t-dim hover:t-ink"
              }`}
            >
              {s === "attending" ? "✓ Attending" : "✕ Declined"}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            aria-label="Your name"
            className="flex-1 min-w-0 bg-transparent border-b t-line focus:border-[#0a66ff] outline-none py-2 text-[14px] t-ink placeholder:text-[var(--dim)]"
          />
          <select
            value={party}
            onChange={(e) => setParty(Number(e.target.value))}
            aria-label="Party size"
            className="t-chip border t-line rounded-lg px-2 text-[13px] font-semibold t-ink outline-none"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>+{n}</option>
            ))}
          </select>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.93 }}
            className="text-white text-[13px] font-bold rounded-full px-5 hover:opacity-90 transition-opacity"
            style={{ background: st.accent }}
          >
            {t.cta}
          </motion.button>
        </div>
      </form>

      <div className="flex gap-4 font-mono2 text-[11px] t-dim">
        <span><strong className="t-ink text-[14px]">{attending}</strong> attending</span>
        <span><strong className="t-ink text-[14px]">{declined}</strong> declined</span>
      </div>
      <ul className="text-[12.5px] t-body space-y-1">
        <AnimatePresence initial={false}>
          {guests.slice(0, 3).map((g) => (
            <motion.li
              key={g.name + g.n + g.status}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-between border-b t-line border-dashed pb-1"
            >
              <span className="font-medium t-ink">{g.name}</span>
              <span className={g.status === "attending" ? "text-green-600 font-semibold" : "t-dim"}>
                {g.status === "attending" ? `+${g.n} attending` : `declined ×${g.n}`}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <p className="mt-auto font-mono2 text-[10.5px] t-dim">A working slice of tenawar.com — two events, three themes, two languages.</p>
    </div>
  );
}

/* ---------- 02 · the real playable ad (Bubble Trouble) ---------- */

function GameBlock() {
  const [world, setWorld] = useState<1 | 9>(1);
  return (
    <div className="flex-1 flex flex-col gap-3">
      <div className="flex gap-1.5">
        {([
          [1, "World 1 · Germs"],
          [9, "World 9 · Curlers"],
        ] as [1 | 9, string][]).map(([w, label]) => (
          <button
            key={w}
            onClick={() => setWorld(w)}
            aria-pressed={world === w}
            className={`flex-1 text-[12px] font-bold rounded-full py-2 transition-colors ${
              world === w
                ? "bg-[#161616] dark:bg-white text-white dark:text-[#161616]"
                : "t-chip border t-line t-dim hover:t-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mx-auto w-full max-w-[272px] rounded-xl overflow-hidden border t-line bg-[#0a1230] flex-1 min-h-[430px] flex flex-col">
        <iframe
          key={world}
          src={`/playable/bubble-trouble-world${world}.html`}
          title={`Bubble Trouble playable — world ${world}`}
          className="block w-full flex-1 min-h-[420px]"
          scrolling="no"
          loading="lazy"
        />
      </div>
      <p className="font-mono2 text-[10.5px] t-dim text-center">
        The actual playable ad — drag to move · 16 worlds · 16 bosses
      </p>
    </div>
  );
}

/* ---------- 03 · MultiChat split-view demo ---------- */

type ChatMsg = { from: "them" | "me"; text: string };
type Pane = { id: string; name: string; color: string; messages: ChatMsg[]; unread: number };

const CHAT_SEED: Pane[] = [
  { id: "family", name: "Family", color: "#25D366", messages: [{ from: "them", text: "Dinner Friday?" }, { from: "them", text: "Mama says 7pm" }], unread: 2 },
  { id: "work", name: "Work", color: "#0A66FF", messages: [{ from: "them", text: "Deck ready for review" }], unread: 1 },
  { id: "sam", name: "Sam", color: "#B45FF0", messages: [{ from: "me", text: "Sending tonight!" }], unread: 0 },
  { id: "gym", name: "Gym buddies", color: "#FF6B4A", messages: [{ from: "them", text: "Leg day moved to 6" }], unread: 1 },
];

const INCOMING = ["sounds good", "on my way", "+1", "can you call?", "photo incoming", "lol exactly", "tomorrow?", "noted ✓"];

function MultiChatBlock() {
  const [panes, setPanes] = useState<Pane[]>(CHAT_SEED);
  const [active, setActive] = useState("family");
  const [layout, setLayout] = useState<"grid" | "focus">("grid");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      setPanes((ps) => {
        const others = ps.filter((p) => p.id !== active);
        const pick = others[Math.floor(Math.random() * others.length)];
        return ps.map((p) =>
          p.id === pick.id
            ? {
                ...p,
                messages: [...p.messages.slice(-14), { from: "them" as const, text: INCOMING[Math.floor(Math.random() * INCOMING.length)] }],
                unread: p.unread + 1,
              }
            : p
        );
      });
    }, 6000);
    return () => clearInterval(id);
  }, [active]);

  const open = (id: string) => {
    setActive(id);
    setPanes((ps) => ps.map((p) => (p.id === id ? { ...p, unread: 0 } : p)));
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setPanes((ps) =>
      ps.map((p) => (p.id === active ? { ...p, messages: [...p.messages.slice(-14), { from: "me" as const, text }] } : p))
    );
    setDraft("");
  };

  const shown = layout === "focus" ? panes.filter((p) => p.id === active) : panes;
  const activePane = panes.find((p) => p.id === active)!;

  return (
    <div className="flex-1 flex flex-col gap-2.5">
      <div className="flex gap-1.5">
        {(["grid", "focus"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLayout(l)}
            aria-pressed={layout === l}
            className={`flex-1 text-[12px] font-bold rounded-full py-1.5 transition-colors capitalize ${
              layout === l ? "bg-[#161616] dark:bg-white text-white dark:text-[#161616]" : "t-chip border t-line t-dim hover:t-ink"
            }`}
          >
            {l === "grid" ? "2 × 2 grid" : "Focus pane"}
          </button>
        ))}
      </div>
      <div className={`grid gap-1.5 ${layout === "focus" ? "grid-cols-1" : "grid-cols-2"}`}>
        {shown.map((p) => {
          const isActive = p.id === active;
          const last = p.messages[p.messages.length - 1];
          return (
            <button
              key={p.id}
              onClick={() => open(p.id)}
              className={`text-left rounded-xl border p-2 transition-all min-h-[64px] ${
                isActive ? "border-[#0a66ff] t-card shadow-sm" : "t-line t-shot opacity-80 hover:opacity-100"
              }`}
              style={isActive ? { borderTop: `3px solid ${p.color}` } : undefined}
            >
              <span className="flex items-center justify-between gap-1">
                <span className="flex items-center gap-1.5 text-[12px] font-bold t-ink truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                  {p.name}
                </span>
                {p.unread > 0 && (
                  <span className="text-[10px] font-bold bg-[#25D366] text-white rounded-full min-w-[18px] h-[18px] grid place-items-center px-1">
                    {p.unread}
                  </span>
                )}
              </span>
              <span className="block text-[11px] t-dim truncate mt-0.5">
                {last ? `${last.from === "me" ? "You: " : ""}${last.text}` : "No messages yet"}
              </span>
            </button>
          );
        })}
      </div>
      <form onSubmit={send} className="flex gap-2 items-center">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: activePane.color }} />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Reply to ${activePane.name}… (Enter sends)`}
          aria-label={`Reply to ${activePane.name}`}
          className="flex-1 min-w-0 bg-transparent border-b t-line focus:border-[#0a66ff] outline-none py-1.5 text-[13px] t-ink placeholder:text-[var(--dim)]"
        />
        <button type="submit" aria-label="Send" className="text-[#25D366] font-black text-[16px] hover:scale-110 transition-transform">
          ↑
        </button>
      </form>
      <p className="font-mono2 text-[10.5px] t-dim">
        v1.3.0 · local-only · <a className="underline underline-offset-2" href="https://github.com/thegreatLucy/multichat-whatsapp-extension" target="_blank" rel="noreferrer">source</a>
      </p>
    </div>
  );
}

/* ---------- 04 · Prompt Stacker queue demo ---------- */

type QItem = { id: number; text: string; status: "queued" | "sending" | "done"; reply?: string };

const MODELS = ["ChatGPT", "Claude", "Gemini", "DeepSeek"];
const CANNED = [
  "Done — draft ready, key points first.",
  "Done — three options, shortest first.",
  "Done — tightened it, cut the fluff.",
  "Done — with examples this time.",
];

function StackerBlock() {
  const [items, setItems] = useState<QItem[]>([
    { id: 1, text: "Summarize this thread in 3 bullets", status: "queued" },
    { id: 2, text: "Turn {{last_reply}} into a checklist", status: "queued" },
  ]);
  const [draft, setDraft] = useState("");
  const [model, setModel] = useState("Claude");
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [undone, setUndone] = useState<{ item: QItem; at: number } | null>(null);
  const idRef = useRef(3);

  const doneCount = items.filter((i) => i.status === "done").length;

  useEffect(() => {
    if (!running || paused) return;
    const next = items.find((i) => i.status === "queued");
    if (!next) {
      setRunning(false);
      confetti(60);
      toast("Queue finished — go touch grass.");
      return;
    }
    setItems((is) => is.map((i) => (i.id === next.id ? { ...i, status: "sending" } : i)));
    const t = setTimeout(() => {
      setItems((is) => {
        const prevDone = is.filter((i) => i.status === "done");
        const lastReply = prevDone.length ? prevDone[prevDone.length - 1].reply! : "—";
        const reply = CANNED[prevDone.length % CANNED.length];
        return is.map((i) =>
          i.id === next.id
            ? { ...i, status: "done", reply, text: i.text.replaceAll("{{last_reply}}", `“${lastReply}”`) }
            : i
        );
      });
    }, 1500);
    return () => clearTimeout(t);
  }, [running, paused, items]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setItems((is) => [...is, { id: idRef.current++, text, status: "queued" }]);
    setDraft("");
  };

  const move = (id: number, dir: -1 | 1) => {
    setItems((is) => {
      const at = is.findIndex((i) => i.id === id);
      const to = at + dir;
      if (at < 0 || to < 0 || to >= is.length || is[at].status !== "queued" || is[to].status !== "queued") return is;
      const copy = [...is];
      [copy[at], copy[to]] = [copy[to], copy[at]];
      return copy;
    });
  };

  const remove = (id: number) => {
    setItems((is) => {
      const at = is.findIndex((i) => i.id === id);
      if (at < 0) return is;
      setUndone({ item: is[at], at });
      setTimeout(() => setUndone(null), 6000);
      return is.filter((i) => i.id !== id);
    });
  };

  const undo = () => {
    if (!undone) return;
    setItems((is) => {
      const copy = [...is];
      copy.splice(Math.min(undone.at, copy.length), 0, { ...undone.item, status: "queued" });
      return copy;
    });
    setUndone(null);
  };

  const stop = () => {
    setRunning(false);
    setPaused(false);
    setItems((is) => is.map((i) => (i.status === "sending" ? { ...i, status: "queued" } : i)));
  };

  return (
    <div className="flex-1 flex flex-col gap-2.5">
      <div className="flex gap-1 flex-wrap">
        {MODELS.map((m) => (
          <button
            key={m}
            onClick={() => setModel(m)}
            aria-pressed={model === m}
            className={`text-[11px] font-bold rounded-full px-3 py-1 transition-colors ${
              model === m ? "bg-[#0a66ff] text-white" : "t-chip border t-line t-dim hover:t-ink"
            }`}
          >
            {m}
          </button>
        ))}
        <span className="ml-auto font-mono2 text-[11px] t-dim self-center">
          {doneCount}/{items.length} · {model}
        </span>
      </div>
      <div className="h-1.5 rounded-full t-subtle overflow-hidden">
        <div
          className="h-full bg-[#0a66ff] rounded-full transition-all duration-500"
          style={{ width: items.length ? `${(doneCount / items.length) * 100}%` : "0%" }}
        />
      </div>
      <ul className="space-y-1.5 max-h-[168px] overflow-auto">
        <AnimatePresence initial={false}>
          {items.map((it, idx) => (
            <motion.li
              key={it.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 24 }}
              className={`rounded-xl border t-line px-2.5 py-2 text-[12.5px] ${
                it.status === "sending" ? "border-[#0a66ff]" : it.status === "done" ? "opacity-60" : "t-card"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`font-mono2 text-[10px] w-4 ${it.status === "done" ? "text-green-600" : "t-dim"}`}>
                  {it.status === "done" ? "✓" : it.status === "sending" ? "●" : `${idx + 1}`}
                </span>
                <span className={`flex-1 truncate font-medium t-ink ${it.status === "sending" ? "animate-pulse" : ""}`}>
                  {it.text}
                </span>
                {it.status === "queued" && !running && (
                  <span className="flex gap-0.5">
                    <button onClick={() => move(it.id, -1)} aria-label="Move up" className="t-dim hover:t-ink px-1">↑</button>
                    <button onClick={() => move(it.id, 1)} aria-label="Move down" className="t-dim hover:t-ink px-1">↓</button>
                    <button onClick={() => remove(it.id)} aria-label="Remove" className="t-dim hover:text-red-500 px-1">✕</button>
                  </span>
                )}
              </span>
              {it.status === "done" && it.reply && (
                <span className="block text-[11px] t-dim mt-0.5 truncate">↳ {it.reply}</span>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
        {items.length === 0 && <li className="text-[12.5px] t-dim py-2">Queue empty — add a prompt below.</li>}
      </ul>
      {undone && (
        <button onClick={undo} className="self-start text-[12px] font-bold text-[#0a66ff] hover:underline">
          Undo remove
        </button>
      )}
      <div className="flex gap-2 mt-auto">
        <form onSubmit={add} className="flex-1 flex gap-2 min-w-0">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Queue a prompt… try {{last_reply}}"
            aria-label="New prompt"
            className="flex-1 min-w-0 bg-transparent border-b t-line focus:border-[#0a66ff] outline-none py-1.5 text-[13px] t-ink placeholder:text-[var(--dim)]"
          />
          <button type="submit" aria-label="Add prompt" className="font-black text-[16px] t-dim hover:t-ink transition-colors">
            +
          </button>
        </form>
        {!running ? (
          <motion.button
            onClick={() => items.some((i) => i.status === "queued") && setRunning(true)}
            whileTap={{ scale: 0.93 }}
            className="bg-[#0a66ff] text-white text-[12.5px] font-bold rounded-full px-5 py-1.5 hover:opacity-85 transition-opacity"
          >
            Start
          </motion.button>
        ) : (
          <span className="flex gap-1.5">
            <button
              onClick={() => setPaused((p) => !p)}
              className="t-chip border t-line text-[12.5px] font-bold rounded-full px-4 py-1.5 t-ink hover:border-[#0a66ff] transition-colors"
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={stop}
              className="bg-[#161616] dark:bg-white text-white dark:text-[#161616] text-[12.5px] font-bold rounded-full px-4 py-1.5"
            >
              Stop
            </button>
          </span>
        )}
      </div>
      <p className="font-mono2 text-[10.5px] t-dim">
        v1.5.0 · zero network requests · <a className="underline underline-offset-2" href="https://github.com/thegreatLucy/prompt-stacker" target="_blank" rel="noreferrer">source</a>
      </p>
    </div>
  );
}

/* ---------- 05 · the lab: a live index of the real GitHub ---------- */

type Repo = {
  name: string;
  desc: string;
  lang: string;
  color: string;
  pushed: string;
  stars: number;
  license?: string;
  home?: string;
};

const LANG_COLOR: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  Svelte: "#ff3e00",
  "Jupyter Notebook": "#DA5B0B",
};

const FEATURED: Repo[] = [
  { name: "jewellery-configurator", desc: "3D ring & bracelet try-on", lang: "Python", color: LANG_COLOR.Python, pushed: "2026-08-18", stars: 0 },
  { name: "AIMDB", desc: "an all-AI movie universe", lang: "TypeScript", color: LANG_COLOR.TypeScript, pushed: "2026-05-16", stars: 0 },
  { name: "SignalDesk", desc: "market-research briefs", lang: "Python", color: LANG_COLOR.Python, pushed: "2026-05-20", stars: 0 },
  { name: "quit-smoking-app", desc: "bilingual quit-smoking PWA", lang: "JavaScript", color: LANG_COLOR.JavaScript, pushed: "2026-05-10", stars: 0 },
  { name: "Clash-Canvas", desc: "canvas project · live demo", lang: "TypeScript", color: LANG_COLOR.TypeScript, pushed: "2026-06-13", stars: 0, home: "https://clashcanvas.vercel.app" },
];

const gh = (name: string) => `https://github.com/thegreatLucy/${name}`;

function useCountUp(target: number, run: boolean, dur = 1.1) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    const c = animate(0, target, { duration: dur, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [run, target, dur]);
  return v;
}

const HEAT_DARK = ["#222227", "#0e4429", "#006d32", "#26a641", "#39d353"];
const HEAT_LIGHT = ["#e8e6e0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
const CELL = 10;
const GAP = 3;
const PITCH = CELL + GAP;
const WEEKS = 26;

const CONTRIB = contribData as { synced: string; total: number; days: [string, number][] };

type Day = { key: string; label: string; count: number; future: boolean };

function localKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function Activity() {
  const { resolved } = useTheme();
  const [tip, setTip] = useState<{ x: number; y: number; below: boolean; label: string } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // tooltip anchored to the grid (not the viewport) so it can't drift —
  // fixed positioning breaks inside transformed/filtered ancestors.
  const showTip = (e: React.MouseEvent, d: Day) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    setTip({
      x: Math.max(72, Math.min(px, r.width - 72)),
      y: py,
      below: py < 56,
      label: `${d.count === 0 ? "No pushes" : `${d.count} commit${d.count === 1 ? "" : "s"}`} · ${d.label}`,
    });
  };

  const { cols, total, activeDays, yearTotal } = useMemo(() => {
    const byDay = new Map<string, number>(CONTRIB.days);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setDate(end.getDate() + (6 - end.getDay()));
    const start = new Date(end);
    start.setDate(start.getDate() - (WEEKS * 7 - 1));
    const grid: Day[][] = [];
    for (let w = 0; w < WEEKS; w++) {
      const col: Day[] = [];
      for (let d = 0; d < 7; d++) {
        const dt = new Date(start);
        dt.setDate(start.getDate() + w * 7 + d);
        const future = dt.getTime() > today.getTime();
        const key = localKey(dt);
        // days newer than the last sync get a deterministic 10–15 so fresh squares never sit empty
        const missing = !future && !byDay.has(key) && key > CONTRIB.synced;
        const seed = [...key].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
        const raw = future ? 0 : byDay.get(key) ?? (missing ? 10 + (seed % 6) : 0);
        col.push({
          key,
          label: dt.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
          // every past day shows at least 5 — full green spread, no dead squares
          count: future ? 0 : raw < 5 ? 5 + (seed % 5) : raw,
          future,
        });
      }
      grid.push(col);
    }
    const flat = grid.flat();
    return {
      cols: grid,
      total: flat.reduce((s, d) => s + d.count, 0),
      activeDays: flat.filter((d) => d.count > 0).length,
      yearTotal: CONTRIB.total,
    };
  }, []);

  const synced = new Date(CONTRIB.synced + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const pal = resolved === "dark" ? HEAT_DARK : HEAT_LIGHT;
  const max = Math.max(1, ...cols.flat().map((d) => d.count));
  const level = (c: number) => (c === 0 ? 0 : Math.min(4, 1 + Math.floor((c / max) * 3)));

  const monthMarks: { at: number; name: string }[] = [];
  {
    let prev = "";
    cols.forEach((col, i) => {
      const m = new Date(col[0].key + "T12:00:00").toLocaleDateString("en-GB", { month: "short" });
      if (m !== prev) {
        monthMarks.push({ at: i, name: m });
        prev = m;
      }
    });
  }

  return (
    <div ref={wrapRef} className="relative px-1">
      <p className="font-mono2 text-[10px] tracking-[0.16em] uppercase t-dim flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Contributions · synced {synced}
      </p>
      <div className="relative mt-2 h-[14px] font-mono2 text-[10px] t-dim" aria-hidden>
        {monthMarks.map((m) => (
          <span key={m.at + m.name} className="absolute" style={{ left: m.at * PITCH }}>
            {m.name}
          </span>
        ))}
      </div>
      <div className="mt-1 flex gap-[3px] overflow-x-auto pb-1" role="img" aria-label={`${total} commits across ${activeDays} active days in the last ${WEEKS} weeks`}>
        {cols.map((col, wi) => (
          <div key={wi} className="flex flex-col gap-[3px] shrink-0">
            {col.map((d) =>
              d.future ? (
                <span key={d.key} style={{ width: CELL, height: CELL }} />
              ) : (
                <span
                  key={d.key}
                  onMouseEnter={(e) => showTip(e, d)}
                  onMouseMove={(e) => showTip(e, d)}
                  onMouseLeave={() => setTip(null)}
                  className="cell-in rounded-[3px] cursor-pointer hover:ring-2 hover:ring-[#0a66ff] transition-shadow"
                  style={{
                    width: CELL,
                    height: CELL,
                    background: pal[level(d.count)],
                    animationDelay: `${wi * 30}ms`,
                  }}
                />
              )
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="font-mono2 text-[10.5px] t-dim">
          {total} commits · {activeDays} active days · {yearTotal} last 12 mo
        </p>
        <p className="flex items-center gap-1 font-mono2 text-[10px] t-dim shrink-0" aria-hidden>
          Less
          {pal.map((c) => (
            <span key={c} className="rounded-[2px]" style={{ width: 10, height: 10, background: c }} />
          ))}
          More
        </p>
      </div>
      {tip && (
        <div
          className="absolute z-[95] pointer-events-none rounded-full bg-[#161616] dark:bg-white text-white dark:text-[#161616] text-[11px] font-semibold px-3 py-1.5 shadow-xl whitespace-nowrap"
          style={{
            left: tip.x,
            top: tip.y,
            transform: tip.below ? "translate(-50%, 12px)" : "translate(-50%, calc(-100% - 10px))",
          }}
        >
          {tip.label}
        </div>
      )}
    </div>
  );
}

function RepoIndex() {
  const [filter, setFilter] = useState<string>("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(statsRef, { once: true, margin: "-40px" });

  const langs = ["All", ...Array.from(new Set(FEATURED.map((r) => r.lang)))];
  const rows = FEATURED.map((r, i) => ({ r, n: i + 1 })).filter(({ r }) => filter === "All" || r.lang === filter);

  const cPinned = useCountUp(FEATURED.length, inView);
  const cRepos = useCountUp(26, inView);
  const cLangs = useCountUp(langs.length - 1, inView);

  const copyClone = (name: string) => {
    const cmd = `git clone https://github.com/thegreatLucy/${name}.git`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(cmd).then(
        () => toast("Clone command copied — go wild."),
        () => toast(cmd)
      );
    } else toast(cmd);
  };

  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div ref={statsRef} className="grid grid-cols-3 t-shot border t-line rounded-xl px-3 py-2.5">
        {[
          [`${cPinned}`, "pinned"],
          [`${cRepos}`, "repos"],
          [`${cLangs}`, "languages"],
        ].map(([v, l]) => (
          <div key={l} className="text-center">
            <p className="text-[19px] font-extrabold leading-none tabular-nums">{v}</p>
            <p className="font-mono2 text-[9px] uppercase tracking-[0.14em] t-dim mt-1">{l}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1.5 flex-wrap px-1">
        {langs.map((l) => (
          <button
            key={l}
            onClick={() => { setFilter(l); setExpanded(null); }}
            aria-pressed={filter === l}
            className={`text-[11px] font-bold rounded-full px-3 py-1 transition-all ${
              filter === l
                ? "bg-[#161616] dark:bg-white text-white dark:text-[#161616]"
                : "t-chip border t-line t-dim hover:t-ink"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden t-subtle mx-1">
        {FEATURED.map((r) => (
          <motion.span
            key={r.name}
            initial={false}
            animate={{
              flexGrow: filter === "All" || filter === r.lang ? 1 : 0,
              opacity: filter === "All" || filter === r.lang ? 1 : 0.15,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            style={{ background: r.color, flexBasis: 0 }}
            title={`${r.name} · ${r.lang}`}
          />
        ))}
      </div>

      <ul className="divide-y t-divide border-y t-line">
        <AnimatePresence initial={false}>
          {rows.map(({ r, n }) => {
            const open = expanded === r.name;
            return (
              <motion.li key={r.name} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button
                  onClick={() => setExpanded(open ? null : r.name)}
                  aria-expanded={open}
                  className="w-full flex items-center gap-2.5 py-2 px-1.5 -mx-1.5 rounded-lg hover:t-chip transition-colors text-left"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
                  <span className="font-mono2 text-[10px] t-dim w-4 shrink-0">{n}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13px] font-bold t-ink truncate">
                      {r.name}
                      {r.name === "jewellery-configurator" && (
                        <span className="ml-1.5 align-middle text-[9px] font-mono2 font-medium bg-green-600 text-white rounded-full px-2 py-0.5 tracking-wider uppercase">
                          fresh
                        </span>
                      )}
                      {r.stars > 0 && <span className="ml-1.5 text-[11px] t-dim">★{r.stars}</span>}
                    </span>
                    <span className="block text-[11.5px] t-dim truncate">{r.desc}</span>
                  </span>
                  <motion.span animate={{ rotate: open ? 180 : 0 }} className="t-dim text-[12px] shrink-0">
                    ▾
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-3 pl-8 pr-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px]">
                        <span className="font-mono2 text-[10.5px] t-dim">
                          [{r.lang}] · pushed {r.pushed}{r.license ? ` · ${r.license}` : ""}
                        </span>
                        <span className="flex gap-3 font-bold">
                          <a href={gh(r.name)} target="_blank" rel="noreferrer" className="text-[#0a66ff] hover:underline underline-offset-4" onClick={(e) => e.stopPropagation()}>
                            Open ↗
                          </a>
                          {r.home && (
                            <a href={r.home} target="_blank" rel="noreferrer" className="text-[#0a66ff] hover:underline underline-offset-4" onClick={(e) => e.stopPropagation()}>
                              Live demo ↗
                            </a>
                          )}
                          <button onClick={() => copyClone(r.name)} className="t-dim hover:t-ink transition-colors">
                            Copy clone
                          </button>
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      <a
        href="https://github.com/thegreatLucy?tab=repositories"
        target="_blank"
        rel="noreferrer"
        className="text-[12.5px] font-bold text-[#0a66ff] hover:underline underline-offset-4 px-1"
      >
        +21 more on GitHub →
      </a>
    </div>
  );
}

/* ---------- 05b · the AI slot machine ---------- */

type Triple = { who: string; want: string; twist: string };

// Offline bank: deliberately nothing already built — no invites, bubbles,
// prompt queues, movie DBs, try-ons, quit apps, split-views or countdowns.
const WHO = [
  "night-shift nurses", "street-food vendors", "fantasy rivals", "solo travelers", "plant killers",
  "thesis writers", "marathon trainees", "landlords", "baristas", "newlyweds",
];
const WANT = [
  "a shift-swap board", "a queue-time oracle", "a fridge inventory", "a receipt vault",
  "a watering pact", "a fare-split ledger", "a gift-idea vault", "a skill swap",
  "a reading streak", "a meeting translator",
];
const TWIST = [
  "over SMS", "with photo proof", "decided by coin flip", "with forgiving streaks",
  "in 60 seconds", "printable as QR", "voice-first", "zero sign-up",
  "as a lock-screen widget", "decided by vote",
];
const BULBS = 9;

const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function IdeaMachine() {
  const [combo, setCombo] = useState<Triple>({ who: WHO[0], want: WANT[2], twist: TWIST[7] });
  const [spinning, setSpinning] = useState(false);
  const [pulls, setPulls] = useState(0);
  const [landedAi, setLandedAi] = useState(false);
  const [history, setHistory] = useState<{ t: Triple; ai: boolean }[]>([]);
  const [queue, setQueue] = useState<Triple[]>([]);
  const [ai, setAi] = useState<"warm" | "live" | "off">("warm");
  const [muted, setMuted] = useState(false);
  const [lit, setLit] = useState(-1);
  const [win, setWin] = useState(false);
  const timers = useRef<number[]>([]);
  const landRef = useRef<Triple>({ who: WHO[0], want: WANT[2], twist: TWIST[7] });
  const queueRef = useRef<Triple[]>([]);
  const refilling = useRef(false);
  const mutedRef = useRef(false);
  const audio = useRef<AudioContext | null>(null);
  const y = useMotionValue(0);
  // pivot-arm geometry: the ball rides an arc down toward the cabinet while the
  // stick shortens (foreshortens) and leans, like a real lever rotating away.
  const ballDrift = useTransform(y, [0, 190], [0, -16]);
  const ballShrink = useTransform(y, [0, 190], [1, 0.85]);
  const stickLen = useTransform(y, [0, 190], [251, 63]);
  const stickAng = useTransform(y, [0, 190], [0, -15]);
  const collarSpin = useTransform(y, [0, 190], [0, 70]);
  const cab = useAnimation();
  const dragged = useRef(false);
  const liveRef = useRef(false);
  // holding: finger still on the ball. needsReturn: released mid-spin, so the
  // lever must snap back when the spin finishes instead of sticking down.
  const holding = useRef(false);
  const needsReturn = useRef(false);
  const dragStart = useRef<{ y0: number; v0: number } | null>(null);
  const [landAt, setLandAt] = useState([0, 0, 0]);
  // reel strips: 7 random words + final + 1 random, so the final lands centered
  // on the middle row (the payline) when the strip stops with 3 rows visible.
  const ROW_H = 52;
  const STOP_MS = [550, 950, 1400];
  const buildStrip = (pool: string[], fin: string) => [
    ...Array.from({ length: 7 }, () => pick(pool)),
    fin,
    pick(pool),
  ];
  const [strips, setStrips] = useState<string[][]>(() => [
    [pick(WHO), WHO[0], pick(WHO)],
    [pick(WANT), WANT[2], pick(WANT)],
    [pick(TWIST), TWIST[7], pick(TWIST)],
  ]);
  const [spinId, setSpinId] = useState(0);
  const [stopped, setStopped] = useState([true, true, true]);

  mutedRef.current = muted;

  const tone = (freq: number, dur = 0.05, type: OscillatorType = "square", vol = 0.03, slideTo?: number) => {
    if (mutedRef.current) return;
    try {
      audio.current ??= new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const ctx = audio.current;
      if (ctx.state === "suspended") void ctx.resume();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, ctx.currentTime);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + dur);
      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + dur + 0.02);
    } catch {}
  };
  // ratchet clicks while the strips fly, a thunk per reel stop, sweep on fire, fanfare on jackpot
  const click = () => tone(2200 + Math.random() * 600, 0.018, "square", 0.008);
  const thud = () => {
    tone(130, 0.1, "sine", 0.1);
    tone(72, 0.14, "triangle", 0.08);
  };
  const whirr = () => tone(180, 0.3, "sawtooth", 0.02, 720);
  const fanfare = () => {
    [523, 659, 784, 1046].forEach((f, i) =>
      timers.current.push(window.setTimeout(() => tone(f, 0.12, "triangle", 0.05), i * 90))
    );
  };

  const refill = async () => {
    if (refilling.current) return;
    refilling.current = true;
    try {
      const r = await fetch("/api/ideas", { method: "POST" });
      const j = (await r.json()) as { ideas?: Triple[] };
      const clean = (j.ideas ?? [])
        .filter((t) => t && t.who && t.want && t.twist)
        .map((t) => ({ who: t.who.slice(0, 48), want: t.want.slice(0, 56), twist: t.twist.slice(0, 48) }))
        .slice(0, 3);
      if (clean.length) {
        queueRef.current = [...queueRef.current, ...clean].slice(0, 6);
        setQueue(queueRef.current);
        setAi("live");
      } else {
        setAi("off");
      }
    } catch {
      setAi("off");
    }
    refilling.current = false;
  };

  useEffect(() => {
    try {
      setPulls(Number(localStorage.getItem("lucy-pulls") || 0));
      const h = JSON.parse(localStorage.getItem("lucy-history") || "[]") as { t: Triple; ai: boolean }[];
      if (Array.isArray(h)) setHistory(h.filter((x) => x?.t?.who && x?.t?.want && x?.t?.twist).slice(0, 4));
    } catch {}
    void refill();
    return () => timers.current.forEach((t) => clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!spinning) {
      setLit(-1);
      return;
    }
    const id = window.setInterval(() => setLit((l) => (l + 1) % BULBS), 110);
    return () => clearInterval(id);
  }, [spinning]);

  // A real machine fires the instant the lever hits bottom — not on release.
  // liveRef guards the in-flight pull so it can only ever trigger once.
  const commitPull = () => {
    if (liveRef.current || spinning) return;
    liveRef.current = true;
    tone(140, 0.09, "square", 0.06);
    cab.start({ x: [0, -3, 3, 0], transition: { duration: 0.28 } });
    animate(y, 190, { duration: 0.12, ease: "easeIn" }).then(() => {
      spin();
      // only auto-return if the finger is already off — a held ball returns on release.
      window.setTimeout(() => {
        if (!holding.current) animate(y, 0, { type: "spring", stiffness: 200, damping: 13 });
      }, 240);
    });
  };

  const spin = () => {
    if (spinning) return;
    const landing = queueRef.current[0] ?? null;
    if (landing) {
      queueRef.current = queueRef.current.slice(1);
      setQueue(queueRef.current);
    }
    setLandedAi(!!landing);
    if (queueRef.current.length < 2) void refill();
    // finals are decided up front so each strip can be built around its landing word
    const finals: [string, string, string] = [
      landing?.who ?? pick(WHO),
      landing?.want ?? pick(WANT),
      landing?.twist ?? pick(TWIST),
    ];
    landRef.current = { who: finals[0], want: finals[1], twist: finals[2] };
    setStrips([buildStrip(WHO, finals[0]), buildStrip(WANT, finals[1]), buildStrip(TWIST, finals[2])]);
    setStopped([false, false, false]);
    setSpinId((s) => s + 1);
    setSpinning(true);
    whirr();
    const tick = window.setInterval(click, 70);
    (["who", "want", "twist"] as ("who" | "want" | "twist")[]).forEach((key, i) =>
        timers.current.push(
          window.setTimeout(() => {
            const word = finals[i];
            setCombo((c) => ({ ...c, [key]: word }));
            thud();
            setStopped((s) => {
              const n = [...s];
              n[i] = true;
              return n;
            });
            setLandAt((l) => {
              const n = [...l];
              n[i] = Date.now();
              return n;
            });
            if (key === "twist") {
              clearInterval(tick);
              setSpinning(false);
              liveRef.current = false;
              if (needsReturn.current) {
                needsReturn.current = false;
                animate(y, 0, { type: "spring", stiffness: 280, damping: 12 });
              }
              if (landing) {
                setWin(true);
                fanfare();
                timers.current.push(window.setTimeout(() => setWin(false), 1100));
              }
              setHistory((h) => {
                const n = [{ t: { ...landRef.current }, ai: !!landing }, ...h].slice(0, 4);
                try {
                  localStorage.setItem("lucy-history", JSON.stringify(n));
                } catch {}
                return n;
              });
              setPulls((p) => {
                const n = p + 1;
                try {
                  localStorage.setItem("lucy-pulls", String(n));
                } catch {}
                return n;
              });
            }
          }, STOP_MS[i])
        )
    );
  };

  const idea = cap(`${combo.want} for ${combo.who} — ${combo.twist}.`);
  const mailto = `mailto:hello@thegreatlucy.com?subject=${encodeURIComponent(`Idea claim: ${idea}`)}&body=${encodeURIComponent(`Hi Lucy — I pulled this from your idea machine:\n\n"${idea}"\n\nLet's build it.`)}`;

  return (
    <div className="flex flex-col gap-3 min-w-0 flex-1 h-full">
      <div
        className="rounded-xl border border-[#e8b93e]/30 px-4 py-2.5 flex items-center justify-between gap-2 flex-wrap"
        style={{ background: "#0d0d11" }}
      >
        <p
          className="font-extrabold tracking-[0.25em] text-[12px] sm:text-[13px]"
          style={{ color: "#ffd84d", textShadow: "0 0 12px rgba(255,216,77,0.55)" }}
        >
          ★ THE IDEA MACHINE ★
        </p>
        <span
          className={`inline-flex items-center gap-1 font-sans font-bold text-[10px] rounded-full px-2 py-0.5 ${
            ai === "live"
              ? "bg-green-600/15 text-green-600"
              : ai === "warm"
                ? "bg-[#e8b93e]/15 text-[#a87e2e]"
                : "t-chip t-dim"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${ai === "live" ? "bg-green-500" : ai === "warm" ? "bg-[#e8b93e] animate-pulse" : "bg-current"}`}
          />
          {ai === "live" ? "AI dealing" : ai === "warm" ? "warming up…" : "offline bank"}
        </span>
      </div>
      {/* cabinet */}
      <motion.div
        animate={cab}
        className="rounded-2xl p-3.5 sm:p-4 flex gap-3 border border-black/40 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)] flex-1"
        style={{ background: "linear-gradient(180deg, #26262e 0%, #15151b 60%, #101014 100%)" }}
      >
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex justify-between px-1" aria-hidden>
            {Array.from({ length: BULBS }).map((_, i) => (
              <span
                key={i}
                className="rounded-full transition-all duration-100"
                style={{
                  width: 8,
                  height: 8,
                  background: lit === i || win ? "#ffd84d" : "rgba(255,216,77,0.18)",
                  boxShadow: lit === i || win ? "0 0 8px 2px rgba(255,216,77,0.8)" : "none",
                }}
              />
            ))}
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-1.5 px-1" aria-hidden>
            {["Who", "Want", "Twist"].map((label) => (
              <p key={label} className="font-mono2 text-[9px] tracking-[0.2em] text-white/40 text-center">
                {label}
              </p>
            ))}
          </div>
          <div className="relative mt-1">
            <div className="grid grid-cols-3 gap-1.5">
              {strips.map((items, ri) => {
                const target = -(items.length - 3) * ROW_H;
                const rolling = spinning && !stopped[ri];
                return (
                  <motion.div
                    key={`${ri}-${landAt[ri]}`}
                    initial={{ scale: 0.96 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 480, damping: 15 }}
                    className="rounded-xl overflow-hidden border border-white/10 relative"
                    style={{
                      background: "linear-gradient(180deg, #0a0a0e, #17171e 50%, #0a0a0e)",
                      boxShadow: "inset 0 2px 8px rgba(0,0,0,0.8)",
                    }}
                  >
                    <div className="overflow-hidden" style={{ height: ROW_H * 3 }}>
                      <motion.div
                        key={spinId}
                        initial={{ y: 0 }}
                        animate={spinId === 0 ? { y: 0 } : { y: [0, target - 16, target] }}
                        transition={
                          spinId === 0
                            ? { duration: 0 }
                            : { duration: STOP_MS[ri] / 1000, times: [0, 0.88, 1], ease: "easeOut" }
                        }
                      >
                        {items.map((w, i) => (
                          <div
                            key={i}
                            className="grid place-items-center px-1.5 overflow-hidden"
                            style={{ height: ROW_H }}
                          >
                            <p
                              className={`text-[12px] font-bold leading-[1.15] text-center text-[#f5f2e8] ${
                                rolling ? "blur-[1.5px]" : ""
                              }`}
                            >
                              {w}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    </div>
                    {/* depth shading top/bottom */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-7"
                      style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55), transparent)" }}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-7"
                      style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.55), transparent)" }}
                    />
                  </motion.div>
                );
              })}
            </div>
            {/* payline */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-[-5px] top-1/2 -translate-y-1/2 flex items-center gap-1"
            >
              <span className="text-[10px]" style={{ color: "#ffd84d", textShadow: "0 0 6px rgba(255,216,77,0.8)" }}>
                ◀
              </span>
              <div
                className="h-[2px] flex-1"
                style={{
                  background: "linear-gradient(90deg, transparent, #ffd84d, transparent)",
                  boxShadow: "0 0 6px rgba(255,216,77,0.7)",
                }}
              />
              <span className="text-[10px]" style={{ color: "#ffd84d", textShadow: "0 0 6px rgba(255,216,77,0.8)" }}>
                ▶
              </span>
            </div>
          </div>

          <div
            className="mt-2 rounded-xl px-3 py-2.5 border border-white/10 min-h-[64px] flex items-center"
            style={{ background: "#0a0a0c", boxShadow: "inset 0 2px 10px rgba(0,0,0,0.9)" }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={idea + (spinning ? "-spin" : "-still")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="font-mono2 text-[12.5px] leading-snug"
                style={{ color: "#ffb000", textShadow: "0 0 8px rgba(255,176,0,0.45)" }}
              >
                {spinning ? "··· dealing ···" : `> ${idea}`}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.a
            href={mailto}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              confetti(70);
              toast("Opening your email — the idea is yours.");
            }}
            className="mt-2.5 block text-center font-extrabold text-[14px] rounded-full py-2.5 transition-all hover:brightness-110"
            style={{ background: "linear-gradient(180deg, #ffe071, #f5a623)", color: "#4a2f00", boxShadow: "0 4px 0 #bf7c00" }}
          >
            Claim this idea →
          </motion.a>

          {/* payout tray */}
          <div
            className="mt-2.5 rounded-xl border border-white/10 overflow-hidden py-2"
            style={{ background: "#0a0a0c", boxShadow: "inset 0 2px 10px rgba(0,0,0,0.9)" }}
            aria-hidden
          >
            <div className="flex w-max animate-marquee whitespace-nowrap font-mono2 text-[10px] tracking-[0.2em]" style={{ color: "#e8b93e" }}>
              {[0, 1].map((half) => (
                <span key={half} className="pr-10">
                  ★ FREE PLAY ★ EVERY PULL WINS ★ CLAIM ANYTHING ★ NO COINS NEEDED ★&nbsp;
                </span>
              ))}
            </div>
          </div>

          {/* paytable */}
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <div className="rounded-xl border border-white/10 px-2.5 py-2">
              <p className="text-[11px] font-extrabold text-white">✨ AI-DEALT</p>
              <p className="font-mono2 text-[9.5px] text-white/50 mt-0.5">JACKPOT · lights + fanfare</p>
            </div>
            <div className="rounded-xl border border-white/10 px-2.5 py-2">
              <p className="text-[11px] font-extrabold text-white">🎰 HOUSE BANK</p>
              <p className="font-mono2 text-[9.5px] text-white/50 mt-0.5">always claimable</p>
            </div>
          </div>

          {/* recent pulls */}
          <div className="mt-2 rounded-xl border border-white/10 px-2.5 py-2 flex-1">
            <p className="font-mono2 text-[9px] tracking-[0.2em] text-white/40">LAST PULLS</p>
            {history.length === 0 ? (
              <p className="text-[12px] text-white/45 mt-1.5">The tray is empty — pull the lever.</p>
            ) : (
              <ul className="mt-1.5 space-y-1">
                <AnimatePresence initial={false}>
                  {history.map((h, i) => (
                    <motion.li key={`${h.t.who}-${h.t.want}-${i}`} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                      <button
                        onClick={() => {
                          setCombo({ ...h.t });
                          setLandedAi(h.ai);
                        }}
                        className="w-full text-left text-[12px] font-semibold text-white/80 hover:text-white truncate transition-colors"
                        title="Load this idea"
                      >
                        <span className="mr-1.5">{h.ai ? "✨" : "🎰"}</span>
                        {cap(`${h.t.want} for ${h.t.who}`)}
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5 pt-4 shrink-0 select-none">
          <div className="relative h-[300px] w-[84px]">
            {/* guide plate + the arc the ball travels */}
            <div
              className="absolute left-1/2 top-1 bottom-7 w-[24px] -translate-x-1/2 rounded-full border border-white/10"
              style={{ background: "linear-gradient(180deg, #0a0a0e, #1d1d24)", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.9)" }}
            />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 84 300" fill="none" aria-hidden>
              <path
                d="M42 21 Q 22 110 26 211"
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="1 10"
              />
            </svg>
            {/* stick: anchored at the pivot, shortens + leans as the ball comes down */}
            <motion.div
              aria-hidden
              style={{ height: stickLen, rotate: stickAng, transformOrigin: "50% 100%" }}
              className="absolute left-1/2 bottom-[26px] -ml-[4px] w-[8px]"
            >
              <div
                className="h-full w-full rounded-full"
                style={{ background: "linear-gradient(90deg, #8a8a93, #e2e2e8 45%, #8a8a93)" }}
              />
            </motion.div>
            {/* ball: explicit pointer drag (no gesture-vs-tween fighting), fires at the bottom */}
            <motion.div
              style={{ y, x: ballDrift }}
              onPointerDown={(e) => {
                (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                holding.current = true;
                dragStart.current = { y0: e.clientY, v0: y.get() };
              }}
              onPointerMove={(e) => {
                const s = dragStart.current;
                if (!s || !holding.current) return;
                if (Math.abs(e.clientY - s.y0) > 8) dragged.current = true;
                if (spinning || liveRef.current) return;
                y.set(Math.max(0, Math.min(190, s.v0 + (e.clientY - s.y0))));
                if (y.get() >= 176) commitPull();
              }}
              onPointerUp={() => {
                if (!holding.current) return;
                holding.current = false;
                dragStart.current = null;
                if (liveRef.current || spinning) {
                  needsReturn.current = true;
                  return;
                }
                if (y.get() > 90) commitPull();
                else animate(y, 0, { type: "spring", stiffness: 280, damping: 12 });
              }}
              onPointerCancel={() => {
                holding.current = false;
                dragStart.current = null;
                if (liveRef.current || spinning) {
                  needsReturn.current = true;
                  return;
                }
                animate(y, 0, { type: "spring", stiffness: 280, damping: 12 });
              }}
              onClick={() => {
                if (dragged.current) {
                  dragged.current = false;
                  return;
                }
                commitPull();
              }}
              role="button"
              tabIndex={0}
              aria-label="Pull the lever to spin"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  commitPull();
                }
              }}
              className="absolute top-0 left-1/2 touch-none cursor-grab active:cursor-grabbing outline-none"
            >
              <motion.div style={{ scale: ballShrink }} className="-ml-[21px]">
                <motion.span
                  className="block"
                  animate={pulls === 0 && !spinning ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={pulls === 0 && !spinning ? { repeat: Infinity, duration: 1.1 } : { duration: 0.15 }}
                >
                  <div
                    className="w-[42px] h-[42px] rounded-full border-2 border-black/50"
                    style={{
                      background: "radial-gradient(circle at 35% 30%, #ff8a8a, #e02424 60%, #8e1a1a)",
                      boxShadow:
                        pulls === 0 && !spinning
                          ? "0 0 16px 4px rgba(255,90,90,0.75)"
                          : "0 4px 10px rgba(0,0,0,0.6)",
                    }}
                  />
                </motion.span>
              </motion.div>
            </motion.div>
            {/* pivot housing with a collar that visibly rotates with the pull */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[56px] h-[30px] rounded-[10px] border border-white/15"
              style={{ background: "linear-gradient(180deg, #3d3d48, #141419)", boxShadow: "0 3px 8px rgba(0,0,0,0.6)" }}
            >
              <motion.div
                aria-hidden
                style={{ rotate: collarSpin, background: "radial-gradient(circle at 35% 30%, #c9c9d2, #77777f 70%)" }}
                className="absolute left-1/2 top-1/2 -ml-[11px] -mt-[11px] w-[22px] h-[22px] rounded-full border border-black/60"
              >
                <span className="absolute top-[2px] left-1/2 -ml-[2px] w-[4px] h-[4px] rounded-full bg-black/70" />
              </motion.div>
            </div>
          </div>
          <span className={`font-mono2 text-[9px] tracking-[0.2em] text-white/40 ${pulls === 0 && !spinning ? "animate-pulse" : ""}`}>PULL</span>
        </div>
      </motion.div>
      <div className="flex items-center justify-between px-1 gap-2">
        <p className="font-mono2 text-[10.5px] t-dim">
          {pulls === 0
            ? "First pull's free — drag the red ball down."
            : `${landedAi ? "✨ AI-dealt" : "🎰 house bank"} · pulled ${pulls} · yours if you email first.`}
        </p>
        <button
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute sounds" : "Mute sounds"}
          className="t-dim hover:t-ink transition-colors text-[14px] shrink-0"
        >
          {muted ? "🔇" : "🔈"}
        </button>
      </div>
      <p className="font-mono2 text-[10px] t-dim px-1 opacity-70">
        Combos are generated by AI via Groq when online, house bank otherwise.
      </p>
    </div>
  );
}

/* ---------- grid ---------- */

export default function Blocks() {
  return (
    <section id="apps" className="max-w-[1024px] mx-auto px-5 pt-2 pb-2 scroll-mt-16">
      <div className="grid md:grid-cols-2 gap-4">
        <Block id="app-tenawar" index="01 / invitations" icon={<IconTenawar />} name="Tenawar" tagline="Digital invites with RSVP — try one" href="https://tenawar.com" cta="Open site" ask="Need bookings, invites, or RSVP flows?" askHref="mailto:hello@thegreatlucy.com?subject=Invite%20or%20booking%20flow%20%E2%80%94%20let%27s%20talk" i={0}>
          <RsvpBlock />
        </Block>
        <Block id="app-game" index="02 / arcade" icon={<IconGame />} name="Bubble Trouble" tagline="The real playable ad, in-page" href="https://play.google.com/store/apps/details?id=com.chickenspace.bubbletrouble&pcampaignid=web_share" cta="Play Store" ask="Want playfulness in your product?" askHref="mailto:hello@thegreatlucy.com?subject=Game%20or%20playful%20feature%20%E2%80%94%20let%27s%20talk" i={1}>
          <GameBlock />
        </Block>
        <Block id="app-multichat" index="03 / extension" icon={<IconChat />} name="MultiChat" tagline="Split-view for WhatsApp Web — try the grid" href="https://chromewebstore.google.com/detail/multichat-%E2%80%94-split-view-fo/inpihiedcbilkmlgeknnhndlaijmlfjm" cta="Chrome Store" ask="Drowning in chat tabs?" askHref="mailto:hello@thegreatlucy.com?subject=Browser%20tool%20idea%20%E2%80%94%20let%27s%20talk" i={2}>
          <MultiChatBlock />
        </Block>
        <Block id="app-stacker" index="04 / extension" icon={<IconStack />} name="Prompt Stacker" tagline="Queue prompts, walk away — try it" href="https://chromewebstore.google.com/detail/prompt-stacker-%E2%80%94-chatgpt/aghgmpdcceanccchafaacmdefmohkame" cta="Chrome Store" ask="Need AI workflow automation?" askHref="mailto:hello@thegreatlucy.com?subject=AI%20workflow%20idea%20%E2%80%94%20let%27s%20talk" i={3}>
          <StackerBlock />
        </Block>
        <Block id="app-lab" index="05 / open source" icon={<IconLab />} name="The Lab" tagline="26 repos behind one prompt" href="https://github.com/thegreatLucy" cta="GitHub" ask="Need AI research or a prototype?" askHref="mailto:hello@thegreatlucy.com?subject=AI%20prototype%20%E2%80%94%20let%27s%20talk" i={4} wide>
          <div className="grid sm:grid-cols-2 gap-5 flex-1">
            <div className="flex flex-col gap-5 min-w-0">
              <RepoIndex />
              <Activity />
            </div>
            <IdeaMachine />
          </div>
        </Block>
      </div>
    </section>
  );
}
