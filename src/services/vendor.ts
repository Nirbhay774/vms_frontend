import { api } from "./api";
import { Vendor, CreateVendorDto, UpdateVendorDto } from "@/types/vendor";

export const vendorService = {
    /**
     * Fetch all vendors with pagination
     */
    async getVendors(page = 1, limit = 10) {
        return api.get<{ vendors: Vendor[]; total: number }>(
            `/vendors?page=${page}&limit=${limit}`
        );
    },

    /**
     * Fetch a single vendor by ID
     */
    async getVendorById(id: string) {
        return api.get<Vendor>(`/vendors/${id}`);
    },

    /**
     * Create a new vendor
     */
    async createVendor(data: CreateVendorDto) {
        return api.post<Vendor>("/vendors", data);
    },

    /**
     * Update an existing vendor
     */
    async updateVendor(id: string, data: UpdateVendorDto) {
        return api.patch<Vendor>(`/vendors/${id}`, data);
    },

    /**
     * Soft delete / Deactivate a vendor
     */
    async deleteVendor(id: string) {
        return api.delete(`/vendors/${id}`);
    },
};
