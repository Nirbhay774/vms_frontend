import { api } from "./api";
import { Payout, CreatePayoutDto, PayoutStatus } from "@/types/payout";

export const payoutService = {
    /**
     * Fetch all payouts with pagination
     */
    async getPayouts(page = 1, limit = 10) {
        return api.get<{ payouts: Payout[]; total: number }>(
            `/payouts?page=${page}&limit=${limit}`
        );
    },

    /**
     * Fetch a single payout by ID
     */
    async getPayoutById(id: string) {
        return api.get<Payout>(`/payouts/${id}`);
    },

    /**
     * Create a new payout
     */
    async createPayout(data: CreatePayoutDto) {
        return api.post<Payout>("/payouts/draft", data);
    },

    /**
     * Submit a draft payout
     */
    async submitPayout(id: string) {
        return api.post<Payout>(`/payouts/${id}/submit`, {});
    },

    /**
     * Approve a payout (Finance/Admin only)
     */
    async approvePayout(id: string) {
        return api.post<Payout>(`/payouts/${id}/approve`, {});
    },

    /**
     * Reject a payout (Finance/Admin only)
     */
    async rejectPayout(id: string, reason: string) {
        return api.post<Payout>(`/payouts/${id}/reject`, { reason });
    },

    /**
     * Fetch audit logs for a payout
     */
    async getPayoutAudits(id: string) {
        return api.get<any[]>(`/audit?resourceId=${id}`);
    },
};
