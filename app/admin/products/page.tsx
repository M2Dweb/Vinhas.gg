"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    type: "one-time" | "subscription";
    interval: "monthly" | "yearly" | null;
    active: boolean;
    description: string;
}

const initialProducts: Product[] = [
    { id: "1", name: "Fortnite V-Bucks Bundle", slug: "fortnite-vbucks", category: "In-Game Currency", price: 29.99, type: "one-time", interval: null, active: true, description: "13,500 V-Bucks" },
    { id: "2", name: "Pro Gaming Plan", slug: "pro-gaming", category: "Subscriptions", price: 24.99, type: "subscription", interval: "monthly", active: true, description: "Premium access" },
    { id: "3", name: "Valorant Boost to Diamond", slug: "val-boost", category: "Boosting Services", price: 89.99, type: "one-time", interval: null, active: true, description: "Diamond rank boost" },
    { id: "4", name: "CS2 Prime Status", slug: "cs2-prime", category: "Game Keys", price: 14.99, type: "one-time", interval: null, active: true, description: "Activation key" },
    { id: "5", name: "Roblox Premium Monthly", slug: "roblox-premium", category: "Subscriptions", price: 9.99, type: "subscription", interval: "monthly", active: false, description: "Monthly Robux" },
    { id: "6", name: "Elite Coaching Session", slug: "elite-coaching", category: "Coaching", price: 39.99, type: "one-time", interval: null, active: true, description: "1h pro coaching" },
];

const categoryOptions = ["Game Accounts", "In-Game Currency", "Boosting Services", "Game Keys", "Subscriptions", "Coaching"];

export default function AdminProductsPage() {
    const [products, setProducts] = useState(initialProducts);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [form, setForm] = useState({
        name: "", slug: "", category: "Game Accounts", price: "",
        type: "one-time" as "one-time" | "subscription",
        interval: null as "monthly" | "yearly" | null,
        description: "", active: true,
    });

    const openCreate = () => {
        setEditing(null);
        setForm({ name: "", slug: "", category: "Game Accounts", price: "", type: "one-time", interval: null, description: "", active: true });
        setModalOpen(true);
    };

    const openEdit = (p: Product) => {
        setEditing(p);
        setForm({ name: p.name, slug: p.slug, category: p.category, price: String(p.price), type: p.type, interval: p.interval, description: p.description, active: p.active });
        setModalOpen(true);
    };

    const handleSave = () => {
        const product = {
            ...form,
            price: parseFloat(form.price) || 0,
            interval: form.type === "subscription" ? (form.interval || "monthly") : null,
        };
        if (editing) {
            setProducts(products.map((p) => p.id === editing.id ? { ...p, ...product } : p));
        } else {
            setProducts([...products, { id: String(Date.now()), ...product }]);
        }
        setModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this product? This will also remove the Stripe price.")) {
            setProducts(products.filter((p) => p.id !== id));
        }
    };

    const toggleActive = (id: string) => {
        setProducts(products.map((p) => p.id === id ? { ...p, active: !p.active } : p));
    };

    const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Products</h1>
                    <p className="text-sm text-[var(--text-tertiary)] mt-1">{products.length} products</p>
                </div>
                <button onClick={openCreate} className="btn-primary text-sm py-2.5 px-5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Product
                </button>
            </div>

            {/* Table */}
            <div className="card-static overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--border)]">
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Product</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4 hidden md:table-cell">Category</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Price</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Type</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Status</th>
                            <th className="text-right text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="table-row border-b border-[var(--border)] last:border-0">
                                <td className="p-4">
                                    <p className="text-sm text-white font-medium">{p.name}</p>
                                    <p className="text-xs text-[var(--text-tertiary)] font-mono mt-0.5">{p.slug}</p>
                                </td>
                                <td className="p-4 hidden md:table-cell">
                                    <span className="badge badge-neutral text-[11px]">{p.category}</span>
                                </td>
                                <td className="p-4 text-sm text-white font-medium">
                                    €{p.price.toFixed(2)}
                                    {p.type === "subscription" && <span className="text-[var(--text-tertiary)]">/{p.interval === "yearly" ? "yr" : "mo"}</span>}
                                </td>
                                <td className="p-4">
                                    <span className={`badge text-[11px] ${p.type === "subscription" ? "badge-accent" : "badge-neutral"}`}>
                                        {p.type === "subscription" ? "Subscription" : "One-time"}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => toggleActive(p.id)}
                                        className={`w-9 h-5 rounded-full transition-colors duration-200 relative ${p.active ? "bg-[var(--success)]" : "bg-[var(--surface)]"
                                            }`}
                                    >
                                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${p.active ? "left-[18px]" : "left-0.5"
                                            }`} />
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

            {/* Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay"
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className="card-static w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-lg font-bold text-white mb-5">
                                {editing ? "Edit Product" : "New Product"}
                            </h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="label">Name</label>
                                        <input type="text" value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : autoSlug(e.target.value) })}
                                            placeholder="Product name" className="input" />
                                    </div>
                                    <div>
                                        <label className="label">Slug</label>
                                        <input type="text" value={form.slug}
                                            onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                            placeholder="product-slug" className="input font-mono text-sm" />
                                    </div>
                                    <div>
                                        <label className="label">Category</label>
                                        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="select">
                                            {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Price (€)</label>
                                        <input type="number" step="0.01" value={form.price}
                                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                                            placeholder="0.00" className="input" />
                                    </div>
                                    <div>
                                        <label className="label">Type</label>
                                        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "one-time" | "subscription" })} className="select">
                                            <option value="one-time">One-time</option>
                                            <option value="subscription">Subscription</option>
                                        </select>
                                    </div>
                                    {form.type === "subscription" && (
                                        <div className="col-span-2">
                                            <label className="label">Billing Interval</label>
                                            <select value={form.interval || "monthly"} onChange={(e) => setForm({ ...form, interval: e.target.value as "monthly" | "yearly" })} className="select">
                                                <option value="monthly">Monthly</option>
                                                <option value="yearly">Yearly</option>
                                            </select>
                                        </div>
                                    )}
                                    <div className="col-span-2">
                                        <label className="label">Description</label>
                                        <textarea value={form.description}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            placeholder="Product description" className="textarea" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6">
                                <button onClick={handleSave} className="btn-primary flex-1 py-2.5 text-sm">
                                    {editing ? "Save Changes" : "Create Product"}
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
