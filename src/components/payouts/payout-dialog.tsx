"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreatePayoutDto } from "@/types/payout";
import { vendorService } from "@/services/vendor";
import { Vendor } from "@/types/vendor";

interface PayoutDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreatePayoutDto) => Promise<void>;
}

export function PayoutDialog({ isOpen, onClose, onSubmit }: PayoutDialogProps) {
    const [formData, setFormData] = useState<CreatePayoutDto>({
        vendor: "",
        amount: 0,
        currency: "USD",
        description: "",
    });
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Fetch active vendors to populate the dropdown
            vendorService.getVendors(1, 100).then((res) => {
                setVendors(res.vendors.filter(v => v.status === "ACTIVE"));
            });
            // Reset form
            setFormData({
                vendor: "",
                amount: 0,
                currency: "USD",
                description: "",
            });
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "amount" ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.vendor) {
            alert("Please select a vendor");
            return;
        }
        setIsLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Payout Request"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Vendor</label>
                    <select
                        name="vendor"
                        value={formData.vendor}
                        onChange={handleChange}
                        required
                        className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-zinc-300"
                    >
                        <option value="">Select a vendor...</option>
                        {vendors.map((v) => (
                            <option key={v._id} value={v._id}>
                                {v.name} ({v.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Currency</label>
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-zinc-300"
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="INR">INR</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-zinc-300"
                        placeholder="What is this payout for?"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Create Payout
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
