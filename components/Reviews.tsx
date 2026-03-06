"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { TranslationKey } from "@/lib/i18n";

const faqs: { qKey: TranslationKey; aKey: TranslationKey }[] = [
    { qKey: "faq.q1", aKey: "faq.a1" },
    { qKey: "faq.q2", aKey: "faq.a2" },
    { qKey: "faq.q3", aKey: "faq.a3" },
    { qKey: "faq.q4", aKey: "faq.a4" },
    { qKey: "faq.q5", aKey: "faq.a5" },
    { qKey: "faq.q6", aKey: "faq.a6" },
];

function FAQItem({ qKey, aKey, index }: { qKey: TranslationKey; aKey: TranslationKey; index: number }) {
    const [open, setOpen] = useState(false);
    const { t } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="border-b border-[var(--border)]"
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-5 text-left group"
            >
                <span className="text-[15px] font-medium text-white group-hover:text-[var(--accent-hover)] transition-colors pr-4">
                    {t(qKey)}
                </span>
                <motion.div
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-6 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0"
                >
                    <svg className="w-3.5 h-3.5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </motion.div>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 text-sm text-[var(--text-tertiary)] leading-relaxed pr-12">
                            {t(aKey)}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function FAQSection() {
    const { t } = useLanguage();

    return (
        <section id="faq" className="py-24 md:py-32 px-6 border-t border-[var(--border)]">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <h2 className="section-heading">
                        {t("faq.title")} <span className="gradient-text">{t("faq.titleAccent")}</span>
                    </h2>
                    <p className="section-subheading mx-auto mt-4">
                        {t("faq.subtitle")}
                    </p>
                </motion.div>

                <div>
                    {faqs.map((faq, i) => (
                        <FAQItem key={faq.qKey} qKey={faq.qKey} aKey={faq.aKey} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
