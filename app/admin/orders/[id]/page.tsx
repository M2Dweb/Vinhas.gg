"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { Order, OrderMessage } from "@/lib/types";

export default function AdminOrderDetailsPage() {
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
        // Fetch order with product and user details
        const { data, error } = await supabase
            .from("orders")
            .select(`
                *,
                products ( name, image_url, type ),
                profiles ( username, full_name, email:id )
            `)
            .eq("id", params.id)
            .single();

        if (data) setOrder(data);

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

        // Ensure admin user profile ID is fetched (assuming we are logged in as admin)
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { error } = await supabase.from("order_messages").insert({
                order_id: order.id,
                user_id: user.id,
                message: newMessage.trim(),
                is_admin_reply: true
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

    const handleUpdateStatus = async (newStatus: string) => {
        if (!order) return;
        const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", order.id);
        if (!error) {
            setOrder({ ...order, status: newStatus });
        }
    };

    if (loading) {
        return <div className="flex h-64 items-center justify-center text-[var(--text-tertiary)]">A carregar detalhes da encomenda...</div>;
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <p className="text-[var(--text-tertiary)]">Encomenda não encontrada.</p>
                <button onClick={() => router.push("/admin/orders")} className="btn-secondary mt-4 py-2 px-6">Voltar</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => router.push("/admin/orders")} className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-tertiary)] hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        Encomenda <span className="text-[var(--text-tertiary)] font-mono text-base">#{order.id.slice(0, 8)}</span>
                    </h1>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    <div className="text-sm font-medium text-[var(--text-secondary)]">Status:</div>
                    <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border appearance-none outline-none cursor-pointer
                            ${order.status === "completed" ? "bg-[rgba(34,197,94,0.1)] text-green-400 border-[rgba(34,197,94,0.2)]" :
                                order.status === "pending" ? "bg-[rgba(234,179,8,0.1)] text-yellow-400 border-[rgba(234,179,8,0.2)]" :
                                    "bg-[rgba(239,68,68,0.1)] text-red-400 border-[rgba(239,68,68,0.2)]"}`}
                    >
                        <option value="pending" className="bg-black text-yellow-400">Pendente</option>
                        <option value="completed" className="bg-black text-green-400">Paga/Concluída</option>
                        <option value="failed" className="bg-black text-red-400">Falhada</option>
                        <option value="refunded" className="bg-black text-gray-400">Reembolsada</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Summary Sidebar */}
                <div className="space-y-6">
                    <div className="card-static p-5">
                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Cliente</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-[var(--text-tertiary)]">Nome</p>
                                <p className="text-sm font-medium text-white">{order.profiles?.full_name || order.profiles?.username || "Sem Nome"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--text-tertiary)]">ID Cloud</p>
                                <p className="text-xs font-mono text-[var(--text-secondary)] truncate">{order.user_id}</p>
                            </div>
                        </div>
                    </div>

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
                                <p className="text-[11px] text-[var(--accent)] font-medium uppercase mt-0.5">{order.products?.type}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                            <span className="text-sm text-[var(--text-secondary)]">Valor Pago</span>
                            <span className="text-lg font-bold text-white">€{Number(order.amount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="lg:col-span-2 flex flex-col h-[600px] card-static overflow-hidden">
                    <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-hover)]">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                            Painel de Entrega & Chat
                        </h3>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">Usa este chat para enviar seriais, logins, ou falar com o cliente.</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg)] custom-scrollbar">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                <div className="w-12 h-12 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-[var(--text-secondary)]">Sem mensagens.</p>
                                <p className="text-xs text-[var(--text-tertiary)] mt-1">Sê o primeiro a enviar os dados ao cliente!</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.is_admin_reply ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.is_admin_reply
                                            ? "bg-[var(--accent)] text-white rounded-tr-sm"
                                            : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] rounded-tl-sm"
                                        }`}>
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                        <div className={`text-[10px] mt-2 flex items-center gap-1 ${msg.is_admin_reply ? "text-[rgba(255,255,255,0.6)]" : "text-[var(--text-tertiary)]"}`}>
                                            {msg.is_admin_reply ? (
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                                </svg>
                                            ) : null}
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
                                placeholder="Escreve uma mensagem ou envia os dados..."
                                className="input flex-1 min-h-[44px] max-h-32 resize-y py-3 rounded-2xl"
                                rows={1}
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || sending}
                                className="w-11 h-11 shrink-0 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--accent)]/20"
                            >
                                <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-[10px] text-[var(--text-tertiary)] text-center mt-2.5">
                            Pressiona <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--bg)] border border-[var(--border)] font-sans">Enter</kbd> para enviar. Usa <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--bg)] border border-[var(--border)] font-sans">Shift + Enter</kbd> para nova linha.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
