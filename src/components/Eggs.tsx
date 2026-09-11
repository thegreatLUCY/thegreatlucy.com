"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export function toast(msg: string) {
  window.dispatchEvent(new CustomEvent("lucy:toast", { detail: msg }));
}
export function confetti(n = 90) {
  window.dispatchEvent(new CustomEvent("lucy:confetti", { detail: n }));
}

export function ToastHost() {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([]);
  useEffect(() => {
    const onToast = (e: Event) => {
      const msg = (e as CustomEvent).detail as string;
      const id = Date.now() + Math.random();
      setItems((p) => [...p.slice(-2), { id, msg }]);
      setTimeout(() => setItems((p) => p.filter((t) => t.id !== id)), 3400);
    };
    window.addEventListener("lucy:toast", onToast);
    return () => window.removeEventListener("lucy:toast", onToast);
  }, []);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex flex-col items-center gap-2 pointer-events-none px-4">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="bg-[#161616] dark:bg-white text-white dark:text-[#161616] text-[13.5px] font-medium px-5 py-2.5 rounded-full shadow-xl max-w-[90vw] text-center"
          >
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const COLORS = ["#0A66FF", "#E8B93E", "#FF6B4A", "#234434", "#7DD8FF", "#B45FF0"];

export function ConfettiHost() {
  const [pieces, setPieces] = useState<{ id: number; left: number; delay: number; color: string; size: number; round: boolean }[]>([]);
  useEffect(() => {
    const onBurst = (e: Event) => {
      const n = ((e as CustomEvent).detail as number) || 90;
      const batch = Array.from({ length: n }, (_, i) => ({
        id: Date.now() + i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 7,
        round: Math.random() > 0.5,
      }));
      setPieces(batch);
      setTimeout(() => setPieces([]), 3200);
    };
    window.addEventListener("lucy:confetti", onBurst);
    return () => window.removeEventListener("lucy:confetti", onBurst);
  }, []);
  return (
    <>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            animationDelay: `${p.delay}s`,
            background: p.color,
            width: p.size,
            height: p.round ? p.size : p.size * 0.45,
            borderRadius: p.round ? "50%" : "1px",
          }}
        />
      ))}
    </>
  );
}

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function useKonami() {
  const pos = useRef(0);
  const done = useRef(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done.current) return;
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos.current = key === KONAMI[pos.current] ? pos.current + 1 : key === KONAMI[0] ? 1 : 0;
      if (pos.current === KONAMI.length) {
        done.current = true;
        confetti(140);
        toast("Cheat code accepted. You play the game better than most visitors.");
        document.getElementById("app-game")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

/** Fires `onTrigger` after `clicks` rapid clicks. Returns a click handler. */
export function useMultiClick(clicks: number, onTrigger: () => void, window_ms = 900) {
  const state = useRef<{ n: number; t: number }>({ n: 0, t: 0 });
  return useCallback(() => {
    const now = Date.now();
    if (now - state.current.t > window_ms) state.current.n = 0;
    state.current.t = now;
    state.current.n += 1;
    if (state.current.n >= clicks) {
      state.current.n = 0;
      onTrigger();
    }
  }, [clicks, onTrigger, window_ms]);
}
