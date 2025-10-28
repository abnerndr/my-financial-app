export interface User {
	id: string;
	email: string;
	name: string;
	emailVerified: boolean;
	isVerified: boolean;
	avatar?: string;
	roles: Role[];
	createdAt: string;
	updatedAt: string;
}

export interface Role {
	id: string;
	name: string;
	description?: string;
	permissions: Permission[];
}

export interface Permission {
	id: string;
	name: string;
	resource: string;
	action: string;
	description?: string;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
	expiresIn?: number;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials {
	email: string;
	password: string;
	name: string;
}

export interface MagicLinkRequest {
	email: string;
}

export interface ResetPasswordRequest {
	email: string;
}

export interface ResetPasswordConfirm {
	token: string;
	password: string;
}

export interface NewPasswordRequest {
	token: string;
	password: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	name: string;
}

export interface AuthResponse {
	user: User;
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
}

export interface AuthState {
	user: User | null;
	tokens: AuthTokens | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

export interface GoogleAuthResponse {
	credential: string;
}

export type AuthProvider = 'google' | 'email' | 'magic-link';

export interface VerifyEmailRequest {
	token: string;
}

export interface RefreshTokenRequest {
	refreshToken: string;
}
