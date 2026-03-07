"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { Order, OrderMessage } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";

function OrderDetailsContent() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();

    const [order, setOrder] = useState<any>(null);
    const [messages, setMessages] = useState<OrderMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchOrder = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push("/dashboard");
            return;
        }

        // Fetch order with product details (matching user_id to ensure security)
        const { data, error } = await supabase
            .from("orders")
            .select(`
                *,
                products ( name, image_url, type )
            `)
            .eq("id", params.id)
            .eq("user_id", user.id)
            .single();

        if (error || !data) {
            console.error("Erro ou encomenda não encontrada", error);
            router.push("/dashboard");
            return;
        }

        setOrder(data);

        // Fetch messages
        const { data: msgs } = await supabase
            .from("order_messages")
            .select("*")
            .eq("order_id", params.id)
            .order("created_at", { ascending: true });

        if (msgs) setMessages(msgs);

        setLoading(false);
    };

    useEffect(() => {
        fetchOrder();

        // Setup real-time subscription for new messages
        const channel = supabase
            .channel(`order_messages_${params.id}`)
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "order_messages", filter: `order_id=eq.${params.id}` }, (payload) => {
                setMessages((prev) => [...prev, payload.new as OrderMessage]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [params.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !order) return;

        setSending(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { error } = await supabase.from("order_messages").insert({
                order_id: order.id,
                user_id: user.id,
                message: newMessage.trim(),
                is_admin_reply: false // We are the client
            });

            if (!error) {
                setNewMessage("");
            } else {
                alert("Erro ao enviar a mensagem.");
                console.error(error);
            }
        }

        setSending(false);
    };

    return (
        <main className="min-h-screen flex flex-col pt-24">
            <Navbar />

            <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="flex h-64 items-center justify-center text-[var(--text-tertiary)]">A carregar detalhes da encomenda...</div>
                ) : !order ? (
                    <div className="text-center py-20">
                        <p className="text-[var(--text-tertiary)]">Encomenda não encontrada.</p>
                        <button onClick={() => router.push("/dashboard")} className="btn-secondary mt-4 py-2 px-6">Voltar</button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-4 mb-8">
                            <button onClick={() => router.push("/dashboard")} className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-tertiary)] hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                    A Tua Encomenda
                                </h1>
                            </div>
                            <div className="ml-auto flex items-center gap-3">
                                <span className={`badge ${order.status === "completed" ? "badge-success" : order.status === "pending" ? "badge-warning" : "badge-neutral"}`}>
                                    {order.status === "completed" ? "Paga" : order.status}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Order Summary Sidebar */}
                            <div className="space-y-6">
                                <div className="card-static p-5">
                                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Produto</h3>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-[var(--bg-subtle)] rounded-lg overflow-hidden shrink-0 border border-[var(--border)] relative">
                                            {order.products?.image_url ? (
                                                <img src={order.products.image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-30">🎮</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white line-clamp-2">{order.products?.name}</p>
                                            <p className="text-[11px] text-[var(--accent)] font-medium uppercase mt-0.5">{order.products?.type === "subscription" ? "Subscrição" : "Compra Única"}</p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                                        <span className="text-sm text-[var(--text-secondary)]">Valor Pago</span>
                                        <span className="text-lg font-bold text-white">€{Number(order.amount).toFixed(2)}</span>
                                    </div>
                                    <div className="pt-3 flex items-center justify-between">
                                        <span className="text-sm text-[var(--text-secondary)]">Data da Compra</span>
                                        <span className="text-sm font-mono text-[var(--text-secondary)]">{new Date(order.created_at).toLocaleDateString("pt-PT")}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Interface */}
                            <div className="lg:col-span-2 flex flex-col h-[600px] card-static overflow-hidden border border-[var(--accent)] shadow-[0_0_20px_rgba(163,85,255,0.1)]">
                                <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-hover)]">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                        A Tua Entrega
                                    </h3>
                                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                        A nossa equipa vai enviar-te os dados da tua compra por aqui. Podes usar este chat se tiveres dúvidas.
                                    </p>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg)] custom-scrollbar">
                                    {messages.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                            <div className="w-12 h-12 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-3">
                                                <svg className="w-5 h-5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-medium text-[var(--text-secondary)]">A aguardar entrega...</p>
                                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                                A tua encomenda está a ser processada. <br />Receberás os dados aqui em breve.
                                            </p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div key={msg.id} className={`flex ${!msg.is_admin_reply ? "justify-end" : "justify-start"}`}>
                                                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${!msg.is_admin_reply
                                                        ? "bg-[var(--surface)] border border-[var(--border)] text-white rounded-tr-sm"
                                                        : "bg-[var(--accent)] text-white rounded-tl-sm shadow-[0_4px_12px_rgba(163,85,255,0.2)]"
                                                    }`}>
                                                    {msg.is_admin_reply && <p className="text-[10px] font-bold tracking-widest uppercase mb-1 text-[rgba(255,255,255,0.5)]">Vinhas.gg</p>}
                                                    <p className="text-sm whitespace-pre-wrap leading-relaxed font-mono selection:bg-white/20">{msg.message}</p>
                                                    <div className={`text-[10px] mt-2 flex items-center justify-end gap-1 ${msg.is_admin_reply ? "text-[rgba(255,255,255,0.6)]" : "text-[var(--text-tertiary)]"}`}>
                                                        {new Date(msg.created_at).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--border)] bg-[var(--surface)]">
                                    <div className="flex items-end gap-2">
                                        <textarea
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage(e);
                                                }
                                            }}
                                            placeholder="Escreve uma mensagem para o suporte..."
                                            className="input flex-1 min-h-[44px] max-h-32 resize-y py-3 rounded-2xl"
                                            rows={1}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim() || sending}
                                            className="w-11 h-11 shrink-0 bg-white hover:bg-gray-200 text-black rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                        >
                                            <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                            </svg>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </main>
    );
}

export default function UserOrderDetails() {
    return (
        <LanguageProvider>
            <OrderDetailsContent />
        </LanguageProvider>
    );
}
