export enum VendorStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export interface BankDetails {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
}

export interface Vendor {
    _id: string;
    name: string;
    email: string;
    bankDetails: BankDetails;
    taxId: string;
    status: VendorStatus;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateVendorDto {
    name: string;
    email: string;
    bankDetails: BankDetails;
    taxId: string;
    status?: VendorStatus;
}

export interface UpdateVendorDto extends Partial<CreateVendorDto> { }
