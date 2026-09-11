"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "./Theme";

const ITEMS = [
  { label: "RSVP demo — Tenawar", hint: "Demo 01", href: "#app-tenawar" },
  { label: "Playable ad — Bubble Trouble", hint: "Demo 02", href: "#app-game" },
  { label: "MultiChat grid demo", hint: "Demo 03", href: "#app-multichat" },
  { label: "Prompt Stacker queue demo", hint: "Demo 04", href: "#app-stacker" },
  { label: "The Lab — repos & ideas", hint: "Demo 05", href: "#app-lab" },
  { label: "Services — work with me", hint: "Section", href: "#services" },
  { label: "Contact — start a project", hint: "Section", href: "#contact" },
  { label: "Email Lucy", hint: "Action", href: "mailto:hello@thegreatlucy.com" },
];

export default function Palette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setMode } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("lucy:palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("lucy:palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setSel(0);
    // autoFocus alone can lose to the mount animation — retry until it sticks
    let raf = 0;
    let tries = 0;
    const focusIt = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
      if (document.activeElement !== inputRef.current && ++tries < 10) {
        raf = requestAnimationFrame(focusIt);
      }
    };
    raf = requestAnimationFrame(focusIt);
    return () => cancelAnimationFrame(raf);
  }, [open ]);

  const listRef = useRef<HTMLUListElement>(null);

  // keep the keyboard-selected row visible while arrowing
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-sel="1"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [sel, q, open ]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const base = needle ? ITEMS.filter((i) => i.label.toLowerCase().includes(needle)) : ITEMS;
    const themeRow =
      needle && "dark mode".includes(needle)
        ? [{ label: "Toggle dark / light theme", hint: "Action", href: "__theme" }]
        : [];
    return [...themeRow, ...base];
  }, [q ]);

  const go = (href: string) => {
    setOpen(false);
    if (href === "__theme") {
      const isDark = document.documentElement.classList.contains("dark");
      setMode(isDark ? "light" : "dark");
      return;
    }
    if (href.startsWith("mailto:")) {
      window.location.href = href;
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-[2px] flex justify-center pt-[14vh] px-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-[480px] h-fit t-card border t-line rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
          >
            <div className="flex items-center gap-2 px-4 border-b t-line">
              <span className="t-dim">⌕</span>
              <input
                ref={inputRef}
                autoFocus
                value={q}
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={results[sel] ? `palette-opt-${sel}` : undefined}
                onChange={(e) => { setQ(e.target.value); setSel(0); }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
                  if (e.key === "Enter" && results[sel]) go(results[sel].href);
                }}
                placeholder="Where to? Try 'game'…"
                className="flex-1 bg-transparent outline-none py-3.5 text-[14.5px] t-ink placeholder:text-[var(--dim)]"
              />
              <span className="kbd">esc</span>
            </div>
            <ul ref={listRef} id="palette-list" role="listbox" className="max-h-[300px] overflow-auto p-1.5">
              {results.length === 0 && (
                <li className="px-3.5 py-3 text-[13.5px] t-dim">No results. The site is small on purpose.</li>
              )}
              {results.map((r, i) => (
                <li key={r.label}>
                  <button
                    id={`palette-opt-${i}`}
                    role="option"
                    aria-selected={sel === i}
                    data-sel={sel === i ? "1" : "0"}
                    onMouseEnter={() => setSel(i)}
                    onClick={() => go(r.href)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] transition-colors ${
                      sel === i ? "bg-[#0a66ff] text-white" : "t-ink"
                    }`}
                  >
                    <span className="font-medium">{r.label}</span>
                    <span className={`font-mono2 text-[10.5px] ${sel === i ? "text-white/70" : "t-dim"}`}>{r.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="px-4 py-2.5 border-t t-line font-mono2 text-[10.5px] t-dim">
              ↑↓ to move · ↵ to go · psst: try the Konami code
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
