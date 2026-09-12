"use client";

import { EMAIL } from "./Hero";

const X_PATH =
  "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z";
const GH_PATH =
  "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";

const DOTS: [string, string][] = [
  ["top", "Top"],
  ["apps", "Demos"],
  ["services", "Services"],
  ["contact", "Contact"],
];

const railBtn =
  "grid place-items-center w-9 h-9 rounded-full border t-line t-card t-dim hover:text-[#0a66ff] hover:border-[#0a66ff] transition-colors";

/* Fixed side rails — only on wide screens where the gutters exist. */
export default function Rails() {
  return (
    <>
      <div className="hidden min-[1400px]:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-2.5">
        <span className="w-px h-14 t-line" style={{ background: "var(--line)" }} aria-hidden />
        <a href="https://x.com/psychedelicflyn" target="_blank" rel="noreferrer" aria-label="Lucy on X" className={railBtn}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
            <path d={X_PATH} />
          </svg>
        </a>
        <a href="https://github.com/thegreatLucy" target="_blank" rel="noreferrer" aria-label="Lucy on GitHub" className={railBtn}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
            <path d={GH_PATH} />
          </svg>
        </a>
        <a href={`mailto:${EMAIL}`} aria-label="Email Lucy" className={railBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" aria-hidden>
            <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
            <path d="m3 7 9 6.5L21 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <span className="w-px h-14" style={{ background: "var(--line)" }} aria-hidden />
      </div>
      <nav aria-label="Sections" className="hidden min-[1400px]:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3">
        {DOTS.map(([href, label]) => (
          <a
            key={href}
            href={`#${href}`}
            title={label}
            aria-label={`Go to ${label}`}
            className="w-2 h-2 rounded-full t-dim opacity-40 hover:opacity-100 hover:scale-150 hover:bg-[#0a66ff] transition-all"
            style={{ background: "currentColor" }}
          />
        ))}
      </nav>
    </>
  );
}
