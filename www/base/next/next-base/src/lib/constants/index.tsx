export const API_ENDPOINTS = {
	// Auth
	LOGIN: '/auth/login',
	REGISTER: '/auth/register',
	LOGOUT: '/auth/logout',
	REFRESH: '/auth/refresh',
	PROFILE: '/auth/profile',
	FORGOT_PASSWORD: '/auth/forgot-password',
	RESET_PASSWORD: '/auth/reset-password',
	VERIFY_EMAIL: '/auth/verify-email',
	MAGIC_LINK: '/auth/magic-link',
	VERIFY_MAGIC_LINK: '/auth/verify-magic-link',
	GOOGLE_AUTH: '/auth/google',

	// Users
	USERS: '/users',
	ADMIN_USERS: '/admin/users',
} as const;

export const ROUTES = {
	HOME: '/',
	LOGIN: '/auth/login',
	REGISTER: '/auth/register',
	DASHBOARD: '/dashboard',
	ADMIN_USERS: '/admin/users',
	FORGOT_PASSWORD: '/auth/forgot-password',
	RESET_PASSWORD: '/auth/reset-password',
	VERIFY_EMAIL: '/auth/verify-email',
	MAGIC_LINK: '/auth/magic-link',
} as const;

export const ROLES = {
	ADMIN: 'admin',
	MANAGER: 'manager',
	USER: 'user',
} as const;

export const PERMISSIONS = {
	USERS_READ: 'users:read',
	USERS_CREATE: 'users:create',
	USERS_UPDATE: 'users:update',
	USERS_DELETE: 'users:delete',
	ADMIN_ACCESS: 'admin:access',
} as const;
