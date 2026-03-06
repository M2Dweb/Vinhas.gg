"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

const purchases = [
    { id: "1", product: "Pro Gaming Plan", type: "subscription", status: "active", amount: "€24.99/mo", nextBilling: "Apr 6, 2026", date: "Mar 6, 2026" },
    { id: "2", product: "Fortnite V-Bucks Bundle", type: "one-time", status: "delivered", amount: "€29.99", nextBilling: null, date: "Mar 4, 2026" },
    { id: "3", product: "CS2 Prime Status", type: "one-time", status: "delivered", amount: "€14.99", nextBilling: null, date: "Feb 28, 2026" },
];

function DashboardContent() {
    const { t } = useLanguage();
    const [authOpen, setAuthOpen] = useState(false);

    const sidebarLinks = [
        { name: t("dashboard.purchases"), href: "/dashboard", active: true },
        { name: t("dashboard.settings"), href: "/dashboard/settings", active: false },
    ];

    return (
        <main className="min-h-screen">
            <Navbar onLoginClick={() => setAuthOpen(true)} />

            <div className="pt-24 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                        <aside className="w-full md:w-48 shrink-0">
                            <h2 className="text-lg font-bold text-white mb-4">{t("dashboard.myAccount")}</h2>
                            <nav className="space-y-1">
                                {sidebarLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${link.active
                                                ? "bg-[var(--accent-subtle)] text-[var(--accent-hover)] border border-[var(--accent-border)]"
                                                : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface)]"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </aside>

                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h1 className="text-2xl font-bold text-white tracking-tight mb-1">{t("dashboard.myPurchases")}</h1>
                                <p className="text-sm text-[var(--text-tertiary)] mb-6">{t("dashboard.myPurchasesDesc")}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                    <div className="card-static p-5">
                                        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-medium">{t("dashboard.totalSpent")}</p>
                                        <p className="text-xl font-bold text-white mt-1">€69.97</p>
                                    </div>
                                    <div className="card-static p-5">
                                        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-medium">{t("dashboard.activeSubs")}</p>
                                        <p className="text-xl font-bold text-white mt-1">1</p>
                                    </div>
                                    <div className="card-static p-5">
                                        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-medium">{t("dashboard.totalOrders")}</p>
                                        <p className="text-xl font-bold text-white mt-1">3</p>
                                    </div>
                                </div>

                                <div className="card-static overflow-hidden">
                                    <div className="p-5 border-b border-[var(--border)]">
                                        <h3 className="text-[15px] font-semibold text-white">{t("dashboard.orderHistory")}</h3>
                                    </div>
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-[var(--border)]">
                                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">{t("footer.product")}</th>
                                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Total</th>
                                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Status</th>
                                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4 hidden md:table-cell">Data</th>
                                                <th className="text-right text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {purchases.map((p) => (
                                                <tr key={p.id} className="table-row border-b border-[var(--border)] last:border-0">
                                                    <td className="p-4">
                                                        <p className="text-sm text-white font-medium">{p.product}</p>
                                                        {p.nextBilling && (
                                                            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                                                                Next: {p.nextBilling}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-sm text-white font-medium">{p.amount}</td>
                                                    <td className="p-4">
                                                        <span className={`badge text-[11px] ${p.status === "active" ? "badge-success" : "badge-neutral"}`}>
                                                            {p.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-sm text-[var(--text-tertiary)] hidden md:table-cell">{p.date}</td>
                                                    <td className="p-4 text-right">
                                                        {p.type === "subscription" && p.status === "active" && (
                                                            <button className="text-xs text-[var(--danger)] hover:text-red-300 font-medium transition-colors">
                                                                {t("dashboard.cancel")}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </main>
    );
}

export default function UserDashboard() {
    return (
        <LanguageProvider>
            <DashboardContent />
        </LanguageProvider>
    );
}
