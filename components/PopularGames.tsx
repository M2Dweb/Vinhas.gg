"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { createClient } from "@/lib/supabase";

interface CategoryWithCount {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    product_count: number;
}

export default function CategoriesSection() {
    const { t } = useLanguage();
    const supabase = createClient();
    const [categories, setCategories] = useState<CategoryWithCount[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            setLoading(true);
            try {
                // Fetch all categories
                const { data: cats, error: catsError } = await supabase
                    .from("categories")
                    .select("*")
                    .order("order", { ascending: true });

                if (catsError) throw catsError;

                // Filter out unwanted categories
                const filteredCats = (cats || []).filter(cat =>
                    cat.slug !== "coaching" && cat.slug !== "boosting-services"
                );

                // Fetch product counts for these categories
                const withCounts = await Promise.all(
                    filteredCats.map(async (cat) => {
                        const { count } = await supabase
                            .from("products")
                            .select("*", { count: 'exact', head: true })
                            .eq("category_id", cat.id)
                            .eq("active", true);

                        return {
                            ...cat,
                            product_count: count || 0
                        };
                    })
                );

                setCategories(withCounts as CategoryWithCount[]);
            } catch (err) {
                console.error("Error fetching categories:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, [supabase]);

    if (loading && categories.length === 0) {
        return (
            <section className="py-24 md:py-32 px-6 border-t border-[var(--border)]">
                <div className="max-w-6xl mx-auto flex justify-center">
                    <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 md:py-32 px-6 border-t border-[var(--border)] relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)] opacity-[0.03] blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <h2 className="section-heading">
                        {t("categories.title")} <span className="gradient-text">{t("categories.titleAccent")}</span>
                    </h2>
                    <p className="section-subheading mx-auto mt-4">
                        {t("categories.subtitle")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06, duration: 0.4 }}
                        >
                            <Link href={`/products?category=${cat.slug}`}>
                                <div className="card group cursor-pointer p-6 h-full flex flex-col items-center text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20">
                                        {cat.icon || "📦"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-white tracking-tight mb-2 group-hover:text-[var(--accent-hover)] transition-colors">
                                            {cat.name}
                                        </h3>
                                        <p className="text-sm text-[var(--text-tertiary)] leading-relaxed line-clamp-2 mb-4">
                                            {cat.description || t("categories.defaultDesc")}
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-[var(--border)] w-full flex items-center justify-between">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                                            {cat.product_count} {t("categories.products")}
                                        </span>
                                        <div className="w-7 h-7 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] transition-all">
                                            <svg className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
