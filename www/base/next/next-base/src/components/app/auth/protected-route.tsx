'use client';

import { useAuth } from '@/contexts/auth-context';
import type React from 'react';
import { type ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePermissions } from '@/hooks/use-permissions';
import { useRoles } from '@/hooks/use-roles';

interface ProtectedRouteProps {
	children: ReactNode;
	roles?: string[];
	permissions?: string[];
	requireAll?: boolean; // Se true, requer todas as permissões/roles. Se false, requer pelo menos uma
	fallback?: ReactNode;
	redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	roles = [],
	permissions = [],
	requireAll = false,
	fallback = <div className="p-4 text-center text-red-600">Access Denied</div>,
	redirectTo = '/auth/login',
}) => {
	const { loading, isAuthenticated } = useAuth();
	const { hasRole, hasAnyRole } = useRoles();
	const { hasAnyPermission, hasAllPermissions } = usePermissions();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push(redirectTo);
		}
	}, [loading, isAuthenticated, router, redirectTo]);

	if (loading) {
		return <div>Carregando...</div>;
	}

	if (!isAuthenticated) {
		return null; // Will redirect
	}

	// Check roles
	if (roles.length > 0) {
		const roleCheck = requireAll
			? roles.every((role) => hasRole(role))
			: hasAnyRole(roles);

		if (!roleCheck) {
			return <>{fallback}</>;
		}
	}

	// Check permissions
	if (permissions.length > 0) {
		const permissionCheck = requireAll
			? hasAllPermissions(permissions)
			: hasAnyPermission(permissions);

		if (!permissionCheck) {
			return <>{fallback}</>;
		}
	}

	return <>{children}</>;
};

export default ProtectedRoute;
