import { api } from "./api";
import { DashboardStats } from "@/types/dashboard";

export const dashboardService = {
    /**
     * Fetch dashboard statistics
     */
    async getStats(): Promise<DashboardStats> {
        return api.get<DashboardStats>("/dashboard/stats");
    },
};
