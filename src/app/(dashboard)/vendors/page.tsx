"use client";

import React, { useEffect, useState, useCallback } from "react";
import { VendorTable } from "@/components/vendors/vendor-table";
import { VendorDialog } from "@/components/vendors/vendor-dialog";
import { vendorService } from "@/services/vendor";
import { Vendor, CreateVendorDto, VendorStatus } from "@/types/vendor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";

export default function VendorsPage() {
    const { user } = useAuth();
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

    const fetchVendors = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Note: Backend might need search/status query params support
            // For now we fetch with pagination
            const response = await vendorService.getVendors(page, 10);
            setVendors(response.vendors);
            setTotal(response.total);
        } catch (err: any) {
            setError(err.message || "Failed to fetch vendors");
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchVendors();
    }, [fetchVendors]);

    const handleCreateOrUpdate = async (data: CreateVendorDto) => {
        try {
            if (selectedVendor) {
                await vendorService.updateVendor(selectedVendor._id, data);
            } else {
                await vendorService.createVendor(data);
            }
            fetchVendors();
        } catch (err: any) {
            alert(err.message || "Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to deactivate this vendor?")) {
            try {
                await vendorService.deleteVendor(id);
                fetchVendors();
            } catch (err: any) {
                alert(err.message || "Failed to delete vendor");
            }
        }
    };

    const openAddDialog = () => {
        setSelectedVendor(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (vendor: Vendor) => {
        setSelectedVendor(vendor);
        setIsDialogOpen(true);
    };

    // Basic client-side filtering (since backend search might be limited)
    const filteredVendors = vendors.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.taxId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Vendors</h1>
                    <p className="text-zinc-500 text-sm">Manage your vendor directory and bank details.</p>
                </div>
                {(user?.role === "ADMIN" || user?.role === "OPS") && (
                    <Button onClick={openAddDialog}>Add Vendor</Button>
                )}
            </div>

            {error && <Alert message={error} type="error" />}

            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                    <Input
                        placeholder="Search by name, email or Tax ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <label className="text-xs font-medium text-zinc-500 mb-1 block">Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-zinc-300"
                    >
                        <option value="ALL">All Status</option>
                        <option value={VendorStatus.ACTIVE}>Active</option>
                        <option value={VendorStatus.INACTIVE}>Inactive</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm">
                {isLoading ? (
                    <div className="p-12 text-center text-zinc-500">Loading vendors...</div>
                ) : (
                    <>
                        <VendorTable
                            vendors={filteredVendors}
                            onEdit={openEditDialog}
                            onDelete={handleDelete}
                        />
                        {total > 10 && (
                            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm">
                                <span className="text-zinc-500">Showing {filteredVendors.length} of {total} vendors</span>
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

            <VendorDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleCreateOrUpdate}
                vendor={selectedVendor}
            />
        </div>
    );
}
