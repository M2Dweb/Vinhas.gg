"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { TranslationKey } from "@/lib/i18n";

const categories = [
    { nameKey: "cat.gameAccounts" as TranslationKey, descKey: "cat.gameAccounts.desc" as TranslationKey, slug: "game-accounts", icon: "🎮", count: 156 },
    { nameKey: "cat.inGameCurrency" as TranslationKey, descKey: "cat.inGameCurrency.desc" as TranslationKey, slug: "in-game-currency", icon: "💰", count: 89 },
    { nameKey: "cat.boosting" as TranslationKey, descKey: "cat.boosting.desc" as TranslationKey, slug: "boosting-services", icon: "⚡", count: 42 },
    { nameKey: "cat.gameKeys" as TranslationKey, descKey: "cat.gameKeys.desc" as TranslationKey, slug: "game-keys", icon: "🔑", count: 234 },
    { nameKey: "cat.subscriptions" as TranslationKey, descKey: "cat.subscriptions.desc" as TranslationKey, slug: "subscriptions", icon: "🔄", count: 18 },
    { nameKey: "cat.coaching" as TranslationKey, descKey: "cat.coaching.desc" as TranslationKey, slug: "coaching", icon: "🎯", count: 35 },
];

export default function CategoriesSection() {
    const { t } = useLanguage();

    return (
        <section className="py-24 md:py-32 px-6 border-t border-[var(--border)]">
            <div className="max-w-6xl mx-auto">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.slug}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06, duration: 0.4 }}
                        >
                            <Link href={`/products?category=${cat.slug}`}>
                                <div className="card group cursor-pointer p-6 flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-xl shrink-0">
                                        {cat.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[15px] font-semibold text-white tracking-tight">
                                                {t(cat.nameKey)}
                                            </h3>
                                            <svg className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-[var(--text-tertiary)] mt-1 leading-relaxed">
                                            {t(cat.descKey)}
                                        </p>
                                        <p className="text-xs text-[var(--text-tertiary)] mt-2">
                                            {cat.count} {t("categories.products")}
                                        </p>
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
