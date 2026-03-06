"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { createClient } from "@/lib/supabase";

function SettingsContent() {
    const { t } = useLanguage();
    const supabase = createClient();
    const pathname = usePathname();
    const [authOpen, setAuthOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [form, setForm] = useState({
        full_name: "",
        username: "",
        discord_id: "",
    });

    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                setAuthOpen(true);
                return;
            }

            setUserEmail(user.email || "");

            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profile) {
                setForm({
                    full_name: profile.full_name || "",
                    username: profile.username || "",
                    discord_id: profile.discord_id || "",
                });
            }

            setLoading(false);
        };

        fetchProfile();
    }, [supabase]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Não autenticado.");

            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: form.full_name,
                    username: form.username,
                    discord_id: form.discord_id,
                })
                .eq("id", user.id);

            if (error) throw error;

            setMessage({ type: "success", text: "Perfil atualizado com sucesso." });
        } catch (err: any) {
            console.error(err);
            setMessage({ type: "error", text: "Erro ao atualizar perfil." });
        } finally {
            setSaving(false);
        }
    };

    const sidebarLinks = [
        { name: t("dashboard.purchases"), href: "/dashboard", active: pathname === "/dashboard" },
        { name: t("dashboard.settings"), href: "/dashboard/settings", active: pathname === "/dashboard/settings" },
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
                                <h1 className="text-2xl font-bold text-white tracking-tight mb-1">{t("dashboard.settings")}</h1>
                                <p className="text-sm text-[var(--text-tertiary)] mb-6">Atualiza as tuas informações de perfil e contactos.</p>

                                {loading ? (
                                    <div className="p-12 text-center text-[var(--text-tertiary)] card-static">A carregar perfil...</div>
                                ) : (
                                    <div className="card-static p-6 max-w-2xl">
                                        <form onSubmit={handleSave} className="space-y-5">
                                            {message.text && (
                                                <div className={`p-3 rounded-xl text-sm font-medium ${message.type === "success"
                                                        ? "bg-[rgba(34,197,94,0.1)] text-[#22C55E] border border-[rgba(34,197,94,0.2)]"
                                                        : "bg-[rgba(239,68,68,0.1)] text-[#EF4444] border border-[rgba(239,68,68,0.2)]"
                                                    }`}>
                                                    {message.text}
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                                    Email (Acesso Apenas Leitura)
                                                </label>
                                                <input
                                                    type="email"
                                                    value={userEmail}
                                                    disabled
                                                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-tertiary)] cursor-not-allowed opacity-70"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                                    Nome de Utilizador
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.username}
                                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
                                                    placeholder="Teu nick"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                                    Nome Completo
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.full_name}
                                                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
                                                    placeholder="Teu nome verdadeiro"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                                    ID do Discord
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.discord_id}
                                                    onChange={(e) => setForm({ ...form, discord_id: e.target.value })}
                                                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
                                                    placeholder="ex: user#1234 ou 123456789"
                                                />
                                                <p className="text-xs text-[var(--text-tertiary)] mt-1.5">
                                                    Usado para te dar cargos automáticos e suportar as tuas compras no servidor Discord.
                                                </p>
                                            </div>

                                            <div className="pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="btn-primary py-2.5 px-6 text-sm"
                                                >
                                                    {saving ? "A Guardar..." : "Guardar Alterações"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
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

export default function SettingsPage() {
    return (
        <LanguageProvider>
            <SettingsContent />
        </LanguageProvider>
    );
}
