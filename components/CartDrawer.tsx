"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartProvider";
import { useLanguage } from "./LanguageProvider";
import Image from "next/image";
import { useState } from "react";

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, totalPrice } = useCart();
    const { t } = useLanguage();
    const [loadingCheckout, setLoadingCheckout] = useState(false);

    const handleCheckout = async () => {
        if (items.length === 0) return;
        setLoadingCheckout(true);

        try {
            // Modify checkout API to take multiple items
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map(item => ({
                        priceId: item.product.stripe_price_id,
                        productId: item.product.id,
                        quantity: item.quantity,
                        type: item.product.type,
                        amount: item.product.price,
                        name: item.product.name,
                        interval: item.product.interval
                    }))
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || "Failed to create checkout session");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Ocorreu um erro ao iniciar o pagamento. Tenta novamente.");
            setLoadingCheckout(false);
        }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-[var(--bg)] border-l border-[var(--border)] shadow-2xl z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--surface)]">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                                O teu Carrinho
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 text-[var(--text-tertiary)] hover:text-white hover:bg-[var(--surface-hover)] rounded-xl transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-[var(--text-tertiary)] space-y-4">
                                    <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                    </svg>
                                    <p>O teu carrinho está vazio.</p>
                                    <button onClick={() => setIsCartOpen(false)} className="btn-secondary py-2 px-6 text-sm">
                                        Explorar Produtos
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.product.id} className="flex gap-4 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[var(--bg-subtle)] shrink-0">
                                            {item.product.image_url ? (
                                                <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[var(--accent)] opacity-20">
                                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1 justify-between py-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="text-sm font-bold text-white line-clamp-2">{item.product.name}</h3>
                                                <button onClick={() => removeFromCart(item.product.id)} className="text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-colors p-1">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2 bg-[var(--bg)] rounded-lg border border-[var(--border)] p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                        className="w-6 h-6 flex items-center justify-center text-[var(--text-tertiary)] hover:text-white transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        className="w-6 h-6 flex items-center justify-center text-[var(--text-tertiary)] hover:text-white transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span className="font-bold text-[var(--accent)] text-sm">
                                                    €{(Number(item.product.price) * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-[var(--border)] bg-[var(--surface-hover)]">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[var(--text-secondary)] font-medium">Subtotal</span>
                                    <span className="text-xl font-bold text-white">€{totalPrice.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={loadingCheckout}
                                    className="btn-primary w-full py-3.5 text-sm font-bold shadow-lg shadow-[var(--accent)]/20 disabled:opacity-50"
                                >
                                    {loadingCheckout ? "A iniciar pagamento..." : "Finalizar Compra"}
                                </button>
                                <p className="text-center text-xs text-[var(--text-tertiary)] mt-4 flex items-center justify-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                    Pagamento Seguro por Stripe
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
