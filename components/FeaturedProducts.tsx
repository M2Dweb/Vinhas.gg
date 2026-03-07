"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import { useCart } from "@/components/CartProvider";
import { createClient } from "@/lib/supabase";
import type { Product } from "@/lib/types";

export default function FeaturedProductsSection() {
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const supabase = createClient();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeatured() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("products")
                    .select("*")
                    .eq("active", true)
                    .order("created_at", { ascending: false })
                    .limit(4);

                if (error) throw error;
                setProducts(data || []);
            } catch (err) {
                console.error("Error fetching featured products:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchFeatured();
    }, [supabase]);

    if (loading && products.length === 0) return null;

    return (
        <section id="featured" className="py-24 md:py-32 px-6 border-t border-[var(--border)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)] opacity-[0.02] blur-[100px] pointer-events-none rounded-full" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="max-w-2xl"
                    >
                        <h2 className="section-heading text-left">
                            {t("featured.title")} <span className="gradient-text">{t("featured.titleAccent")}</span>
                        </h2>
                        <p className="section-subheading text-left mt-4">
                            {t("featured.subtitle")}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href="/products" className="btn-secondary py-2.5 px-6 rounded-xl flex items-center gap-2 group">
                            {t("featured.viewAll")}
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <Link href={`/products?id=${product.id}`}>
                                <div className="card h-full group">
                                    <div className="relative aspect-[4/3] rounded-t-[18px] overflow-hidden bg-[var(--bg-subtle)] border-b border-[var(--border)]">
                                        {product.image_url ? (
                                            <Image
                                                src={product.image_url}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[var(--accent)] opacity-20">
                                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className="badge badge-accent bg-black/40 backdrop-blur-md px-2.5 py-1">
                                                €{Number(product.price).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-[15px] font-bold text-white mb-2 group-hover:text-[var(--accent-hover)] transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-[var(--text-tertiary)] line-clamp-2 leading-relaxed mb-5 flex-1">
                                            {product.description}
                                        </p>

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addToCart(product);
                                            }}
                                            className="btn-primary w-full py-2.5 rounded-xl text-xs font-bold group-hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all"
                                        >
                                            Adicionar ao Carrinho
                                        </button>
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
