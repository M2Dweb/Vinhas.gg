"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    order: number;
    productCount: number;
}

// Placeholder data — will be from Supabase
const initialCategories: Category[] = [
    { id: "1", name: "Game Accounts", slug: "game-accounts", description: "Premium accounts with rare items", order: 0, productCount: 15 },
    { id: "2", name: "In-Game Currency", slug: "in-game-currency", description: "V-Bucks, Robux, credits", order: 1, productCount: 8 },
    { id: "3", name: "Boosting Services", slug: "boosting-services", description: "Rank up quickly", order: 2, productCount: 4 },
    { id: "4", name: "Game Keys", slug: "game-keys", description: "Activation codes", order: 3, productCount: 23 },
    { id: "5", name: "Subscriptions", slug: "subscriptions", description: "Monthly gaming services", order: 4, productCount: 3 },
    { id: "6", name: "Coaching", slug: "coaching", description: "1-on-1 coaching sessions", order: 5, productCount: 2 },
];

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState(initialCategories);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [form, setForm] = useState({ name: "", slug: "", description: "" });

    const openCreate = () => {
        setEditing(null);
        setForm({ name: "", slug: "", description: "" });
        setModalOpen(true);
    };

    const openEdit = (cat: Category) => {
        setEditing(cat);
        setForm({ name: cat.name, slug: cat.slug, description: cat.description });
        setModalOpen(true);
    };

    const handleSave = () => {
        if (editing) {
            setCategories(categories.map((c) =>
                c.id === editing.id ? { ...c, ...form } : c
            ));
        } else {
            setCategories([
                ...categories,
                {
                    id: String(Date.now()),
                    ...form,
                    order: categories.length,
                    productCount: 0,
                },
            ]);
        }
        setModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this category?")) {
            setCategories(categories.filter((c) => c.id !== id));
        }
    };

    const autoSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Categories</h1>
                    <p className="text-sm text-[var(--text-tertiary)] mt-1">{categories.length} categories</p>
                </div>
                <button onClick={openCreate} className="btn-primary text-sm py-2.5 px-5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Category
                </button>
            </div>

            {/* Table */}
            <div className="card-static overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--border)]">
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Name</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Slug</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4 hidden md:table-cell">Description</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Products</th>
                            <th className="text-right text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Actions</th>
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
                                        <button
                                            onClick={() => openEdit(cat)}
                                            className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-white hover:bg-[var(--surface)] transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--danger)] hover:bg-[rgba(239,68,68,0.06)] transition-all"
                                        >
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

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay"
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className="card-static w-full max-w-md p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-lg font-bold text-white mb-5">
                                {editing ? "Edit Category" : "New Category"}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="label">Name</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => {
                                            setForm({
                                                ...form,
                                                name: e.target.value,
                                                slug: editing ? form.slug : autoSlug(e.target.value),
                                            });
                                        }}
                                        placeholder="e.g. Game Accounts"
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="label">Slug</label>
                                    <input
                                        type="text"
                                        value={form.slug}
                                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                        placeholder="e.g. game-accounts"
                                        className="input font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="label">Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="Brief description of this category"
                                        className="textarea"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6">
                                <button onClick={handleSave} className="btn-primary flex-1 py-2.5 text-sm">
                                    {editing ? "Save Changes" : "Create Category"}
                                </button>
                                <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1 py-2.5 text-sm">
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
