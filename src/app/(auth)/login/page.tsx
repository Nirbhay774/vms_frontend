"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { api } from "@/services/api";
import { AuthData } from "@/types/auth";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const data = await api.post<AuthData>("/auth/login", { email, password });

            // Store transition data
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Set cookie for middleware access
            document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;

            // Role-based redirection
            if (data.user.role === "OPS" || data.user.role === "FINANCE" || data.user.role === "ADMIN") {
                router.push("/dashboard");
            } else {
                router.push("/");
            }

            router.refresh();
        } catch (err: any) {
            setError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                        Sign In
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Enter your email to access your account
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && <Alert message={error} type="error" />}

                    <div className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Sign In
                    </Button>
                </form>

                <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                    By clicking continue, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
