"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { createClient } from "@/lib/supabase";
import type { Product, Category } from "@/lib/types";

function ProductsContent() {
    const { t } = useLanguage();
    const supabase = createClient();
    const [authOpen, setAuthOpen] = useState(false);
    const [products, setProducts] = useState<(Product & { category_name: string; category_slug: string })[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [{ data: prods }, { data: cats }] = await Promise.all([
                supabase.from("products").select("*").eq("active", true).order("created_at", { ascending: false }),
                supabase.from("categories").select("*").order("order", { ascending: true }),
            ]);

            if (cats) setCategories(cats);
            if (prods && cats) {
                const catMap = Object.fromEntries(cats.map((c) => [c.id, { name: c.name, slug: c.slug }]));
                setProducts(prods.map((p) => ({
                    ...p,
                    category_name: catMap[p.category_id]?.name || "—",
                    category_slug: catMap[p.category_id]?.slug || "",
                })));
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const filtered = products.filter((p) => {
        const matchCat = selectedCategory === "all" || p.category_slug === selectedCategory;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const handleCheckout = async (product: Product) => {
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    priceId: product.stripe_price_id,
                    productName: product.name,
                    amount: product.price,
                    type: product.type,
                }),
            });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } catch (err) {
            console.error("Checkout error:", err);
        }
    };

    return (
        <main className="min-h-screen">
            <Navbar onLoginClick={() => setAuthOpen(true)} />

            <section className="pt-28 pb-8 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            <span className="gradient-text">{t("products.title")}</span>
                        </h1>
                        <p className="text-[var(--text-tertiary)] mt-2">{t("products.subtitle")}</p>
                    </motion.div>

                    <div className="mt-8">
                        <div className="relative max-w-md">
                            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("products.search")} className="input pl-10" />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${selectedCategory === "all"
                                    ? "bg-[var(--accent)] text-white"
                                    : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-hover)]"
                                }`}
                        >
                            {t("products.all")}
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.slug)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${selectedCategory === cat.slug
                                        ? "bg-[var(--accent)] text-white"
                                        : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-hover)]"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-24">
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="py-20 text-center text-[var(--text-tertiary)]">A carregar produtos...</div>
                    ) : (
                        <>
                            <p className="text-sm text-[var(--text-tertiary)] mb-6">
                                {filtered.length} {t("products.found")}
                            </p>

                            {filtered.length === 0 ? (
                                <div className="py-20 text-center text-[var(--text-tertiary)]">Nenhum produto encontrado.</div>
                            ) : (
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
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-4xl opacity-30">🎮</span>
                                                )}
                                            </div>

                                            <div className="p-5">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h3 className="text-[15px] font-semibold text-white tracking-tight leading-snug">{product.name}</h3>
                                                    {product.type === "subscription" && (
                                                        <span className="badge badge-accent text-[11px] shrink-0">Sub</span>
                                                    )}
                                                </div>

                                                <span className="badge badge-neutral text-[11px] mb-3">{product.category_name}</span>

                                                {product.description && (
                                                    <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-4 line-clamp-2">{product.description}</p>
                                                )}

                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-xl font-bold text-white">€{Number(product.price).toFixed(2)}</span>
                                                        {product.type === "subscription" && product.interval && (
                                                            <span className="text-sm text-[var(--text-tertiary)]">/{product.interval === "monthly" ? "mês" : "ano"}</span>
                                                        )}
                                                    </div>
                                                    <button onClick={() => handleCheckout(product)} className="btn-primary py-2 px-5 text-[13px]">
                                                        {product.type === "subscription" ? t("products.subscribe") : t("products.buyNow")}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
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
