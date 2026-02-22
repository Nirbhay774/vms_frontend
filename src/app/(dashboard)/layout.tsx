"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const navItems = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Vendors", href: "/vendors" },
        { label: "Payouts", href: "/payouts" },
    ];

    if (user?.role === "FINANCE") {
        navItems.push({ label: "Audit Logs", href: "/audits" });
    }

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">VMS Portal</h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                    <div className="px-4">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{user?.email}</p>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">{user?.role}</p>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        onClick={logout}
                    >
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
