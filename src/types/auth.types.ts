

export interface User{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    phoneVerified: boolean;
    isActive: boolean;
    role: string;
}
export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}