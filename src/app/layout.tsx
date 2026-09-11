import type { Metadata } from "next";
import { Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Theme";

const sans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono2",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "thegreatLucy — small software, shipped",
  description:
    "Lucy builds AI products and apps: Tenawar invitations, Bubble Trouble game, Chrome extensions, open-source lab.",
  metadataBase: new URL("https://thegreatlucy.com"),
  openGraph: {
    title: "thegreatLucy — small software, shipped",
    description:
      "AI products, playful apps, and open-source toys — with live demos. Bring the idea, get the shipped version.",
    url: "https://thegreatlucy.com",
    siteName: "thegreatLucy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "thegreatLucy — small software, shipped",
    description:
      "AI products, playful apps, and open-source toys — with live demos.",
  },
};

const themeInit = `(function(){try{var m=localStorage.getItem('lucy-theme')||'system';var d=m==='system'?window.matchMedia('(prefers-color-scheme: dark)').matches:m==='dark';if(d)document.documentElement.classList.add('dark')}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
