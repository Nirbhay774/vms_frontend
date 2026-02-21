export enum PayoutStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    APPROVED = "APPROVED",
    PENDING = "PENDING",
    PROCESSED = "PROCESSED",
    REJECTED = "REJECTED",
}

export interface Payout {
    _id: string;
    vendor: string | { _id: string; name: string };
    amount: number;
    currency: string;
    status: PayoutStatus;
    description?: string;
    rejectionReason?: string;
    createdBy: string;
    approvedBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePayoutDto {
    vendor: string;
    amount: number;
    currency?: string;
    description?: string;
}

export interface PayoutAudit {
    _id: string;
    payoutId: string;
    action: string;
    performedBy: string;
    oldStatus?: PayoutStatus;
    newStatus: PayoutStatus;
    comments?: string;
    createdAt: string;
}
