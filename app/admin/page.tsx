"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export default function AdminDashboardPage() {
    const supabase = createClient();
    const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, activeSubs: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);

            const [
                { data: orders },
                { count: userCount },
                { count: subCount },
            ] = await Promise.all([
                supabase.from("orders").select("*").eq("status", "completed"),
                supabase.from("profiles").select("*", { count: "exact", head: true }),
                supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
            ]);

            const revenue = orders?.reduce((sum, o) => sum + Number(o.amount), 0) || 0;

            setStats({
                revenue,
                orders: orders?.length || 0,
                users: userCount || 0,
                activeSubs: subCount || 0,
            });

            // Recent orders with product names
            const { data: recent } = await supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(5);

            if (recent) {
                const productIds = [...new Set(recent.map((o) => o.product_id))];
                const { data: products } = await supabase.from("products").select("id, name").in("id", productIds);
                const productMap = Object.fromEntries((products || []).map((p) => [p.id, p.name]));
                setRecentOrders(recent.map((o) => ({ ...o, product_name: productMap[o.product_id] || "—" })));
            }

            setLoading(false);
        };

        fetchDashboard();
    }, []);

    const statCards = [
        { label: "Receita Total", value: `€${stats.revenue.toFixed(2)}`, color: "var(--success)" },
        { label: "Encomendas", value: String(stats.orders), color: "var(--accent)" },
        { label: "Subs Ativas", value: String(stats.activeSubs), color: "var(--warning)" },
        { label: "Utilizadores", value: String(stats.users), color: "var(--text)" },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
                <p className="text-sm text-[var(--text-tertiary)] mt-1">Visão geral da plataforma</p>
            </div>

            {loading ? (
                <div className="p-12 text-center text-[var(--text-tertiary)]">A carregar...</div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {statCards.map((s) => (
                            <div key={s.label} className="card-static p-5">
                                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-medium">{s.label}</p>
                                <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="card-static overflow-hidden">
                        <div className="p-5 border-b border-[var(--border)]">
                            <h3 className="text-[15px] font-semibold text-white">Encomendas Recentes</h3>
                        </div>
                        {recentOrders.length === 0 ? (
                            <div className="p-8 text-center text-[var(--text-tertiary)]">Sem encomendas ainda.</div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[var(--border)]">
                                        <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Produto</th>
                                        <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Valor</th>
                                        <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Estado</th>
                                        <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((o) => (
                                        <tr key={o.id} className="table-row border-b border-[var(--border)] last:border-0">
                                            <td className="p-4 text-sm text-white font-medium">{o.product_name}</td>
                                            <td className="p-4 text-sm text-white">€{Number(o.amount).toFixed(2)}</td>
                                            <td className="p-4">
                                                <span className={`badge text-[11px] ${o.status === "completed" ? "badge-success" :
                                                        o.status === "pending" ? "badge-warning" : "badge-danger"
                                                    }`}>{o.status}</span>
                                            </td>
                                            <td className="p-4 text-sm text-[var(--text-tertiary)]">
                                                {new Date(o.created_at).toLocaleDateString("pt-PT")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
