import type { AuthTokens } from '@/types/auth';

const TOKEN_KEY = 'auth-tokens';

export const setTokens = (tokens: AuthTokens): void => {
	if (typeof window !== 'undefined') {
		localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
	}
};

export const getTokens = (): AuthTokens | null => {
	if (typeof window !== 'undefined') {
		const tokens = localStorage.getItem(TOKEN_KEY);
		return tokens ? JSON.parse(tokens) : null;
	}
	return null;
};

export const removeTokens = (): void => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem(TOKEN_KEY);
	}
};
