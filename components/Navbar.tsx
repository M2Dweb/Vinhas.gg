"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import { locales, Locale } from "@/lib/i18n";

interface NavbarProps {
    onLoginClick?: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
    const { locale, setLocale, t } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

    const navLinks = [
        { name: t("nav.products"), href: "/products" },
        { name: t("nav.pricing"), href: "#pricing" },
        { name: t("nav.faq"), href: "#faq" },
        { name: t("nav.support"), href: "#support" },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setLangOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentLocale = locales.find((l) => l.code === locale)!;

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "navbar-blur" : "border-b border-transparent"
                }`}
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        <Image
                            src="/logos/logo-dark.svg"
                            alt="Vinhas.gg"
                            width={120}
                            height={28}
                            className="h-6 w-auto"
                            priority
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="btn-ghost text-[13px]"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right side: Lang + Auth */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Language Switcher */}
                        <div className="relative" ref={langRef}>
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="btn-ghost text-[13px] gap-1.5 px-3"
                            >
                                <span className="text-base leading-none">{currentLocale.flag}</span>
                                <span>{currentLocale.code.toUpperCase()}</span>
                                <svg
                                    className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                                    fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
                                >
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
                                                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] transition-colors ${locale === l.code
                                                    ? "text-white bg-[var(--accent-subtle)]"
                                                    : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface-hover)]"
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

                        <button onClick={onLoginClick} className="btn-ghost text-[13px]">
                            {t("nav.login")}
                        </button>
                        <button onClick={onLoginClick} className="btn-primary text-[13px] py-2 px-5">
                            {t("nav.getStarted")}
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex md:hidden items-center gap-2">
                        {/* Mobile lang button */}
                        <div className="relative" ref={langRef}>
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="p-2 text-base"
                            >
                                {currentLocale.flag}
                            </button>
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
                                                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] transition-colors ${locale === l.code
                                                    ? "text-white bg-[var(--accent-subtle)]"
                                                    : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface-hover)]"
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

                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2"
                            aria-label="Toggle menu"
                        >
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
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-3 py-2.5 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/3 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-3 border-t border-[var(--border)]">
                                <button
                                    onClick={() => { onLoginClick?.(); setMobileOpen(false); }}
                                    className="w-full btn-primary text-sm py-2.5"
                                >
                                    {t("nav.getStarted")}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
