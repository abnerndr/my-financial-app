import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import authApi from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth';
import type { Permission } from '@/types/auth';

// Query keys
export const authKeys = {
	all: ['auth'] as const,
	user: () => [...authKeys.all, 'user'] as const,
	profile: () => [...authKeys.all, 'profile'] as const,
} as const;

// Hook para obter o perfil do usuário
export function useProfile() {
	const { isAuthenticated } = useAuthStore();

	return useQuery({
		queryKey: authKeys.profile(),
		queryFn: async () => {
			const response = await authApi.getProfile();
			if (response.data.success && response.data.data) {
				return response.data.data;
			}
			throw new Error(response.data.message || 'Failed to fetch profile');
		},
		enabled: isAuthenticated,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

// Hook para logout com invalidação de cache
export function useLogout() {
	const queryClient = useQueryClient();
	const { logout } = useAuthStore();

	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			// Limpar todas as queries relacionadas à autenticação
			queryClient.removeQueries({ queryKey: authKeys.all });
			// Limpar todo o cache se necessário
			queryClient.clear();
		},
	});
}

// Hook para login com cache
export function useLogin() {
	const queryClient = useQueryClient();
	const { login } = useAuthStore();

	return useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) =>
			login(email, password),
		onSuccess: () => {
			// Invalidar queries relacionadas ao usuário
			queryClient.invalidateQueries({ queryKey: authKeys.all });
		},
	});
}

// Hook para registro com cache
export function useRegister() {
	const queryClient = useQueryClient();
	const { register } = useAuthStore();

	return useMutation({
		mutationFn: ({
			email,
			password,
			name,
		}: {
			email: string;
			password: string;
			name: string;
		}) => register(email, password, name),
		onSuccess: () => {
			// Invalidar queries relacionadas ao usuário
			queryClient.invalidateQueries({ queryKey: authKeys.all });
		},
	});
}

// Hook para verificar se o usuário tem permissão para uma query específica
export function usePermissionQuery<T>(
	queryKey: unknown[],
	queryFn: () => Promise<T>,
	permission: { resource: string; action: string },
	options: { enabled?: boolean } = {},
) {
	const { user } = useAuthStore();
	const hasPermission =
		user?.roles?.some((role: { permissions: Permission[] }) =>
			role.permissions.some(
				(p) => p.resource === permission.resource && p.action === permission.action,
			),
		) ?? false;

	return useQuery({
		queryKey,
		queryFn,
		enabled: hasPermission && (options.enabled ?? true),
	});
}

// Hook genérico para queries protegidas
export function useProtectedQuery<T>(
	queryKey: unknown[],
	queryFn: () => Promise<T>,
	options: { enabled?: boolean; requireAuth?: boolean } = {},
) {
	const { isAuthenticated } = useAuthStore();
	const { requireAuth = true, enabled = true } = options;

	return useQuery({
		queryKey,
		queryFn,
		enabled: (!requireAuth || isAuthenticated) && enabled,
	});
}

// Hook para mutations protegidas
export function useProtectedMutation<TData, TVariables>(
	mutationFn: (variables: TVariables) => Promise<TData>,
	options: {
		onSuccess?: (data: TData, variables: TVariables) => void;
		onError?: (error: Error, variables: TVariables) => void;
		requireAuth?: boolean;
	} = {},
) {
	const { isAuthenticated } = useAuthStore();
	const { requireAuth = true, ...mutationOptions } = options;

	return useMutation({
		mutationFn: (variables: TVariables) => {
			if (requireAuth && !isAuthenticated) {
				throw new Error('Authentication required');
			}
			return mutationFn(variables);
		},
		...mutationOptions,
	});
}
