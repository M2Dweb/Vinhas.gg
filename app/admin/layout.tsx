"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const links = [
        {
            name: "Dashboard",
            href: "/admin",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                </svg>
            )
        },
        {
            name: "Categorias",
            href: "/admin/categories",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
            )
        },
        {
            name: "Produtos",
            href: "/admin/products",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a2.25 2.25 0 002.25-2.25v-.75a2.25 2.25 0 00-2.25-2.25h-3a.75.75 0 01-.75-.75V3.75a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v3.75a.75.75 0 01-.75.75h-3a2.25 2.25 0 00-2.25 2.25v.75A2.25 2.25 0 006 10.5h3a.75.75 0 01.75.75v7.5a.75.75 0 00.75.75h3a.75.75 0 00.75-.75z" />
                </svg>
            )
        },
        {
            name: "Encomendas",
            href: "/admin/orders",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
            )
        },
        {
            name: "Utilizadores",
            href: "/admin/users",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--bg)] flex flex-col md:flex-row">
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--border)] shrink-0 flex flex-col sticky top-0 bg-[var(--bg-subtle)] md:h-screen">
                <div className="p-6">
                    <Link href="/" className="inline-block">
                        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                </svg>
                            </span>
                            Vinhas.gg <span className="text-[var(--text-tertiary)] text-sm font-normal">Admin</span>
                        </h1>
                    </Link>
                </div>

                <nav className="flex-1 px-4 pb-6 overflow-y-auto space-y-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? "bg-[var(--accent-subtle)] text-[var(--accent-hover)] border border-[var(--accent-border)]"
                                        : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface)] border border-transparent"
                                    }`}
                            >
                                <div className={`${isActive ? "text-[var(--accent)]" : "text-[var(--text-tertiary)]"}`}>
                                    {link.icon}
                                </div>
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-x-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-6xl mx-auto"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
