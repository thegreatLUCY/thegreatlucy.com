"use client";

import { ThemeToggle } from "./Theme";
import { confetti, toast, useMultiClick } from "./Eggs";

export function IconTenawar({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <rect width="64" height="64" rx="15" fill="#234434" />
      <rect x="14" y="20" width="36" height="26" rx="3" fill="none" stroke="#F4F4F2" strokeWidth="2.5" />
      <path d="M14 22 L32 34 L50 22" fill="none" stroke="#F4F4F2" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="47" cy="17" r="7" fill="#E8B93E" />
      <path d="M47 13.5v7M43.5 17h7" stroke="#234434" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconGame({ size = 40 }: { size?: number }) {
  return (
    <img
      src="/bubble-trouble.png"
      alt=""
      aria-hidden
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: size * 0.24 }}
    />
  );
}

export function IconChat({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <rect width="64" height="64" rx="15" fill="#25D366" />
      <rect x="12" y="12" width="18" height="18" rx="5" fill="#fff" />
      <rect x="34" y="12" width="18" height="18" rx="5" fill="#fff" opacity="0.85" />
      <rect x="12" y="34" width="18" height="18" rx="5" fill="#fff" opacity="0.85" />
      <rect x="34" y="34" width="18" height="18" rx="5" fill="#fff" opacity="0.7" />
    </svg>
  );
}

export function IconStack({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <rect width="64" height="64" rx="15" fill="#0A66FF" />
      <path d="M32 14l16 8-16 8-16-8z" fill="#fff" />
      <path d="M20 30l12 6 12-6" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 37l12 6 12-6" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
    </svg>
  );
}

export function IconLab({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <rect width="64" height="64" rx="15" fill="#E9E4D6" />
      <rect x="10" y="14" width="44" height="36" rx="7" fill="#161616" />
      <path d="M22 26l-5 5 5 5M42 26l5 5-5 5" stroke="#7DD8FF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="34" y1="24" x2="30" y2="40" stroke="#E8B93E" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function MenuBar() {
  const logoEgg = useMultiClick(3, () => {
    confetti(50);
    toast("Triple-click detected. You're QA now.");
  });

  return (
    <div className="sticky top-0 z-40 t-bg/85 backdrop-blur border-b t-line">
      <div className="max-w-[1200px] mx-auto px-5 h-12 flex items-center justify-between text-[13px] gap-2">
        <button onClick={logoEgg} className="flex items-center gap-2 font-bold tracking-tight t-ink">
          <img src="/lucy.png" alt="" aria-hidden width={24} height={24} className="w-6 h-6 rounded-[7px] object-cover" />
          thegreatLucy
        </button>
        <nav className="hidden sm:flex items-center gap-5 t-ink">
          <a href="#apps" className="hover:opacity-55 transition-opacity">Demos</a>
          <a href="#services" className="hover:opacity-55 transition-opacity">Services</a>
          <a href="#contact" className="hover:opacity-55 transition-opacity">Contact</a>
        </nav>
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
