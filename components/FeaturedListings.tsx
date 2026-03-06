"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { TranslationKey } from "@/lib/i18n";

const plans = [
    {
        nameKey: "plan.starter" as TranslationKey,
        descKey: "plan.starter.desc" as TranslationKey,
        price: "9.99",
        features: [
            "feat.basicProducts" as TranslationKey,
            "feat.discord" as TranslationKey,
            "feat.emailSupport" as TranslationKey,
            "feat.1sub" as TranslationKey,
        ],
        popular: false,
    },
    {
        nameKey: "plan.pro" as TranslationKey,
        descKey: "plan.pro.desc" as TranslationKey,
        price: "24.99",
        features: [
            "feat.everythingStarter" as TranslationKey,
            "feat.premiumAccess" as TranslationKey,
            "feat.prioritySupport" as TranslationKey,
            "feat.5subs" as TranslationKey,
            "feat.exclusiveDeals" as TranslationKey,
            "feat.earlyAccess" as TranslationKey,
        ],
        popular: true,
    },
    {
        nameKey: "plan.elite" as TranslationKey,
        descKey: "plan.elite.desc" as TranslationKey,
        price: "49.99",
        features: [
            "feat.everythingPro" as TranslationKey,
            "feat.unlimitedSubs" as TranslationKey,
            "feat.coaching" as TranslationKey,
            "feat.customRequests" as TranslationKey,
            "feat.accountManager" as TranslationKey,
            "feat.warranty" as TranslationKey,
        ],
        popular: false,
    },
];

export default function PricingSection() {
    const { t } = useLanguage();

    return (
        <section id="pricing" className="py-24 md:py-32 px-6 border-t border-[var(--border)]">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <h2 className="section-heading">
                        {t("pricing.title")} <span className="gradient-text">{t("pricing.titleAccent")}</span>
                    </h2>
                    <p className="section-subheading mx-auto mt-4">
                        {t("pricing.subtitle")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className={`card-static p-7 flex flex-col relative ${plan.popular ? "border-[var(--accent)] border-opacity-30 ring-1 ring-[var(--accent-border)]" : ""
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="badge badge-accent text-[11px] px-3 py-1">
                                        {t("pricing.mostPopular")}
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-white tracking-tight">
                                    {t(plan.nameKey)}
                                </h3>
                                <p className="text-sm text-[var(--text-tertiary)] mt-1">
                                    {t(plan.descKey)}
                                </p>
                            </div>

                            <div className="mb-6">
                                <span className="text-4xl font-extrabold text-white tracking-tight">
                                    €{plan.price}
                                </span>
                                <span className="text-sm text-[var(--text-tertiary)] ml-1">
                                    /{t("pricing.month")}
                                </span>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((featureKey) => (
                                    <li key={featureKey} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                                        <svg className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        {t(featureKey)}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${plan.popular
                                        ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] hover:shadow-lg hover:shadow-[var(--accent)]/20"
                                        : "bg-transparent border border-[var(--border)] text-white hover:bg-[var(--surface)] hover:border-[var(--border-hover)]"
                                    }`}
                            >
                                {t("nav.getStarted")}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
