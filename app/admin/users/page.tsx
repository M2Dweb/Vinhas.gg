"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

export default function AdminUsersPage() {
    const supabase = createClient();
    const [users, setUsers] = useState<(Profile & { order_count: number; total_spent: number })[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        const { data: profiles } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (profiles) {
            const enriched = await Promise.all(
                profiles.map(async (p) => {
                    const { data: orders } = await supabase
                        .from("orders")
                        .select("amount")
                        .eq("user_id", p.id)
                        .eq("status", "completed");

                    return {
                        ...p,
                        order_count: orders?.length || 0,
                        total_spent: orders?.reduce((sum, o) => sum + Number(o.amount), 0) || 0,
                    };
                })
            );
            setUsers(enriched);
        }
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, []);

    const toggleRole = async (id: string, currentRole: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        if (confirm(`Mudar role para ${newRole}?`)) {
            await supabase.from("profiles").update({ role: newRole }).eq("id", id);
            fetchUsers();
        }
    };

    const filtered = users.filter(
        (u) => (u.display_name || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Utilizadores</h1>
                    <p className="text-sm text-[var(--text-tertiary)] mt-1">{users.length} utilizadores</p>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative max-w-sm">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Procurar utilizadores..."
                        className="input pl-10"
                    />
                </div>
            </div>

            <div className="card-static overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-[var(--text-tertiary)]">A carregar...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center text-[var(--text-tertiary)]">Nenhum utilizador encontrado.</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border)]">
                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Utilizador</th>
                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Role</th>
                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Encomendas</th>
                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Total Gasto</th>
                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4 hidden md:table-cell">Registado</th>
                                <th className="text-right text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => (
                                <tr key={u.id} className="table-row border-b border-[var(--border)] last:border-0">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-xs font-bold text-[var(--accent)]">
                                                {(u.display_name || "?")[0].toUpperCase()}
                                            </div>
                                            <p className="text-sm text-white font-medium">{u.display_name || "—"}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`badge text-[11px] ${u.role === "admin" ? "badge-accent" : "badge-neutral"}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-white">{u.order_count}</td>
                                    <td className="p-4 text-sm text-white font-medium">€{u.total_spent.toFixed(2)}</td>
                                    <td className="p-4 text-sm text-[var(--text-tertiary)] hidden md:table-cell">
                                        {new Date(u.created_at).toLocaleDateString("pt-PT")}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => toggleRole(u.id, u.role)}
                                            className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors"
                                        >
                                            {u.role === "admin" ? "→ User" : "→ Admin"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
