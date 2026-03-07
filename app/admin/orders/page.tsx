"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import type { Order } from "@/lib/types";
import Link from "next/link";

export default function AdminOrdersPage() {
    const supabase = createClient();
    const [orders, setOrders] = useState<(Order & { product_name?: string; user_name?: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const fetchOrders = async () => {
        setLoading(true);
        let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
        if (filter !== "all") query = query.eq("status", filter);
        const { data } = await query;

        if (data) {
            // Enrich with product and user names
            const productIds = [...new Set(data.map((o) => o.product_id))];
            const userIds = [...new Set(data.map((o) => o.user_id))];

            const [{ data: products }, { data: profiles }] = await Promise.all([
                supabase.from("products").select("id, name").in("id", productIds),
                supabase.from("profiles").select("id, display_name").in("id", userIds),
            ]);

            const productMap = Object.fromEntries((products || []).map((p) => [p.id, p.name]));
            const userMap = Object.fromEntries((profiles || []).map((p) => [p.id, p.display_name || "—"]));

            setOrders(data.map((o) => ({
                ...o,
                product_name: productMap[o.product_id] || "—",
                user_name: userMap[o.user_id] || "—",
            })));
        }
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, [filter]);

    const updateStatus = async (id: string, status: string) => {
        await supabase.from("orders").update({ status }).eq("id", id);
        fetchOrders();
    };

    const filters = ["all", "pending", "completed", "failed", "refunded"];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Encomendas</h1>
                    <p className="text-sm text-[var(--text-tertiary)] mt-1">{orders.length} encomendas</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f
                            ? "bg-[var(--accent)] text-white"
                            : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-hover)]"
                            }`}
                    >
                        {f === "all" ? "Todas" : f === "pending" ? "Pendente" : f === "completed" ? "Completa" : f === "failed" ? "Falhada" : "Reembolsada"}
                    </button>
                ))}
            </div>

            <div className="card-static overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-[var(--text-tertiary)]">A carregar...</div>
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center text-[var(--text-tertiary)]">Nenhuma encomenda encontrada.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="border-b border-[var(--border)]">
                                    <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Produto</th>
                                    <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Utilizador</th>
                                    <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Valor</th>
                                    <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Estado</th>
                                    <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Data</th>
                                    <th className="text-right text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o.id} className="table-row border-b border-[var(--border)] last:border-0">
                                        <td className="p-4 text-sm text-white font-medium">{o.product_name}</td>
                                        <td className="p-4 text-sm text-[var(--text-secondary)]">{o.user_name}</td>
                                        <td className="p-4 text-sm text-white font-medium">€{Number(o.amount).toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`badge text-[11px] ${o.status === "completed" ? "badge-success" :
                                                o.status === "pending" ? "badge-warning" :
                                                    o.status === "refunded" ? "badge-accent" : "badge-danger"
                                                }`}>{o.status}</span>
                                        </td>
                                        <td className="p-4 text-sm text-[var(--text-tertiary)]">
                                            {new Date(o.created_at).toLocaleDateString("pt-PT")}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <select
                                                    value={o.status}
                                                    onChange={(e) => updateStatus(o.id, e.target.value)}
                                                    className="select text-xs py-1 px-2 w-auto"
                                                >
                                                    <option value="pending">Pendente</option>
                                                    <option value="completed">Completa</option>
                                                    <option value="failed">Falhada</option>
                                                    <option value="refunded">Reembolsada</option>
                                                </select>
                                                <Link href={`/admin/orders/${o.id}`} className="p-1.5 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent)] transition-all">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
