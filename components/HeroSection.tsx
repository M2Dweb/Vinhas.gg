"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function HeroSection() {
    const { t } = useLanguage();

    return (
        <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden">
            <div className="hero-glow absolute inset-0 pointer-events-none" />

            <div className="relative max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="badge badge-accent text-[13px]">
                        {t("hero.badge")}
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mt-7 text-[3rem] md:text-[4.5rem] font-extrabold tracking-[-0.04em] leading-[1.05]"
                >
                    {t("hero.title1")}
                    <br />
                    <span className="gradient-text">{t("hero.title2")}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-6 text-lg md:text-xl text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed tracking-tight"
                >
                    {t("hero.subtitle")}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                    <Link href="/products">
                        <button className="btn-primary px-8 py-3 text-[15px]">
                            {t("hero.browse")}
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </Link>
                    <Link href="#pricing">
                        <button className="btn-secondary px-8 py-3 text-[15px]">
                            {t("hero.viewPricing")}
                        </button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-20 flex items-center justify-center gap-12 md:gap-20"
                >
                    {[
                        { value: "50K+", label: t("hero.activeUsers") },
                        { value: "99.9%", label: t("hero.uptime") },
                        { value: "4.9★", label: t("hero.rating") },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                                {stat.value}
                            </p>
                            <p className="text-xs text-[var(--text-tertiary)] mt-1 uppercase tracking-wider font-medium">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
