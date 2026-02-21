"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Vendor, CreateVendorDto, VendorStatus } from "@/types/vendor";

interface VendorDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    vendor?: Vendor | null;
}

export function VendorDialog({ isOpen, onClose, onSubmit, vendor }: VendorDialogProps) {
    const [formData, setFormData] = useState<CreateVendorDto>({
        name: "",
        email: "",
        taxId: "",
        bankDetails: {
            accountName: "",
            accountNumber: "",
            bankName: "",
            ifscCode: "",
        },
        status: VendorStatus.ACTIVE,
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (vendor) {
            setFormData({
                name: vendor.name,
                email: vendor.email,
                taxId: vendor.taxId,
                bankDetails: { ...vendor.bankDetails },
                status: vendor.status,
            });
        } else {
            setFormData({
                name: "",
                email: "",
                taxId: "",
                bankDetails: {
                    accountName: "",
                    accountNumber: "",
                    bankName: "",
                    ifscCode: "",
                },
                status: VendorStatus.ACTIVE,
            });
        }
    }, [vendor, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev: any) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            title={vendor ? "Edit Vendor" : "Add Vendor"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <Input
                    label="Tax ID (PAN/VAT)"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    required
                />
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold border-b pb-1">Bank Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Account Name"
                            name="bankDetails.accountName"
                            value={formData.bankDetails.accountName}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Account Number"
                            name="bankDetails.accountNumber"
                            value={formData.bankDetails.accountNumber}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Bank Name"
                            name="bankDetails.bankName"
                            value={formData.bankDetails.bankName}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="IFSC Code"
                            name="bankDetails.ifscCode"
                            value={formData.bankDetails.ifscCode}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-zinc-300"
                    >
                        <option value={VendorStatus.ACTIVE}>Active</option>
                        <option value={VendorStatus.INACTIVE}>Inactive</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {vendor ? "Update Vendor" : "Create Vendor"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
