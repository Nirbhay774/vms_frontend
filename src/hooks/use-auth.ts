"use client";

import { useEffect, useState } from "react";
import { decodeJwt, JwtPayload } from "@/lib/jwt";

export interface AuthState {
    token: string | null;
    user: {
        id: string;
        email: string;
        role: string;
    } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                // Verify token expiry client-side if needed
                const payload = decodeJwt(token) as JwtPayload;

                if (payload && payload.exp * 1000 > Date.now()) {
                    setState({
                        token,
                        user: {
                            ...user,
                            role: payload.role || user.role, // Prefer role from JWT
                        },
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } else {
                    // Token expired
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setState((prev) => ({ ...prev, isLoading: false }));
                }
            } catch (e) {
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        } else {
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Clear cookie
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = "/login";
    };

    return { ...state, logout };
}
