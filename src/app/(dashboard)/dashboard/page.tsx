"use client";

import React, { useEffect, useState } from "react";
import { Users, CreditCard } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { dashboardService } from "@/services/dashboard";
import { DashboardStats } from "@/types/dashboard";

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await dashboardService.getStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
                setError("Failed to load dashboard statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 italic">Dashboard Overview</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Welcome to the Vendor Management System. Here's a quick look at your system state.
                </p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Vendors"
                    value={stats?.totalVendors || 0}
                    icon={Users}
                    description="Registered vendors in the system"
                    loading={loading}
                />
                <StatsCard
                    title="Total Payouts"
                    value={stats?.totalPayouts || 0}
                    icon={CreditCard}
                    description="Total transactions processed"
                    loading={loading}
                />
            </div>

            {/* Placeholder for future charts or recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl min-h-[300px] flex items-center justify-center">
                    <p className="text-zinc-400 italic">Recent Activity Chart coming soon...</p>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl min-h-[300px] flex items-center justify-center">
                    <p className="text-zinc-400 italic">Payout Distribution coming soon...</p>
                </div>
            </div>
        </div>
    );
}
