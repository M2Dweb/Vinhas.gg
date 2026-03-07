"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { createClient } from "@/lib/supabase";

function DashboardContent() {
    const { t } = useLanguage();
    const supabase = createClient();
    const [authOpen, setAuthOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [purchases, setPurchases] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalSpent: 0, activeSubs: 0, totalOrders: 0 });

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                setAuthOpen(true);
                return;
            }

            // Fetch orders and subscriptions
            const [
                { data: orders },
                { data: subs }
            ] = await Promise.all([
                supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
                supabase.from("subscriptions").select("*").eq("user_id", user.id),
            ]);

            const totalSpent = (orders || [])
                .filter((o) => o.status === "completed")
                .reduce((sum, o) => sum + Number(o.amount), 0);

            const activeSubs = (subs || []).filter((s) => s.status === "active").length;

            setStats({
                totalSpent,
                activeSubs,
                totalOrders: orders?.length || 0,
            });

            // Combine and format for display
            const allPurchases: any[] = [];

            // Get product names
            const productIds = [...new Set([
                ...(orders || []).map((o) => o.product_id),
                ...(subs || []).map((s) => s.product_id)
            ])];

            const { data: products } = await supabase.from("products").select("id, name, type").in("id", productIds);
            const productMap = Object.fromEntries((products || []).map((p) => [p.id, p]));

            if (subs) {
                subs.forEach((s) => {
                    const product = productMap[s.product_id];
                    allPurchases.push({
                        id: s.id,
                        product: product?.name || "—",
                        type: "subscription",
                        status: s.status,
                        amount: "Gerido no Stripe", // Recurring amount is handled by Stripe, hard to get exact amount from our DB without parsing features
                        nextBilling: new Date(s.current_period_end).toLocaleDateString("pt-PT"),
                        date: new Date(s.created_at).toLocaleDateString("pt-PT"),
                        timestamp: new Date(s.created_at).getTime()
                    });
                });
            }

            if (orders) {
                orders.forEach((o) => {
                    const product = productMap[o.product_id];
                    // Don't show the initial order of a subscription if we're already showing the subscription itself
                    // We'll keep it simple for now and just show all orders, but mark them as one-time
                    allPurchases.push({
                        id: o.id,
                        product: product?.name || "—",
                        type: product?.type || "one-time",
                        status: o.status,
                        amount: `€${Number(o.amount).toFixed(2)}`,
                        nextBilling: null,
                        date: new Date(o.created_at).toLocaleDateString("pt-PT"),
                        timestamp: new Date(o.created_at).getTime()
                    });
                });
            }

            // Sort by newest
            allPurchases.sort((a, b) => b.timestamp - a.timestamp);
            setPurchases(allPurchases);

            setLoading(false);
        };

        fetchDashboard();
    }, []);

    const handleCancelSub = async () => {
        // In a real app, this would call an API route to cancel the Stripe subscription
        alert("Para cancelar a subscrição, por favor entra em contacto via Discord: https://discord.gg/4uYH9CtjQt");
    };

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

                                {loading ? (
                                    <div className="p-12 text-center text-[var(--text-tertiary)] card-static">A carregar os teus dados...</div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                            <div className="card-static p-5">
                                                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-medium">{t("dashboard.totalSpent")}</p>
                                                <p className="text-xl font-bold text-white mt-1">€{stats.totalSpent.toFixed(2)}</p>
                                            </div>
                                            <div className="card-static p-5">
                                                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-medium">{t("dashboard.activeSubs")}</p>
                                                <p className="text-xl font-bold text-white mt-1">{stats.activeSubs}</p>
                                            </div>
                                            <div className="card-static p-5">
                                                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-medium">{t("dashboard.totalOrders")}</p>
                                                <p className="text-xl font-bold text-white mt-1">{stats.totalOrders}</p>
                                            </div>
                                        </div>

                                        <div className="card-static overflow-hidden">
                                            <div className="p-5 border-b border-[var(--border)]">
                                                <h3 className="text-[15px] font-semibold text-white">{t("dashboard.orderHistory")}</h3>
                                            </div>
                                            {purchases.length === 0 ? (
                                                <div className="p-12 text-center">
                                                    <p className="text-[var(--text-tertiary)] mb-4">Ainda não tens compras.</p>
                                                    <Link href="/products" className="btn-secondary py-2 px-5 text-sm inline-block">Mostrar Produtos</Link>
                                                </div>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full min-w-[500px]">
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
                                                            {purchases.map((p, i) => (
                                                                <tr key={`${p.id}-${i}`} className="table-row border-b border-[var(--border)] last:border-0">
                                                                    <td className="p-4">
                                                                        <p className="text-sm text-white font-medium">{p.product}</p>
                                                                        {p.nextBilling && (
                                                                            <p className="text-xs text-[var(--accent)] mt-0.5">
                                                                                Próximo: {p.nextBilling}
                                                                            </p>
                                                                        )}
                                                                    </td>
                                                                    <td className="p-4 text-sm text-white font-medium">{p.amount}</td>
                                                                    <td className="p-4">
                                                                        <span className={`badge text-[11px] ${p.status === "active" || p.status === "completed" ? "badge-success" :
                                                                            p.status === "pending" ? "badge-warning" : "badge-neutral"
                                                                            }`}>
                                                                            {p.status}
                                                                        </span>
                                                                    </td>
                                                                    <td className="p-4 text-sm text-[var(--text-tertiary)] hidden md:table-cell">{p.date}</td>
                                                                    <td className="p-4 text-right flex flex-col items-end gap-2">
                                                                        <Link href={`/dashboard/orders/${p.id}`} className="text-xs font-bold text-white bg-[var(--surface-hover)] border border-[var(--border)] px-3 py-1.5 rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                                                                            Detalhes
                                                                        </Link>
                                                                        {p.type === "subscription" && p.status === "active" && (
                                                                            <button onClick={handleCancelSub} className="text-[10px] text-[var(--text-tertiary)] hover:text-red-400 transition-colors mt-1">
                                                                                {t("dashboard.cancel")}
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
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
