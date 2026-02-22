"use client";

import React, { useEffect, useState } from "react";
import { AuditLogTable } from "@/components/audit-logs/audit-log-table";
import { auditService } from "@/services/audit";
import { Audit, AuditFilters } from "@/types/audit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuditsPage() {
    const [logs, setLogs] = useState<Audit[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<AuditFilters>({});

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await auditService.getLogs({ ...filters, page, limit: 10 });
            setLogs(response.logs);
            setTotal(response.total);
        } catch (error) {
            console.error("Failed to fetch audit logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPage(1); // Reset to first page on filter change
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 italic">Audit Logs</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Monitor system activity and changes across all resources.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm">
                <Input
                    placeholder="Filter by Resource (e.g. payout)"
                    name="resource"
                    value={filters.resource || ""}
                    onChange={handleFilterChange}
                />
                <Input
                    placeholder="Filter by Resource ID"
                    name="resourceId"
                    value={filters.resourceId || ""}
                    onChange={handleFilterChange}
                />
                <Input
                    placeholder="Filter by Action (e.g. create)"
                    name="action"
                    value={filters.action || ""}
                    onChange={handleFilterChange}
                />
                <Button onClick={fetchLogs} variant="primary">
                    Refresh Logs
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm overflow-hidden">
                <AuditLogTable logs={logs} loading={loading} />
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">
                    Showing {logs.length} of {total} entries
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        disabled={page === 1 || loading}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        disabled={page * 10 >= total || loading}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
