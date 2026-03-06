"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { locales, Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface NavbarProps {
    onLoginClick?: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
    const { locale, setLocale, t } = useLanguage();
    const router = useRouter();
    const supabase = createClient();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string>("user");
    const langRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    const navLinks = [
        { name: t("nav.products"), href: "/products" },
        { name: t("nav.faq"), href: "/#faq" },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
            if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch auth state
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            if (user) {
                supabase.from("profiles").select("role").eq("id", user.id).single().then(({ data }) => {
                    if (data) setUserRole(data.role);
                });
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setUserMenuOpen(false);
        window.location.href = "/";
    };

    const currentLocale = locales.find((l) => l.code === locale)!;
    const userInitial = user?.user_metadata?.full_name?.[0] || user?.email?.[0] || "?";

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "navbar-blur" : "border-b border-transparent"}`}
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        <Image src="/logos/logo-dark.svg" alt="Vinhas.gg" width={120} height={28} className="h-6 w-auto" priority />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="btn-ghost text-[13px]">{link.name}</Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Language Switcher */}
                        <div className="relative" ref={langRef}>
                            <button onClick={() => setLangOpen(!langOpen)} className="btn-ghost text-[13px] gap-1.5 px-3">
                                <span className="text-base leading-none">{currentLocale.flag}</span>
                                <span>{currentLocale.code.toUpperCase()}</span>
                                <svg className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            <AnimatePresence>
                                {langOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 4, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-1 w-44 card-static py-1.5 shadow-xl shadow-black/20 overflow-hidden"
                                    >
                                        {locales.map((l) => (
                                            <button
                                                key={l.code}
                                                onClick={() => { setLocale(l.code); setLangOpen(false); }}
                                                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] transition-colors ${locale === l.code ? "text-white bg-[var(--accent-subtle)]" : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface-hover)]"
                                                    }`}
                                            >
                                                <span className="text-base leading-none">{l.flag}</span>
                                                <span className="font-medium">{l.name}</span>
                                                {locale === l.code && (
                                                    <svg className="w-3.5 h-3.5 text-[var(--accent)] ml-auto" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Auth buttons or user menu */}
                        {user ? (
                            <div className="relative" ref={userRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[13px] text-[var(--text-secondary)] hover:text-white transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-xs font-bold text-[var(--accent)]">
                                        {userInitial.toUpperCase()}
                                    </div>
                                    <svg className={`w-3 h-3 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 4, scale: 0.97 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 4, scale: 0.97 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-1 w-48 card-static py-1.5 shadow-xl shadow-black/20 overflow-hidden"
                                        >
                                            <div className="px-3.5 py-2 border-b border-[var(--border)]">
                                                <p className="text-xs text-[var(--text-tertiary)] truncate">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setUserMenuOpen(false);
                                                    router.push("/dashboard");
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface-hover)] transition-colors text-left"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                                                </svg>
                                                A minha conta
                                            </button>
                                            {userRole === "admin" && (
                                                <button
                                                    onClick={() => {
                                                        setUserMenuOpen(false);
                                                        router.push("/admin");
                                                    }}
                                                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-colors text-left"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Painel Admin
                                                </button>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-[var(--danger)] hover:bg-[rgba(239,68,68,0.06)] transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                                </svg>
                                                Sair
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <button onClick={onLoginClick} className="btn-ghost text-[13px]">{t("nav.login")}</button>
                                <button onClick={onLoginClick} className="btn-primary text-[13px] py-2 px-5">{t("nav.getStarted")}</button>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex md:hidden items-center gap-2">
                        <div className="relative" ref={langRef}>
                            <button onClick={() => setLangOpen(!langOpen)} className="p-2 text-base">{currentLocale.flag}</button>
                            <AnimatePresence>
                                {langOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 4 }}
                                        className="absolute right-0 mt-1 w-44 card-static py-1.5 shadow-xl shadow-black/20 overflow-hidden"
                                    >
                                        {locales.map((l) => (
                                            <button
                                                key={l.code}
                                                onClick={() => { setLocale(l.code); setLangOpen(false); }}
                                                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] transition-colors ${locale === l.code ? "text-white bg-[var(--accent-subtle)]" : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface-hover)]"
                                                    }`}
                                            >
                                                <span className="text-base leading-none">{l.flag}</span>
                                                <span className="font-medium">{l.name}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2" aria-label="Toggle menu">
                            <div className="flex flex-col gap-1">
                                <motion.span animate={mobileOpen ? { rotate: 45, y: 5 } : {}} className="w-5 h-[1.5px] bg-white/70 block" />
                                <motion.span animate={mobileOpen ? { opacity: 0 } : {}} className="w-5 h-[1.5px] bg-white/70 block" />
                                <motion.span animate={mobileOpen ? { rotate: -45, y: -5 } : {}} className="w-5 h-[1.5px] bg-white/70 block" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden navbar-blur overflow-hidden"
                    >
                        <div className="px-6 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => { setMobileOpen(false); router.push(link.href); }}
                                    className="w-full text-left block px-3 py-2.5 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/3 transition-colors"
                                >
                                    {link.name}
                                </button>
                            ))}
                            {user && (
                                <>
                                    <button onClick={() => { setMobileOpen(false); router.push("/dashboard"); }} className="w-full text-left block px-3 py-2.5 text-sm text-white/60 hover:text-white rounded-lg transition-colors">
                                        A minha conta
                                    </button>
                                    {userRole === "admin" && (
                                        <button onClick={() => { setMobileOpen(false); router.push("/admin"); }} className="w-full text-left block px-3 py-2.5 text-sm text-[var(--accent)] rounded-lg transition-colors">
                                            Painel Admin
                                        </button>
                                    )}
                                </>
                            )}
                            <div className="pt-3 border-t border-[var(--border)]">
                                {user ? (
                                    <button onClick={handleLogout} className="w-full btn-secondary text-sm py-2.5 text-[var(--danger)]">Sair</button>
                                ) : (
                                    <button onClick={() => { onLoginClick?.(); setMobileOpen(false); }} className="w-full btn-primary text-sm py-2.5">{t("nav.getStarted")}</button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
