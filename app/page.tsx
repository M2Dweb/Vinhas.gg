"use client";

import { useState } from "react";
import { LanguageProvider } from "@/components/LanguageProvider";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/PopularGames";
import PricingSection from "@/components/FeaturedListings";
import FeaturesSection from "@/components/WhyVinhas";
import FAQSection from "@/components/Reviews";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <LanguageProvider>
      <main className="min-h-screen">
        <Navbar onLoginClick={() => setAuthOpen(true)} />
        <HeroSection />
        <CategoriesSection />
        <PricingSection />
        <FeaturesSection />
        <FAQSection />
        <Footer />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </main>
    </LanguageProvider>
  );
}
