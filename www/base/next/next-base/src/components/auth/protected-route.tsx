import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/permissions';
import { useAuthStore } from '@/lib/stores/auth';
import type { RoutePermission } from '@/types/api';

interface ProtectedRouteProps {
	children: React.ReactNode;
	permissions?: RoutePermission[];
	roles?: string[];
	fallback?: React.ReactNode;
	redirectTo?: string;
	requireAuth?: boolean;
}

export function ProtectedRoute({
	children,
	permissions = [],
	roles = [],
	fallback = <div>Você não tem permissão para acessar esta página.</div>,
	redirectTo = '/auth/login',
	requireAuth = true,
}: ProtectedRouteProps) {
	const router = useRouter();
	const { user, isAuthenticated, isLoading } = useAuthStore();
	const permissionValidator = usePermissions(user);

	useEffect(() => {
		if (!isLoading) {
			// Se requer autenticação e não está autenticado
			if (requireAuth && !isAuthenticated) {
				router.push(redirectTo);
				return;
			}

			// Se está autenticado mas não tem as permissões necessárias
			if (isAuthenticated && (permissions.length > 0 || roles.length > 0)) {
				const hasRequiredPermissions =
					permissions.length === 0 ||
					permissions.some((permission) =>
						permissionValidator.hasPermission(permission.resource, permission.action),
					);

				const hasRequiredRoles =
					roles.length === 0 || permissionValidator.hasAnyRole(roles);

				if (!hasRequiredPermissions || !hasRequiredRoles) {
					// Se tem redirectTo personalizado, redireciona, senão mostra fallback
					if (redirectTo !== '/auth/login') {
						router.push(redirectTo);
						
					}
				}
			}
		}
	}, [
		isLoading,
		isAuthenticated,
		permissions,
		roles,
		redirectTo,
		requireAuth,
		router,
		permissionValidator,
	]);

	// Mostra loading durante verificação
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	// Se requer autenticação e não está autenticado
	if (requireAuth && !isAuthenticated) {
		return null; // Vai redirecionar no useEffect
	}

	// Se está autenticado, verifica permissões
	if (isAuthenticated && (permissions.length > 0 || roles.length > 0)) {
		const hasRequiredPermissions =
			permissions.length === 0 ||
			permissions.some((permission) =>
				permissionValidator.hasPermission(permission.resource, permission.action),
			);

		const hasRequiredRoles = roles.length === 0 || permissionValidator.hasAnyRole(roles);

		if (!hasRequiredPermissions || !hasRequiredRoles) {
			return <>{fallback}</>;
		}
	}

	return <>{children}</>;
}

// Componente para proteger elementos dentro da página
interface ProtectedComponentProps {
	children: React.ReactNode;
	permissions?: Array<{ resource: string; action: string }>;
	roles?: string[];
	fallback?: React.ReactNode;
	userId?: string; // Para verificar se é o dono do recurso
}

export function ProtectedComponent({
	children,
	permissions = [],
	roles = [],
	fallback = null,
	userId,
}: ProtectedComponentProps) {
	const { user } = useAuthStore();
	const permissionValidator = usePermissions(user);

	if (!user) {
		return <>{fallback}</>;
	}

	// Verifica permissões
	const hasRequiredPermissions =
		permissions.length === 0 ||
		permissions.some((permission) =>
			permissionValidator.canAccess(permission.resource, permission.action, userId),
		);

	// Verifica roles
	const hasRequiredRoles = roles.length === 0 || permissionValidator.hasAnyRole(roles);

	if (!hasRequiredPermissions || !hasRequiredRoles) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}

// Hook para usar dentro de componentes
export function useAuth() {
	const authStore = useAuthStore();
	const permissionValidator = usePermissions(authStore.user);

	return {
		...authStore,
		permissions: permissionValidator,
	};
}

// Hook para verificar se tem permissão específica
export function useHasPermission(resource: string, action: string, userId?: string) {
	const { user } = useAuthStore();
	const permissionValidator = usePermissions(user);

	return permissionValidator.canAccess(resource, action, userId);
}

// Hook para verificar se tem role específico
export function useHasRole(role: string | string[]) {
	const { user } = useAuthStore();
	const permissionValidator = usePermissions(user);

	if (Array.isArray(role)) {
		return permissionValidator.hasAnyRole(role);
	}

	return permissionValidator.hasRole(role);
}
