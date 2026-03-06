"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

const products = [
    { id: "1", name: "Fortnite V-Bucks Bundle", slug: "fortnite-vbucks", category: "In-Game Currency", price: 29.99, type: "one-time" as const, description: "13,500 V-Bucks delivered to your account instantly." },
    { id: "2", name: "Valorant VP Package", slug: "valorant-vp", category: "In-Game Currency", price: 49.99, type: "one-time" as const, description: "8,700 Valorant Points with bonus items." },
    { id: "3", name: "CS2 Prime Status", slug: "cs2-prime", category: "Game Keys", price: 14.99, type: "one-time" as const, description: "CS2 Prime Status activation key." },
    { id: "4", name: "Roblox Premium Monthly", slug: "roblox-premium", category: "Subscriptions", price: 9.99, type: "subscription" as const, description: "Monthly Robux allowance + premium benefits." },
    { id: "5", name: "Pro Gaming Plan", slug: "pro-gaming", category: "Subscriptions", price: 24.99, type: "subscription" as const, description: "Access to premium products and exclusive deals." },
    { id: "6", name: "Valorant Boost to Diamond", slug: "val-boost-diamond", category: "Boosting Services", price: 89.99, type: "one-time" as const, description: "Professional boosting to Diamond rank." },
    { id: "7", name: "Fortnite Account - OG Skins", slug: "fortnite-og", category: "Game Accounts", price: 149.99, type: "one-time" as const, description: "Account with 200+ skins including OG exclusives." },
    { id: "8", name: "Elite Coaching Session", slug: "elite-coaching", category: "Coaching", price: 39.99, type: "one-time" as const, description: "1-hour coaching with a professional player." },
    { id: "9", name: "GTA V Money Package", slug: "gta-money", category: "In-Game Currency", price: 19.99, type: "one-time" as const, description: "$500M GTA Online cash delivered instantly." },
];

const categories = ["All", "In-Game Currency", "Game Keys", "Subscriptions", "Boosting Services", "Game Accounts", "Coaching"];

function ProductsContent() {
    const { t } = useLanguage();
    const [authOpen, setAuthOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [search, setSearch] = useState("");

    const filtered = products.filter((p) => {
        const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <main className="min-h-screen">
            <Navbar onLoginClick={() => setAuthOpen(true)} />

            <section className="pt-28 pb-8 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            <span className="gradient-text">{t("products.title")}</span>
                        </h1>
                        <p className="text-[var(--text-tertiary)] mt-2">
                            {t("products.subtitle")}
                        </p>
                    </motion.div>

                    <div className="mt-8 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t("products.search")}
                                className="input pl-10"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${selectedCategory === cat
                                        ? "bg-[var(--accent)] text-white"
                                        : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-hover)]"
                                    }`}
                            >
                                {cat === "All" ? t("products.all") : cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-24">
                <div className="max-w-6xl mx-auto">
                    <p className="text-sm text-[var(--text-tertiary)] mb-6">
                        {filtered.length} {t("products.found")}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.3 }}
                                className="card group cursor-pointer overflow-hidden"
                            >
                                <div className="h-40 bg-[var(--bg-subtle)] border-b border-[var(--border)] flex items-center justify-center">
                                    <span className="text-4xl opacity-30">🎮</span>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="text-[15px] font-semibold text-white tracking-tight leading-snug">
                                            {product.name}
                                        </h3>
                                        {product.type === "subscription" && (
                                            <span className="badge badge-accent text-[11px] shrink-0">Sub</span>
                                        )}
                                    </div>

                                    <span className="badge badge-neutral text-[11px] mb-3">
                                        {product.category}
                                    </span>

                                    <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-4 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xl font-bold text-white">
                                                €{product.price.toFixed(2)}
                                            </span>
                                            {product.type === "subscription" && (
                                                <span className="text-sm text-[var(--text-tertiary)]">/mo</span>
                                            )}
                                        </div>
                                        <button className="btn-primary py-2 px-5 text-[13px]">
                                            {product.type === "subscription" ? t("products.subscribe") : t("products.buyNow")}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </main>
    );
}

export default function ProductsPage() {
    return (
        <LanguageProvider>
            <ProductsContent />
        </LanguageProvider>
    );
}
