"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { createClient } from "@/lib/supabase";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({ email: "", password: "", username: "" });
    const { t } = useLanguage();

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === "login") {
                const { error } = await supabase.auth.signInWithPassword({
                    email: form.email,
                    password: form.password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email: form.email,
                    password: form.password,
                    options: {
                        data: { full_name: form.username },
                    },
                });
                if (error) throw error;
            }
            onClose();
            window.location.reload();
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider: "google" | "discord") => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: { redirectTo: `${window.location.origin}/` },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || "Something went wrong");
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="card-static w-full max-w-[400px] p-7 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-white hover:bg-[var(--surface-hover)] transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white tracking-tight">
                                {mode === "login" ? t("auth.welcomeBack") : t("auth.createAccount")}
                            </h2>
                            <p className="text-sm text-[var(--text-tertiary)] mt-1">
                                {mode === "login" ? t("auth.signInDesc") : t("auth.getStartedDesc")}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.2)] text-sm text-[var(--danger)]">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-2.5 mb-5">
                            <button
                                onClick={() => handleOAuth("google")}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--surface)] transition-all disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex-1 h-px bg-[var(--border)]" />
                            <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">{t("auth.or")}</span>
                            <div className="flex-1 h-px bg-[var(--border)]" />
                        </div>

                        <form className="space-y-3.5" onSubmit={handleSubmit}>
                            {mode === "register" && (
                                <div>
                                    <label className="label">{t("auth.username")}</label>
                                    <input
                                        type="text"
                                        value={form.username}
                                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                                        placeholder={t("auth.username")}
                                        className="input"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="label">{t("auth.email")}</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="you@example.com"
                                    className="input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">{t("auth.password")}</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="input"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-2.5 mt-1 disabled:opacity-50"
                            >
                                {loading ? "..." : mode === "login" ? t("auth.signIn") : t("auth.createAccount")}
                            </button>
                        </form>

                        <p className="text-center text-sm text-[var(--text-tertiary)] mt-5">
                            {mode === "login" ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
                            <button
                                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
                                className="text-[var(--accent)] font-medium hover:text-[var(--accent-hover)] transition-colors"
                            >
                                {mode === "login" ? t("auth.signUp") : t("auth.signIn")}
                            </button>
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
