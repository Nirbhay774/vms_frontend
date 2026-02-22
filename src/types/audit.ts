import { User } from "./auth";

export interface Audit {
    id: string;
    _id?: string;
    action: string;
    resource: string;
    resourceId: string;
    user: Partial<User>;
    oldState?: any;
    newState?: any;
    ipAddress?: string;
    createdAt: string;
}

export interface AuditFilters {
    resource?: string;
    resourceId?: string;
    user?: string;
    action?: string;
    page?: number;
    limit?: number;
}

export interface AuditResponse {
    logs: Audit[];
    total: number;
    page: number;
    limit: number;
}
