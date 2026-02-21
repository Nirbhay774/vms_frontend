"use client";

import React from "react";
import { Table, TableRow, TableCell } from "@/components/ui/table";
import { Vendor, VendorStatus } from "@/types/vendor";
import { Button } from "@/components/ui/button";

interface VendorTableProps {
    vendors: Vendor[];
    onEdit: (vendor: Vendor) => void;
    onDelete: (id: string) => void;
}

export function VendorTable({ vendors, onEdit, onDelete }: VendorTableProps) {
    return (
        <Table headers={["Name", "Email", "Tax ID", "Status", "Bank Details", "Actions"]}>
            {vendors.length === 0 ? (
                <TableRow>
                    <TableCell className="text-center italic text-zinc-500" colSpan={6}>
                        No vendors found.
                    </TableCell>
                </TableRow>
            ) : (
                vendors.map((vendor) => (
                    <TableRow key={vendor._id}>
                        <TableCell className="font-medium">{vendor.name}</TableCell>
                        <TableCell>{vendor.email}</TableCell>
                        <TableCell>{vendor.taxId}</TableCell>
                        <TableCell>
                            <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${vendor.status === VendorStatus.ACTIVE
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    }`}
                            >
                                {vendor.status}
                            </span>
                        </TableCell>
                        <TableCell>
                            <div className="text-xs">
                                <p>{vendor.bankDetails.bankName}</p>
                                <p className="text-zinc-500">{vendor.bankDetails.accountNumber}</p>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => onEdit(vendor)}>
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                    onClick={() => onDelete(vendor._id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))
            )}
        </Table>
    );
}
