import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authApi from '@/lib/api/auth';
import type { AuthTokens, User } from '@/types/auth';

interface AuthStore {
	// State
	user: User | null;
	tokens: AuthTokens | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;

	// Actions
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, name: string) => Promise<void>;
	loginWithGoogle: (credential: string) => Promise<void>;
	sendMagicLink: (email: string) => Promise<void>;
	verifyMagicLink: (token: string) => Promise<void>;
	resetPassword: (email: string) => Promise<void>;
	confirmResetPassword: (token: string, password: string) => Promise<void>;
	verifyEmail: (token: string) => Promise<void>;
	logout: () => Promise<void>;
	loadUser: () => Promise<void>;
	clearError: () => void;
	setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			// Initial state
			user: null,
			tokens: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,

			// Actions
			setLoading: (loading: boolean) => set({ isLoading: loading }),

			clearError: () => set({ error: null }),

			login: async (email: string, password: string) => {
				try {
					set({ isLoading: true, error: null });
					const response = await authApi.login({ email, password });

					if (response.data.success && response.data.data) {
						set({
							user: response.data.data.user,
							tokens: response.data.data,
							isAuthenticated: true,
							isLoading: false,
						});
					} else {
						throw new Error(response.data.message || 'Login failed');
					}
				} catch (error) {
					set({
						error: error instanceof Error ? error.message : 'Login failed',
						isLoading: false,
					});
					throw error;
				}
			},

			register: async (email: string, password: string, name: string) => {
				try {
					set({ isLoading: true, error: null });
					const response = await authApi.register({ email, password, name });

					if (response.data.success && response.data.data) {
						set({
							user: response.data.data.user,
							tokens: response.data.data,
							isAuthenticated: true,
							isLoading: false,
						});
					} else {
						throw new Error(response.data.message || 'Registration failed');
					}
				} catch (error) {
					set({
						error: error instanceof Error ? error.message : 'Registration failed',
						isLoading: false,
					});
					throw error;
				}
			},

			loginWithGoogle: async (credential: string) => {
				try {
					set({ isLoading: true, error: null });
					const response = await authApi.googleAuth(credential);

					if (response.data.success && response.data.data) {
						set({
							user: response.data.data.user,
							tokens: response.data.data,
							isAuthenticated: true,
							isLoading: false,
						});
					} else {
						throw new Error(response.data.message || 'Google login failed');
					}
				} catch (error) {
					set({
						error: error instanceof Error ? error.message : 'Google login failed',
						isLoading: false,
					});
					throw error;
				}
			},

			sendMagicLink: async (email: string) => {
				try {
					set({ isLoading: true, error: null });
					await authApi.magicLink({ email });
					set({ isLoading: false });
				} catch (error) {
					set({
						error: error instanceof Error ? error.message : 'Failed to send magic link',
						isLoading: false,
					});
					throw error;
				}
			},

			verifyMagicLink: async (token: string) => {
				try {
					set({ isLoading: true, error: null });
					const response = await authApi.verifyMagicLink(token);

					if (response.data.success && response.data.data) {
						set({
							user: response.data.data.user,
							tokens: response.data.data,
							isAuthenticated: true,
							isLoading: false,
						});
					} else {
						throw new Error(response.data.message || 'Magic link verification failed');
					}
				} catch (error) {
					set({
						error: error instanceof Error ? error.message : 'Magic link verification failed',
						isLoading: false,
					});
					throw error;
				}
			},

			resetPassword: async (email: string) => {
				try {
					set({ isLoading: true, error: null });
					await authApi.resetPassword({ email });
					set({ isLoading: false });
				} catch (error) {
					set({
						error: error instanceof Error ? error.message : 'Failed to send reset password email',
						isLoading: false,
					});
					throw error;
				}
			},

			confirmResetPassword: async (token: string, password: string) => {
				try {
					set({ isLoading: true, error: null });
					await authApi.resetPasswordConfirm({ token, password });
					set({ isLoading: false });
				} catch (error) {
					set({
						error: error instanceof Error ? error.message : 'Failed to reset password',
						isLoading: false,
					});
					throw error;
				}
			},

			verifyEmail: async (token: string) => {
				try {
					set({ isLoading: true, error: null });
					await authApi.verifyEmail({ token });
					set({ isLoading: false });
					// Reload user data to get updated emailVerified status
					get().loadUser();
				} catch (error) {
					set({
						error: error instanceof Error ? error.message : 'Email verification failed',
						isLoading: false,
					});
					throw error;
				}
			},

			logout: async () => {
				try {
					set({ isLoading: true });
					await authApi.logout();
				} catch (error) {
					console.error('Logout error:', error);
				} finally {
					set({
						user: null,
						tokens: null,
						isAuthenticated: false,
						isLoading: false,
						error: null,
					});
				}
			},

			loadUser: async () => {
				try {
					if (!authApi.isAuthenticated()) {
						return;
					}

					set({ isLoading: true });
					const response = await authApi.getProfile();

					if (response.data.success && response.data.data) {
						set({
							user: response.data.data,
							isAuthenticated: true,
							isLoading: false,
						});
					}
				} catch (error) {
					console.error('Load user error:', error);
					set({
						user: null,
						tokens: null,
						isAuthenticated: false,
						isLoading: false,
					});
				}
			},
		}),
		{
			name: 'auth-storage',
			partialize: (state) => ({
				user: state.user,
				tokens: state.tokens,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);
