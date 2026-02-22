import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    loading?: boolean;
}

export function StatsCard({ title, value, icon: Icon, description, loading }: StatsCardProps) {
    if (loading) {
        return (
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mb-2"></div>
                    <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
                </div>
                <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded mb-2"></div>
                <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    {title}
                </h3>
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                    <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
            </div>
            <div className="space-y-1">
                <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 italic">
                    {value}
                </div>
                {description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
