import { ApiError, ApiResponse } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

/**
 * Custom error class for API failures to provide structured error data
 */
export class ApiRequestError extends Error {
    public status: number;
    public success: boolean;
    public details: any;

    constructor(message: string, status: number, success: boolean, details?: any) {
        super(message);
        this.name = "ApiRequestError";
        this.status = status;
        this.success = success;
        this.details = details;
    }
}

/**
 * Reusable fetch wrapper for API calls
 */
export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers = new Headers(options.headers);

    // Set default headers
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Handle No Content (204)
    if (response.status === 204) {
        return {} as T;
    }

    let data;
    try {
        data = await response.json();
    } catch (err) {
        throw new ApiRequestError(
            "Failed to parse response",
            response.status,
            false
        );
    }

    if (!response.ok) {
        const errorData = data as ApiError;
        throw new ApiRequestError(
            errorData.message || "An unexpected error occurred",
            response.status,
            errorData.success || false,
            errorData.error
        );
    }

    // Standard backend response structure: { success: boolean, message: string, data: T }
    return (data as ApiResponse<T>).data;
}

/**
 * API client methods
 */
export const api = {
    get: <T>(endpoint: string, options?: RequestInit) =>
        apiRequest<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: "POST",
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),

    put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: "PUT",
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),

    patch: <T>(endpoint: string, body?: any, options?: RequestInit) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),

    delete: <T>(endpoint: string, options?: RequestInit) =>
        apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};
