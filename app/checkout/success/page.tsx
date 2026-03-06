"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";

function SuccessContent() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card-static p-10 text-center max-w-md w-full"
            >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#22C55E]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
                    {t("checkout.success")}
                </h1>

                <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-8">
                    {t("checkout.successDesc")}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/dashboard" className="flex-1">
                        <button className="btn-primary w-full py-3 text-sm">
                            {t("checkout.goDashboard")}
                        </button>
                    </Link>
                    <Link href="/products" className="flex-1">
                        <button className="btn-secondary w-full py-3 text-sm">
                            {t("checkout.browseMore")}
                        </button>
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <LanguageProvider>
            <SuccessContent />
        </LanguageProvider>
    );
}
