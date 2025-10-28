'use client';

import React, {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import { apiClient } from '../lib/api';
import { getTokens, removeTokens, setTokens } from '../lib/storage';
import type { User } from '../types/auth';

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, name: string) => Promise<void>;
	logout: () => Promise<void>;
	sendMagicLink: (email: string) => Promise<void>;
	verifyMagicLink: (token: string) => Promise<void>;
	forgotPassword: (email: string) => Promise<void>;
	resetPassword: (token: string, password: string) => Promise<void>;
	verifyEmail: (token: string) => Promise<void>;
	isAuthenticated: boolean;
	refetchUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const isAuthenticated = !!user && !!getTokens();

	const refetchUser = React.useCallback(async () => {
		try {
			const tokens = getTokens();
			if (tokens?.accessToken) {
				const response = await apiClient.getProfile();
				setUser(response.data);
			}
		} catch (error) {
			console.error('Error fetching user:', error);
			removeTokens();
			setUser(null);
		}
	}, []);

	useEffect(() => {
		const initAuth = async () => {
			const tokens = getTokens();
			if (tokens?.accessToken) {
				await refetchUser();
			}
			setLoading(false);
		};

		initAuth();
	}, [refetchUser]);

	const login = async (email: string, password: string) => {
		const response = await apiClient.login({ email, password });
		const { accessToken, refreshToken, user: userData } = response.data;

		setTokens({
			accessToken,
			refreshToken,
		});
		setUser(userData);
	};

	const register = async (email: string, password: string, name: string) => {
		await apiClient.register({ email, password, name });
	};

	const logout = async () => {
		await apiClient.logout().finally(() => {
			removeTokens();
			setUser(null);
		});
	};

	const sendMagicLink = async (email: string) => {
		await apiClient.sendMagicLink({ email });
	};

	const verifyMagicLink = async (token: string) => {
		const response = await apiClient.verifyMagicLink(token);
		const { accessToken, refreshToken, user: userData } = response.data;

		setTokens({ accessToken, refreshToken });
		setUser(userData);
	};

	const forgotPassword = async (email: string) => {
		await apiClient.forgotPassword({ email });
	};

	const resetPassword = async (token: string, password: string) => {
		await apiClient.resetPassword({ token, password });
	};

	const verifyEmail = async (token: string) => {
		await apiClient.verifyEmail({ token });
		await refetchUser(); // Atualiza o status de verificação
	};

	const value: AuthContextType = {
		user,
		loading,
		login,
		register,
		logout,
		sendMagicLink,
		verifyMagicLink,
		forgotPassword,
		resetPassword,
		verifyEmail,
		isAuthenticated,
		refetchUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
