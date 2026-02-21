"use client";

import React, { useEffect, useState, useCallback } from "react";
import { PayoutTable } from "@/components/payouts/payout-table";
import { PayoutDialog } from "@/components/payouts/payout-dialog";
import { payoutService } from "@/services/payout";
import { Payout, PayoutStatus, CreatePayoutDto } from "@/types/payout";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";

export default function PayoutsPage() {
    const { user } = useAuth();
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchPayouts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await payoutService.getPayouts(page, 10);
            setPayouts(response.payouts);
            setTotal(response.total);
        } catch (err: any) {
            setError(err.message || "Failed to fetch payouts");
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchPayouts();
    }, [fetchPayouts]);

    const handleCreatePayout = async (data: CreatePayoutDto) => {
        try {
            await payoutService.createPayout(data);
            fetchPayouts();
        } catch (err: any) {
            alert(err.message || "Failed to create payout");
        }
    };

    const handleSubmit = async (id: string) => {
        try {
            await payoutService.submitPayout(id);
            fetchPayouts();
        } catch (err: any) {
            alert(err.message || "Failed to submit payout");
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await payoutService.approvePayout(id);
            fetchPayouts();
        } catch (err: any) {
            alert(err.message || "Failed to approve payout");
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt("Please provide a reason for rejection:");
        if (reason === null) return; // Cancelled
        if (!reason.trim()) {
            alert("Rejection reason is required");
            return;
        }
        try {
            await payoutService.rejectPayout(id, reason);
            fetchPayouts();
        } catch (err: any) {
            alert(err.message || "Failed to reject payout");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Payout Requests</h1>
                    <p className="text-zinc-500 text-sm">Review and manage vendor payout requests.</p>
                </div>
                {(user?.role === "ADMIN" || user?.role === "OPS") && (
                    <Button onClick={() => setIsDialogOpen(true)}>New Payout Request</Button>
                )}
            </div>

            {error && <Alert message={error} type="error" />}

            <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm">
                {isLoading ? (
                    <div className="p-12 text-center text-zinc-500">Loading payouts...</div>
                ) : (
                    <>
                        <PayoutTable
                            payouts={payouts}
                            userRole={user?.role || ""}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onSubmit={handleSubmit}
                        />
                        {total > 10 && (
                            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm">
                                <span className="text-zinc-500">Showing {payouts.length} of {total} payouts</span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        disabled={page * 10 >= total}
                                        onClick={() => setPage(p => p + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <PayoutDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleCreatePayout}
            />
        </div>
    );
}
