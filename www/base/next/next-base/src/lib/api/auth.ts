import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import Cookies from 'js-cookie';
import type { ApiResponse } from '@/types/api';
import type {
	AuthResponse,
	AuthTokens,
	LoginCredentials,
	MagicLinkRequest,
	RefreshTokenRequest,
	RegisterCredentials,
	ResetPasswordConfirm,
	ResetPasswordRequest,
	User,
	VerifyEmailRequest,
} from '@/types/auth';

class AuthApiService {
	private api: AxiosInstance;
	private readonly baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
	private readonly tokenKey = 'auth_tokens';

	constructor() {
		this.api = axios.create({
			baseURL: `${this.baseURL}/api/auth`,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		this.setupInterceptors();
	}

	private setupInterceptors(): void {
		// Request interceptor - adiciona token
		this.api.interceptors.request.use(
			(config) => {
				const tokens = this.getTokens();
				if (tokens?.accessToken) {
					config.headers.Authorization = `Bearer ${tokens.accessToken}`;
				}
				return config;
			},
			(error) => Promise.reject(error),
		);

		// Response interceptor - trata refresh token
		this.api.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest = error.config;

				if (error.response?.status === 401 && !originalRequest._retry) {
					originalRequest._retry = true;

					try {
						const tokens = this.getTokens();
						if (tokens?.refreshToken) {
							const newTokens = await this.refreshToken({
								refreshToken: tokens.refreshToken,
							});
							if (newTokens.data.success && newTokens.data.data) {
								this.setTokens(newTokens.data.data);
								originalRequest.headers.Authorization = `Bearer ${newTokens.data.data.accessToken}`;
								return this.api(originalRequest);
							}
						}
					} catch (refreshError) {
						this.clearTokens();
						window.location.href = '/auth/login';
						return Promise.reject(refreshError);
					}
				}

				return Promise.reject(error);
			},
		);
	}

	private setTokens(tokens: AuthTokens): void {
		Cookies.set(this.tokenKey, JSON.stringify(tokens), {
			expires: 7, // 7 dias
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
		});
	}

	private getTokens(): AuthTokens | null {
		try {
			const tokens = Cookies.get(this.tokenKey);
			return tokens ? JSON.parse(tokens) : null;
		} catch {
			return null;
		}
	}

	private clearTokens(): void {
		Cookies.remove(this.tokenKey);
	}

	// Auth methods
	async login(
		credentials: LoginCredentials,
	): Promise<AxiosResponse<ApiResponse<AuthResponse>>> {
		const response = await this.api.post<ApiResponse<AuthResponse>>(
			'/login',
			credentials,
		);
		if (response.data.success && response.data.data) {
			this.setTokens(response.data.data);
		}
		return response;
	}

	async register(
		credentials: RegisterCredentials,
	): Promise<AxiosResponse<ApiResponse<AuthResponse>>> {
		const response = await this.api.post<ApiResponse<AuthResponse>>(
			'/register',
			credentials,
		);
		if (response.data.success && response.data.data) {
			this.setTokens(response.data.data);
		}
		return response;
	}

	async googleAuth(
		credential: string,
	): Promise<AxiosResponse<ApiResponse<AuthResponse>>> {
		const response = await this.api.post<ApiResponse<AuthResponse>>('/google', {
			credential,
		});
		if (response.data.success && response.data.data) {
			this.setTokens(response.data.data);
		}
		return response;
	}

	async magicLink(
		request: MagicLinkRequest,
	): Promise<AxiosResponse<ApiResponse<{ message: string }>>> {
		return this.api.post<ApiResponse<{ message: string }>>('/magic-link', request);
	}

	async verifyMagicLink(
		token: string,
	): Promise<AxiosResponse<ApiResponse<AuthResponse>>> {
		const response = await this.api.post<ApiResponse<AuthResponse>>(
			'/magic-link/verify',
			{ token },
		);
		if (response.data.success && response.data.data) {
			this.setTokens(response.data.data);
		}
		return response;
	}

	async resetPassword(
		request: ResetPasswordRequest,
	): Promise<AxiosResponse<ApiResponse<{ message: string }>>> {
		return this.api.post<ApiResponse<{ message: string }>>('/reset-password', request);
	}

	async resetPasswordConfirm(
		request: ResetPasswordConfirm,
	): Promise<AxiosResponse<ApiResponse<{ message: string }>>> {
		return this.api.post<ApiResponse<{ message: string }>>(
			'/reset-password/confirm',
			request,
		);
	}

	async verifyEmail(
		request: VerifyEmailRequest,
	): Promise<AxiosResponse<ApiResponse<{ message: string }>>> {
		return this.api.post<ApiResponse<{ message: string }>>('/verify-email', request);
	}

	async refreshToken(
		request: RefreshTokenRequest,
	): Promise<AxiosResponse<ApiResponse<AuthTokens>>> {
		return this.api.post<ApiResponse<AuthTokens>>('/refresh', request);
	}

	async logout(): Promise<AxiosResponse<ApiResponse<{ message: string }>>> {
		try {
			const response = await this.api.post<ApiResponse<{ message: string }>>('/logout');
			return response;
		} finally {
			this.clearTokens();
		}
	}

	async getProfile(): Promise<AxiosResponse<ApiResponse<User>>> {
		return this.api.get<ApiResponse<User>>('/profile');
	}

	// Utility methods
	isAuthenticated(): boolean {
		const tokens = this.getTokens();
		return !!tokens?.accessToken;
	}

	getCurrentTokens(): AuthTokens | null {
		return this.getTokens();
	}

	clearAuthData(): void {
		this.clearTokens();
	}
}

export const authApi = new AuthApiService();
export default authApi;
