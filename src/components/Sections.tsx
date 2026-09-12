"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { EMAIL, copyEmail } from "./Hero";
import { toast } from "./Eggs";

/* ---------- services ---------- */

const SERVICES: { title: string; desc: string; includes: string[]; subject: string }[] = [
  {
    title: "AI products, end to end",
    desc: "From a rough idea to a tool strangers can use — prompts, product, and polish included.",
    includes: ["Research assistants & briefs", "Support bots that stay on-script", "Evals + docs you keep"],
    subject: "AI product — let's scope it",
  },
  {
    title: "Apps & playful builds",
    desc: "Web apps, Android games, browser extensions — small, fast, and fun to open.",
    includes: ["Next.js web apps", "Game feel & pacing", "Chrome extensions"],
    subject: "App idea — let's scope it",
  },
  {
    title: "Bilingual UX (EN + AR)",
    desc: "Interfaces that read naturally in both directions — my Tenawar specialty.",
    includes: ["Arabic-first layouts", "Plain-language copy", "RTL done properly"],
    subject: "Bilingual UX — let's scope it",
  },
];

export function Services() {
  return (
    <section id="services" className="max-w-[1200px] mx-auto px-5 pt-10 scroll-mt-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono2 text-[11px] tracking-[0.18em] uppercase t-dim">Ways we can work together</p>
        <h2 className="mt-2 text-[26px] sm:text-[34px] font-extrabold tracking-[-0.03em]">
          Bring the idea. I&apos;ll bring the shipped version.
        </h2>
      </motion.div>
      <div className="mt-5 grid sm:grid-cols-3 gap-4">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover={{ y: -3 }}
            className="app-card p-5 flex flex-col"
          >
            <h3 className="text-[17px] font-extrabold tracking-tight">{s.title}</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed t-body">{s.desc}</p>
            <ul className="mt-3 space-y-1.5 text-[13px] t-body">
              {s.includes.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="text-[#0a66ff] font-bold">✓</span> {x}
                </li>
              ))}
            </ul>
            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(s.subject)}`}
              className="mt-4 pt-3 border-t t-line text-[13.5px] font-bold text-[#0a66ff] hover:underline underline-offset-4"
            >
              Ask about this →
            </a>
          </motion.div>
        ))}
      </div>

      {/* process strip */}
      <div className="mt-4 app-card px-5 py-4 grid sm:grid-cols-3 gap-3">
        {[
          ["1 · Say hello", "One email. I reply in 12h with honest first thoughts — free."],
          ["2 · Small pilot", "A fixed-scope 1–2 week build, so we test working together cheaply."],
          ["3 · Ship & support", "Launch, docs, and me on call while it finds its people."],
        ].map(([t, d], i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="flex gap-3"
          >
            <span className="font-mono2 text-[11px] t-dim pt-0.5 whitespace-nowrap">{t}</span>
            <p className="text-[13px] leading-relaxed t-body">{d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- contact ---------- */

const NEEDS = ["An AI product", "An app or game", "A browser tool", "Bilingual UX", "Something else"];

export function Contact() {
  const [name, setName] = useState("");
  const [need, setNeed] = useState(NEEDS[0]);
  const [details, setDetails] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`${need} — from ${name.trim() || "a future collaborator"}`);
    const body = encodeURIComponent(`${details.trim() || "Hi Lucy — here's what I'm thinking:"}\n\n— ${name.trim()}\n[${need}]`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    toast("Opening your email — almost there.");
  };

  return (
    <section id="contact" className="max-w-[1200px] mx-auto px-5 pt-10 scroll-mt-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="bg-[#161616] dark:bg-black dark:border dark:border-white/10 text-white rounded-[24px] p-6 sm:p-10 grid sm:grid-cols-2 gap-8"
      >
        <div>
          <p className="font-mono2 text-[11px] tracking-[0.16em] uppercase text-white/50">Good humans only · no pitch decks needed</p>
          <h2 className="text-[28px] sm:text-[36px] font-extrabold tracking-[-0.025em] mt-2 leading-[1.05]">
            Tell me what you&apos;re dreaming of.
          </h2>
          <p className="text-white/70 text-[14px] leading-relaxed mt-3 max-w-[400px]">
            The best first message is short: who it&apos;s for, what it should
            do, and when you&apos;d love it live. Everything else we figure out
            together on a call.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <motion.a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent("Project idea — let's talk")}`}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#161616] font-bold text-[14px] rounded-full px-6 py-2.5 hover:bg-[#0a66ff] hover:text-white transition-colors"
            >
              {EMAIL}
            </motion.a>
            <motion.button
              onClick={copyEmail}
              whileTap={{ scale: 0.95 }}
              className="border border-white/25 font-bold text-[14px] rounded-full px-6 py-2.5 hover:bg-white/10 transition-colors"
            >
              Copy
            </motion.button>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px]">
            {[
              ["GitHub", "https://github.com/thegreatLucy"],
              ["X", "https://x.com/psychedelicflyn"],
              ["Tenawar", "https://tenawar.com"],
              ["Play Store", "https://play.google.com/store/apps/details?id=com.chickenspace.bubbletrouble&pcampaignid=web_share"],
              ["Chrome Store", "https://chromewebstore.google.com/search/ThegreaLucy"],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="font-semibold text-white/70 hover:text-white transition-colors">
                {label} ↗
              </a>
            ))}
          </div>
        </div>

        <form onSubmit={send} className="bg-white/[0.06] border border-white/10 rounded-2xl p-5 flex flex-col gap-3.5">
          <label className="block">
            <span className="font-mono2 text-[10px] tracking-[0.18em] uppercase text-white/50">Your name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mariam"
              className="mt-1 w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-2 text-[14.5px] placeholder:text-white/25"
            />
          </label>
          <div>
            <span className="font-mono2 text-[10px] tracking-[0.18em] uppercase text-white/50">I need…</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {NEEDS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNeed(n)}
                  aria-pressed={need === n}
                  className={`text-[12px] font-semibold rounded-full px-3.5 py-1.5 transition-colors ${
                    need === n ? "bg-white text-[#161616]" : "border border-white/20 text-white/70 hover:border-white/60"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="font-mono2 text-[10px] tracking-[0.18em] uppercase text-white/50">A few words</span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="Who it's for, what it should do…"
              className="mt-1 w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-2 text-[14.5px] resize-none placeholder:text-white/25"
            />
          </label>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.96 }}
            className="mt-1 bg-[#0a66ff] font-bold text-[14px] rounded-full py-3 hover:opacity-90 transition-opacity"
          >
            Send it →
          </motion.button>
          <p className="text-center font-mono2 text-[10.5px] text-white/40">Opens your email, pre-addressed. Nothing stored here.</p>
        </form>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="max-w-[1200px] mx-auto px-5 pt-8 pb-10">
      <div className="border-t t-line pt-5 flex flex-col sm:flex-row justify-between gap-1.5 font-mono2 text-[10.5px] tracking-[0.1em] uppercase t-dim">
        <span>© 2026 thegreatLucy</span>
        <span>Made with care · <a href="#top" className="t-ink hover:opacity-60">Back to top ↑</a></span>
      </div>
    </footer>
  );
}
