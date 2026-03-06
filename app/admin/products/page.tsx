"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import type { Product, Category } from "@/lib/types";

export default function AdminProductsPage() {
    const supabase = createClient();
    const [products, setProducts] = useState<(Product & { category_name?: string })[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: "", slug: "", description: "", price: "", category_id: "", type: "one-time" as "one-time" | "subscription", interval: "" as string, active: true,
    });

    const fetchData = async () => {
        setLoading(true);
        const [{ data: prods }, { data: cats }] = await Promise.all([
            supabase.from("products").select("*").order("created_at", { ascending: false }),
            supabase.from("categories").select("*").order("order", { ascending: true }),
        ]);

        if (cats) setCategories(cats);
        if (prods && cats) {
            const catMap = Object.fromEntries(cats.map((c) => [c.id, c.name]));
            setProducts(prods.map((p) => ({ ...p, category_name: catMap[p.category_id] || "—" })));
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({ name: "", slug: "", description: "", price: "", category_id: categories[0]?.id || "", type: "one-time", interval: "", active: true });
        setModalOpen(true);
    };

    const openEdit = (p: Product) => {
        setEditing(p);
        setForm({
            name: p.name, slug: p.slug, description: p.description || "", price: String(p.price),
            category_id: p.category_id, type: p.type, interval: p.interval || "", active: p.active,
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        const payload = {
            name: form.name,
            slug: form.slug,
            description: form.description,
            price: parseFloat(form.price) || 0,
            category_id: form.category_id,
            type: form.type,
            interval: form.type === "subscription" ? (form.interval || "monthly") : null,
            active: form.active,
        };

        if (editing) {
            await supabase.from("products").update(payload).eq("id", editing.id);
        } else {
            await supabase.from("products").insert(payload);
        }
        setSaving(false);
        setModalOpen(false);
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Tens a certeza que queres eliminar este produto?")) {
            await supabase.from("products").delete().eq("id", id);
            fetchData();
        }
    };

    const toggleActive = async (id: string, active: boolean) => {
        await supabase.from("products").update({ active: !active }).eq("id", id);
        fetchData();
    };

    const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Produtos</h1>
                    <p className="text-sm text-[var(--text-tertiary)] mt-1">{products.length} produtos</p>
                </div>
                <button onClick={openCreate} className="btn-primary text-sm py-2.5 px-5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Novo Produto
                </button>
            </div>

            <div className="card-static overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-[var(--text-tertiary)]">A carregar...</div>
                ) : products.length === 0 ? (
                    <div className="p-12 text-center text-[var(--text-tertiary)]">Nenhum produto ainda. Cria o primeiro!</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead>
                                <tr className="border-b border-[var(--border)]">
                                    <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Produto</th>
                                    <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Categoria</th>
                                    <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Tipo</th>
                                    <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Preço</th>
                                    <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Estado</th>
                                    <th className="text-right text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p.id} className="table-row border-b border-[var(--border)] last:border-0">
                                        <td className="p-4">
                                            <p className="text-sm text-white font-medium">{p.name}</p>
                                            <p className="text-xs text-[var(--text-tertiary)] font-mono mt-0.5">{p.slug}</p>
                                        </td>
                                        <td className="p-4"><span className="badge badge-neutral text-[11px]">{p.category_name}</span></td>
                                        <td className="p-4">
                                            <span className={`badge text-[11px] ${p.type === "subscription" ? "badge-accent" : "badge-neutral"}`}>
                                                {p.type === "subscription" ? `Sub / ${p.interval}` : "Único"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-white font-medium">€{Number(p.price).toFixed(2)}</td>
                                        <td className="p-4">
                                            <button onClick={() => toggleActive(p.id, p.active)} className={`badge text-[11px] cursor-pointer ${p.active ? "badge-success" : "badge-danger"}`}>
                                                {p.active ? "Ativo" : "Inativo"}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-white hover:bg-[var(--surface)] transition-all">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--danger)] hover:bg-[rgba(239,68,68,0.06)] transition-all">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {modalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay" onClick={() => setModalOpen(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }} transition={{ duration: 0.2 }} className="card-static w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-lg font-bold text-white mb-5">
                                {editing ? "Editar Produto" : "Novo Produto"}
                            </h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="label">Nome</label>
                                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : autoSlug(e.target.value) })} placeholder="ex: Spotify Premium 1 Mês" className="input" />
                                    </div>
                                    <div>
                                        <label className="label">Slug</label>
                                        <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input font-mono text-sm" />
                                    </div>
                                    <div>
                                        <label className="label">Categoria</label>
                                        <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="select">
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Tipo</label>
                                        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="select">
                                            <option value="one-time">Pagamento Único</option>
                                            <option value="subscription">Subscrição</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Preço (€)</label>
                                        <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" className="input" />
                                    </div>
                                    {form.type === "subscription" && (
                                        <div>
                                            <label className="label">Intervalo</label>
                                            <select value={form.interval} onChange={(e) => setForm({ ...form, interval: e.target.value })} className="select">
                                                <option value="monthly">Mensal</option>
                                                <option value="yearly">Anual</option>
                                            </select>
                                        </div>
                                    )}
                                    <div className="col-span-2">
                                        <label className="label">Descrição</label>
                                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descrição do produto" className="textarea" />
                                    </div>
                                    <div className="col-span-2 flex items-center gap-3">
                                        <label className="label mb-0">Ativo</label>
                                        <button onClick={() => setForm({ ...form, active: !form.active })} className={`w-10 h-6 rounded-full transition-colors relative ${form.active ? "bg-[var(--accent)]" : "bg-[var(--surface)]"}`}>
                                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.active ? "left-5" : "left-1"}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <button onClick={handleSave} disabled={saving || !form.name || !form.category_id} className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50">
                                    {saving ? "A guardar..." : editing ? "Guardar" : "Criar Produto"}
                                </button>
                                <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1 py-2.5 text-sm">Cancelar</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
