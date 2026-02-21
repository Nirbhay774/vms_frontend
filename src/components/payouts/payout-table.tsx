"use client";

import React from "react";
import { Table, TableRow, TableCell } from "@/components/ui/table";
import { Payout, PayoutStatus } from "@/types/payout";
import { Button } from "@/components/ui/button";

interface PayoutTableProps {
    payouts: Payout[];
    userRole: string;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onSubmit: (id: string) => void;
}

export function PayoutTable({ payouts, userRole, onApprove, onReject, onSubmit }: PayoutTableProps) {
    const getStatusColor = (status: PayoutStatus) => {
        switch (status) {
            case PayoutStatus.APPROVED:
            case PayoutStatus.PROCESSED:
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case PayoutStatus.REJECTED:
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            case PayoutStatus.SUBMITTED:
            case PayoutStatus.PENDING:
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            default:
                return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
        }
    };

    return (
        <Table headers={["Vendor", "Amount", "Status", "Description", "Date", "Actions"]}>
            {payouts.length === 0 ? (
                <TableRow>
                    <TableCell className="text-center italic text-zinc-500" colSpan={6}>
                        No payouts found.
                    </TableCell>
                </TableRow>
            ) : (
                payouts.map((payout) => (
                    <TableRow key={payout._id}>
                        <TableCell className="font-medium">
                            {typeof payout.vendor === "object" ? payout.vendor.name : payout.vendor}
                        </TableCell>
                        <TableCell>
                            <div className="font-semibold">
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: payout.currency,
                                }).format(payout.amount)}
                            </div>
                        </TableCell>
                        <TableCell>
                            <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                    payout.status
                                )}`}
                            >
                                {payout.status}
                            </span>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{payout.description || "-"}</TableCell>
                        <TableCell>{new Date(payout.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                {payout.status === PayoutStatus.DRAFT && (userRole === "ADMIN" || userRole === "OPS") && (
                                    <Button variant="primary" onClick={() => onSubmit(payout._id)}>
                                        Submit
                                    </Button>
                                )}
                                {payout.status === PayoutStatus.SUBMITTED && (userRole === "ADMIN" || userRole === "FINANCE") && (
                                    <>
                                        <Button variant="primary" onClick={() => onApprove(payout._id)}>
                                            Approve
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => onReject(payout._id)}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))
            )}
        </Table>
    );
}
