"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import type { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
    const supabase = createClient();
    const [categories, setCategories] = useState<(Category & { productCount: number })[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: "", slug: "", description: "" });

    const fetchCategories = async () => {
        setLoading(true);
        const { data: cats } = await supabase
            .from("categories")
            .select("*")
            .order("order", { ascending: true });

        if (cats) {
            // Get product counts
            const withCounts = await Promise.all(
                cats.map(async (cat) => {
                    const { data: prods } = await supabase
                        .from("products")
                        .select("id")
                        .eq("category_id", cat.id);
                    return { ...cat, productCount: prods?.length || 0 };
                })
            );
            setCategories(withCounts);
        }
        setLoading(false);
    };

    useEffect(() => { fetchCategories(); }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({ name: "", slug: "", description: "" });
        setModalOpen(true);
    };

    const openEdit = (cat: Category) => {
        setEditing(cat);
        setForm({ name: cat.name, slug: cat.slug, description: cat.description || "" });
        setModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        if (editing) {
            await supabase.from("categories").update({
                name: form.name,
                slug: form.slug,
                description: form.description,
            }).eq("id", editing.id);
        } else {
            await supabase.from("categories").insert({
                name: form.name,
                slug: form.slug,
                description: form.description,
                order: categories.length,
            });
        }
        setSaving(false);
        setModalOpen(false);
        fetchCategories();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Tens a certeza que queres eliminar esta categoria?")) {
            await supabase.from("categories").delete().eq("id", id);
            fetchCategories();
        }
    };

    const autoSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Categorias</h1>
                    <p className="text-sm text-[var(--text-tertiary)] mt-1">{categories.length} categorias</p>
                </div>
                <button onClick={openCreate} className="btn-primary text-sm py-2.5 px-5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Nova Categoria
                </button>
            </div>

            <div className="card-static overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-[var(--text-tertiary)]">A carregar...</div>
                ) : categories.length === 0 ? (
                    <div className="p-12 text-center text-[var(--text-tertiary)]">Nenhuma categoria ainda. Cria a primeira!</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border)]">
                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Nome</th>
                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Slug</th>
                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4 hidden md:table-cell">Descrição</th>
                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Produtos</th>
                                <th className="text-right text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr key={cat.id} className="table-row border-b border-[var(--border)] last:border-0">
                                    <td className="p-4 text-sm text-white font-medium">{cat.name}</td>
                                    <td className="p-4 text-sm text-[var(--text-tertiary)] font-mono">{cat.slug}</td>
                                    <td className="p-4 text-sm text-[var(--text-tertiary)] hidden md:table-cell">{cat.description}</td>
                                    <td className="p-4">
                                        <span className="badge badge-neutral text-[11px]">{cat.productCount}</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openEdit(cat)} className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-white hover:bg-[var(--surface)] transition-all">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </button>
                                            <button onClick={() => handleDelete(cat.id)} className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--danger)] hover:bg-[rgba(239,68,68,0.06)] transition-all">
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
                )}
            </div>

            <AnimatePresence>
                {modalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay" onClick={() => setModalOpen(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }} transition={{ duration: 0.2 }} className="card-static w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-lg font-bold text-white mb-5">
                                {editing ? "Editar Categoria" : "Nova Categoria"}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="label">Nome</label>
                                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : autoSlug(e.target.value) })} placeholder="ex: Spotify Premium" className="input" />
                                </div>
                                <div>
                                    <label className="label">Slug</label>
                                    <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="ex: spotify-premium" className="input font-mono text-sm" />
                                </div>
                                <div>
                                    <label className="label">Descrição</label>
                                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Breve descrição desta categoria" className="textarea" />
                                </div>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <button onClick={handleSave} disabled={saving || !form.name} className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50">
                                    {saving ? "A guardar..." : editing ? "Guardar" : "Criar Categoria"}
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
