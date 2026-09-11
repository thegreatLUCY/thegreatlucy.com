"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Mode = "system" | "light" | "dark";

const Ctx = createContext<{ mode: Mode; setMode: (m: Mode) => void; resolved: "light" | "dark" }>({
  mode: "system",
  setMode: () => {},
  resolved: "light",
});

export function useTheme() {
  return useContext(Ctx);
}

function apply(mode: Mode): "light" | "dark" {
  const root = document.documentElement;
  const resolved: "light" | "dark" =
    mode === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : mode;
  root.classList.toggle("dark", resolved === "dark");
  return resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = (localStorage.getItem("lucy-theme") as Mode) || "system";
    setModeState(saved);
    setResolved(apply(saved));
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current = (localStorage.getItem("lucy-theme") as Mode) || "system";
      if (current === "system") setResolved(apply("system"));
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setMode = useCallback((m: Mode) => {
    localStorage.setItem("lucy-theme", m);
    setModeState(m);
    setResolved(apply(m));
  }, []);

  return <Ctx.Provider value={{ mode, setMode, resolved }}>{children}</Ctx.Provider>;
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13.5A8 8 0 0 1 10.5 4 8 8 0 1 0 20 13.5z" />
    </svg>
  );
}
function AutoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M9 21h6" />
    </svg>
  );
}

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const order: Mode[] = ["system", "light", "dark"];
  const icons = { system: <AutoIcon />, light: <SunIcon />, dark: <MoonIcon /> };
  return (
    <div
      role="group"
      aria-label="Color theme"
      className="flex items-center rounded-full border t-line t-card p-0.5"
      title={`Theme: ${mode} — click to change`}
    >
      {order.map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          aria-pressed={mode === m}
          title={m}
          className={`w-7 h-7 grid place-items-center rounded-full transition-all ${
            mode === m ? "bg-[#0a66ff] text-white" : "t-dim hover:t-ink"
          }`}
        >
          {icons[m]}
        </button>
      ))}
    </div>
  );
}
