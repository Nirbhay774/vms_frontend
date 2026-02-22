"use client";

import React, { useState } from "react";
import { Table, TableRow, TableCell } from "@/components/ui/table";
import { Audit } from "@/types/audit";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface AuditLogTableProps {
    logs: Audit[];
    loading?: boolean;
}

export function AuditLogTable({ logs, loading }: AuditLogTableProps) {
    const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);

    const formatJSON = (data: any) => {
        if (!data) return "N/A";
        return JSON.stringify(data, null, 2);
    };

    return (
        <>
            <Table headers={["Action", "Resource", "Resource ID", "User", "Date", "Details"]}>
                {loading ? (
                    <TableRow key="loading">
                        <TableCell className="text-center py-8" colSpan={6}>
                            Loading audits...
                        </TableCell>
                    </TableRow>
                ) : logs.length === 0 ? (
                    <TableRow key="empty">
                        <TableCell className="text-center italic text-zinc-500 py-8" colSpan={6}>
                            No audit logs found.
                        </TableCell>
                    </TableRow>
                ) : (
                    logs.map((log) => (
                        <TableRow key={log.id || (log as any)._id}>
                            <TableCell className="font-medium">
                                <span className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono uppercase">
                                    {log.action}
                                </span>
                            </TableCell>
                            <TableCell>{log.resource}</TableCell>
                            <TableCell className="font-mono text-xs">{log.resourceId}</TableCell>
                            <TableCell>
                                <div>
                                    <div className="text-sm font-medium">{log.user?.email || "Unknown"}</div>
                                    <div className="text-xs text-zinc-500 uppercase">{log.user?.role}</div>
                                </div>
                            </TableCell>
                            <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedAudit(log)}
                                >
                                    View Changes
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </Table>

            <Modal
                isOpen={!!selectedAudit}
                onClose={() => setSelectedAudit(null)}
                title="Audit Details"
            >
                {selectedAudit && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-zinc-500 block">Action</span>
                                <span className="font-medium uppercase">{selectedAudit.action}</span>
                            </div>
                            <div>
                                <span className="text-zinc-500 block">Resource</span>
                                <span className="font-medium">{selectedAudit.resource}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Changes</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-xs text-zinc-500 uppercase">Old State</span>
                                    <pre className="p-3 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] overflow-auto max-h-60">
                                        {formatJSON(selectedAudit.oldState)}
                                    </pre>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-zinc-500 uppercase">New State</span>
                                    <pre className="p-3 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] overflow-auto max-h-60">
                                        {formatJSON(selectedAudit.newState)}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 text-xs text-zinc-500">
                            Logged at: {new Date(selectedAudit.createdAt).toLocaleString()}
                            <br />
                            IP Address: {selectedAudit.ipAddress || "Unknown"}
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}
