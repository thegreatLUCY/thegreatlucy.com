"use client";

import { motion } from "framer-motion";
import { toast } from "./Eggs";

const EMAIL = "hello@thegreatlucy.com";

export function copyEmail() {
  const done = () => toast("Email copied — talk soon.");
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(EMAIL).then(done).catch(() => toast(EMAIL));
  } else {
    toast(EMAIL);
  }
}

export { EMAIL };

export default function Hero() {

  return (
    <section id="top" className="max-w-[1024px] mx-auto px-5 pt-10 sm:pt-14 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 text-[12px] font-semibold t-chip border t-line rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Open for new projects
          </span>
          <span className="inline-flex items-center gap-2 text-[12px] t-dim font-medium">
            <motion.span
              className="block w-10 h-10 rounded-full overflow-hidden ring-1 t-line"
              whileHover={{ rotate: -8, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 350, damping: 14 }}
            >
              <img src="/lucy.png" alt="Lucy" width={40} height={40} className="w-full h-full object-cover" />
            </motion.span>
            Lucy · replies in 12h
            <a
              href="https://x.com/psychedelicflyn"
              target="_blank"
              rel="noreferrer"
              aria-label="Lucy on X"
              className="grid place-items-center w-7 h-7 rounded-full border t-line t-dim hover:text-[#0a66ff] hover:border-[#0a66ff] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
            </a>
          </span>
        </div>

        <h1 className="mt-4 text-[34px] sm:text-[54px] leading-[1.02] tracking-[-0.035em] font-extrabold max-w-[760px]">
          I build AI products people actually use. Let&apos;s build yours.
        </h1>
        <p className="mt-3 text-[15px] sm:text-[16px] leading-[1.65] t-body max-w-[620px]">
          Need an app, a playful game layer, or an AI tool your customers
          understand in seconds? I design, build, and ship it with you —
          then stick around while it grows. Try the live demos below; if you
          like how they feel, imagine what we&apos;d make together.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <motion.a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("Project idea — let's talk")}`}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="inline-flex justify-center items-center gap-2 bg-[#0a66ff] text-white font-bold text-[15px] rounded-full px-7 py-3 hover:opacity-90 transition-opacity"
          >
            Start a project →
          </motion.a>
          <motion.button
            onClick={copyEmail}
            whileTap={{ scale: 0.96 }}
            className="inline-flex justify-center items-center gap-2 font-bold text-[15px] rounded-full px-7 py-3 border t-line t-card t-ink hover:border-[#0a66ff] hover:text-[#0a66ff] transition-colors"
          >
            Copy my email
          </motion.button>
          <a
            href="#apps"
            className="inline-flex justify-center items-center font-semibold text-[15px] rounded-full px-7 py-3 t-dim hover:t-ink transition-colors"
          >
            See live demos ↓
          </a>
        </div>

        <dl className="mt-7 grid grid-cols-3 max-w-[560px] border-t t-line pt-4 gap-4">
          {[
            ["Live product", "Tenawar · 8k guests"],
            ["Shipped game", "Bubble Trouble · Play Store"],
            ["Open source", "26 repos · open source"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono2 text-[10.5px] uppercase tracking-[0.14em] t-dim">{k}</dt>
              <dd className="text-[13.5px] font-semibold mt-0.5">{v}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
