"use client";

import { motion } from "framer-motion";

const stats = [
    { label: "Total Revenue", value: "€12,459", change: "+18.2%", positive: true },
    { label: "Orders", value: "342", change: "+12", positive: true },
    { label: "Active Subs", value: "89", change: "+5", positive: true },
    { label: "Users", value: "1,247", change: "+23", positive: true },
];

const recentOrders = [
    { id: "#VGG-0342", product: "Pro Gaming Plan", customer: "alex@email.com", amount: "€24.99", status: "completed", date: "2h ago" },
    { id: "#VGG-0341", product: "Fortnite V-Bucks Bundle", customer: "sarah@email.com", amount: "€29.99", status: "completed", date: "5h ago" },
    { id: "#VGG-0340", product: "Valorant Boost", customer: "jake@email.com", amount: "€89.99", status: "pending", date: "1d ago" },
    { id: "#VGG-0339", product: "Roblox Premium", customer: "emma@email.com", amount: "€9.99", status: "completed", date: "1d ago" },
    { id: "#VGG-0338", product: "CS2 Prime Status", customer: "chris@email.com", amount: "€14.99", status: "failed", date: "2d ago" },
];

export default function AdminDashboard() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
                <p className="text-sm text-[var(--text-tertiary)] mt-1">Overview of your store performance.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className="card-static p-5"
                    >
                        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-white mt-1 tracking-tight">{stat.value}</p>
                        <span className={`text-xs font-medium mt-1 inline-block ${stat.positive ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
                            {stat.change}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Recent Orders Table */}
            <div className="card-static">
                <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
                    <h2 className="text-[15px] font-semibold text-white">Recent Orders</h2>
                    <a href="/admin/orders" className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors">
                        View All →
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border)]">
                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">ID</th>
                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Product</th>
                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Customer</th>
                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Amount</th>
                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Status</th>
                                <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="table-row border-b border-[var(--border)] last:border-0">
                                    <td className="p-4 text-sm text-[var(--text-secondary)] font-mono">{order.id}</td>
                                    <td className="p-4 text-sm text-white font-medium">{order.product}</td>
                                    <td className="p-4 text-sm text-[var(--text-tertiary)]">{order.customer}</td>
                                    <td className="p-4 text-sm text-white font-medium">{order.amount}</td>
                                    <td className="p-4">
                                        <span className={`badge text-[11px] ${order.status === "completed" ? "badge-success" :
                                                order.status === "pending" ? "badge-warning" : "badge-danger"
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-[var(--text-tertiary)]">{order.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
