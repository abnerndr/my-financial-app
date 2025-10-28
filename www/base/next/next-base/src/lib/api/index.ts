import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type {
	AuthResponse,
	LoginRequest,
	MagicLinkRequest,
	NewPasswordRequest,
	RegisterRequest,
	ResetPasswordRequest,
	User,
	VerifyEmailRequest,
} from '@/types/auth';
import { getTokens, removeTokens, setTokens } from '../storage';

class ApiClient {
	private client: AxiosInstance;
	private isRefreshing = false;
	private failedQueue: Array<{
		resolve: (value?: unknown) => void;
		reject: (error?: unknown) => void;
	}> = [];

	constructor() {
		this.client = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
			timeout: 10000,
		});

		this.setupInterceptors();
	}

	private setupInterceptors() {
		// Request interceptor para adicionar token
		this.client.interceptors.request.use(
			(config) => {
				const tokens = getTokens();
				if (tokens?.accessToken) {
					config.headers.Authorization = `Bearer ${tokens.accessToken}`;
				}
				return config;
			},
			(error) => Promise.reject(error),
		);

		// Response interceptor para lidar com refresh token
		this.client.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest = error.config;

				if (error.response?.status === 401 && !originalRequest._retry) {
					if (this.isRefreshing) {
						return new Promise((resolve, reject) => {
							this.failedQueue.push({ resolve, reject });
						})
							.then(() => {
								return this.client(originalRequest);
							})
							.catch((err) => {
								return Promise.reject(err);
							});
					}

					originalRequest._retry = true;
					this.isRefreshing = true;

					try {
						const tokens = getTokens();
						if (tokens?.refreshToken) {
							const response = await this.refreshToken(tokens.refreshToken);
							setTokens(response.data);
							this.processQueue(null);
							return this.client(originalRequest);
						}
					} catch (refreshError) {
						this.processQueue(refreshError);
						removeTokens();
						window.location.href = '/auth/login';
						return Promise.reject(refreshError);
					} finally {
						this.isRefreshing = false;
					}
				}

				return Promise.reject(error);
			},
		);
	}

	private processQueue(error: unknown) {
		this.failedQueue.forEach(({ resolve, reject }) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});

		this.failedQueue = [];
	}

	private async refreshToken(refreshToken: string) {
		return this.client.post('/auth/refresh', { refreshToken });
	}

	// Auth methods
	async login(data: LoginRequest) {
		return this.client.post<AuthResponse>('/auth/login', data);
	}

	async register(data: RegisterRequest) {
		return this.client.post('/auth/register', data);
	}

	async sendMagicLink(data: MagicLinkRequest) {
		return this.client.post('/auth/magic-link', data);
	}

	async verifyMagicLink(token: string) {
		return this.client.get<AuthResponse>(`/auth/verify-magic-link?token=${token}`);
	}

	async forgotPassword(data: ResetPasswordRequest) {
		return this.client.post('/auth/forgot-password', data);
	}

	async resetPassword(data: NewPasswordRequest) {
		return this.client.post('/auth/reset-password', data);
	}

	async verifyEmail(data: VerifyEmailRequest) {
		return this.client.post('/auth/verify-email', data);
	}

	async logout() {
		return this.client.post('/auth/logout');
	}

	async getProfile() {
		return this.client.get<User>('/auth/profile');
	}

	// Generic methods
	async get<T = unknown>(url: string, config?: AxiosRequestConfig) {
		return this.client.get<T>(url, config);
	}

	async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
		return this.client.post<T>(url, data, config);
	}

	async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
		return this.client.put<T>(url, data, config);
	}

	async delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
		return this.client.delete<T>(url, config);
	}
}

export const apiClient = new ApiClient();
