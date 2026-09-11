"use client";

import { MenuBar } from "@/components/Invitation";
import Hero from "@/components/Hero";
import Blocks from "@/components/WorkIndex";
import { Services, Contact, Footer } from "@/components/Sections";
import Palette from "@/components/Palette";
import { ToastHost, ConfettiHost, useKonami } from "@/components/Eggs";

export default function Home() {
  useKonami();
  return (
    <div id="top" className="min-h-screen t-bg t-ink">
      <MenuBar />
      <main>
        <Hero />
        <Blocks />
        <Services />
        <Contact />
        <Footer />
      </main>
      <Palette />
      <ToastHost />
      <ConfettiHost />
    </div>
  );
}
