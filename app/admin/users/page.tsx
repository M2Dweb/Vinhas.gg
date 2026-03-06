"use client";

const users = [
    { id: "1", name: "Alex Martinez", email: "alex@email.com", role: "user", orders: 12, spent: "€289.88", joined: "Jan 15, 2026" },
    { id: "2", name: "Sarah Kim", email: "sarah@email.com", role: "user", orders: 8, spent: "€194.92", joined: "Feb 2, 2026" },
    { id: "3", name: "Jake Robinson", email: "jake@email.com", role: "user", orders: 3, spent: "€134.97", joined: "Feb 18, 2026" },
    { id: "4", name: "Emma Liu", email: "emma@email.com", role: "admin", orders: 0, spent: "€0.00", joined: "Jan 1, 2026" },
    { id: "5", name: "Chris Torres", email: "chris@email.com", role: "user", orders: 5, spent: "€89.95", joined: "Mar 1, 2026" },
    { id: "6", name: "Mia Davis", email: "mia@email.com", role: "user", orders: 2, spent: "€59.98", joined: "Mar 3, 2026" },
];

export default function AdminUsersPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white tracking-tight">Users</h1>
                <p className="text-sm text-[var(--text-tertiary)] mt-1">{users.length} registered users</p>
            </div>

            {/* Search */}
            <div className="mb-6 max-w-sm">
                <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input type="text" placeholder="Search users..." className="input pl-10" />
                </div>
            </div>

            {/* Table */}
            <div className="card-static overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--border)]">
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">User</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4 hidden md:table-cell">Email</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Role</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4">Orders</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4 hidden lg:table-cell">Total Spent</th>
                            <th className="text-left text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider p-4 hidden lg:table-cell">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="table-row border-b border-[var(--border)] last:border-0">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)] text-xs font-semibold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="text-sm text-white font-medium">{user.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-[var(--text-tertiary)] hidden md:table-cell">{user.email}</td>
                                <td className="p-4">
                                    <span className={`badge text-[11px] ${user.role === "admin" ? "badge-accent" : "badge-neutral"}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-white">{user.orders}</td>
                                <td className="p-4 text-sm text-white font-medium hidden lg:table-cell">{user.spent}</td>
                                <td className="p-4 text-sm text-[var(--text-tertiary)] hidden lg:table-cell">{user.joined}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
