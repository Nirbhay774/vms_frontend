import { api } from "./api";
import { AuditFilters, AuditResponse } from "@/types/audit";

export const auditService = {
    /**
     * Fetch audit logs with optional filters
     */
    async getLogs(filters: AuditFilters = {}): Promise<AuditResponse> {
        const queryParams = new URLSearchParams();

        if (filters.resource) queryParams.append("resource", filters.resource);
        if (filters.resourceId) queryParams.append("resourceId", filters.resourceId);
        if (filters.user) queryParams.append("user", filters.user);
        if (filters.action) queryParams.append("action", filters.action);
        if (filters.page) queryParams.append("page", filters.page.toString());
        if (filters.limit) queryParams.append("limit", filters.limit.toString());

        const queryString = queryParams.toString();
        const endpoint = `/audit${queryString ? `?${queryString}` : ""}`;

        return api.get<AuditResponse>(endpoint);
    },
};
