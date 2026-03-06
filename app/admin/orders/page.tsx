"use client";

const orders = [
    { id: "#VGG-0342", product: "Pro Gaming Plan", customer: "alex@email.com", amount: "€24.99", status: "completed", type: "subscription", date: "Mar 6, 2026" },
    { id: "#VGG-0341", product: "Fortnite V-Bucks Bundle", customer: "sarah@email.com", amount: "€29.99", status: "completed", type: "one-time", date: "Mar 6, 2026" },
    { id: "#VGG-0340", product: "Valorant Boost to Diamond", customer: "jake@email.com", amount: "€89.99", status: "pending", type: "one-time", date: "Mar 5, 2026" },
    { id: "#VGG-0339", product: "Roblox Premium Monthly", customer: "emma@email.com", amount: "€9.99", status: "completed", type: "subscription", date: "Mar 5, 2026" },
    { id: "#VGG-0338", product: "CS2 Prime Status", customer: "chris@email.com", amount: "€14.99", status: "failed", type: "one-time", date: "Mar 4, 2026" },
    { id: "#VGG-0337", product: "Elite Coaching Session", customer: "mia@email.com", amount: "€39.99", status: "completed", type: "one-time", date: "Mar 4, 2026" },
    { id: "#VGG-0336", product: "Pro Gaming Plan", customer: "david@email.com", amount: "€24.99", status: "completed", type: "subscription", date: "Mar 3, 2026" },
    { id: "#VGG-0335", product: "GTA V Money Package", customer: "lucia@email.com", amount: "€19.99", status: "refunded", type: "one-time", date: "Mar 3, 2026" },
];

export default function AdminOrdersPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white tracking-tight">Orders</h1>
                <p className="text-sm text-[var(--text-tertiary)] mt-1">{orders.length} total orders</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {["All", "Completed", "Pending", "Failed", "Refunded"].map((f) => (
                    <button
                        key={f}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${f === "All"
                                ? "bg-[var(--accent)] text-white"
                                : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-hover)]"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="card-static overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--border)]">
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Order ID</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Product</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4 hidden md:table-cell">Customer</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Amount</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Type</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Status</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4 hidden lg:table-cell">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="table-row border-b border-[var(--border)] last:border-0">
                                <td className="p-4 text-sm text-[var(--text-secondary)] font-mono">{order.id}</td>
                                <td className="p-4 text-sm text-white font-medium">{order.product}</td>
                                <td className="p-4 text-sm text-[var(--text-tertiary)] hidden md:table-cell">{order.customer}</td>
                                <td className="p-4 text-sm text-white font-medium">{order.amount}</td>
                                <td className="p-4">
                                    <span className={`badge text-[11px] ${order.type === "subscription" ? "badge-accent" : "badge-neutral"}`}>
                                        {order.type === "subscription" ? "Sub" : "One-time"}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`badge text-[11px] ${order.status === "completed" ? "badge-success" :
                                            order.status === "pending" ? "badge-warning" :
                                                order.status === "refunded" ? "badge-neutral" : "badge-danger"
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-[var(--text-tertiary)] hidden lg:table-cell">{order.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
