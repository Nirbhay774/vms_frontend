export interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'VENDOR' | 'OPS' | 'FINANCE';
    name?: string;
}

export interface AuthData {
    token: string;
    user: User;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface ApiError {
    success: boolean;
    message: string;
    error?: string | any;
}
