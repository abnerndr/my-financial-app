import { useAuth } from '@/contexts/auth-context';
import type React from 'react';
import type { ReactNode } from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import { useRoles } from '@/hooks/use-roles';

interface ConditionalRenderProps {
	children: ReactNode;
	roles?: string[];
	permissions?: string[];
	requireAll?: boolean;
	fallback?: ReactNode;
	requireAuth?: boolean;
}

const ConditionalRender: React.FC<ConditionalRenderProps> = ({
	children,
	roles = [],
	permissions = [],
	requireAll = false,
	fallback = null,
	requireAuth = true,
}) => {
	const { isAuthenticated } = useAuth();
	const { hasRole, hasAnyRole } = useRoles();
	const { hasAnyPermission, hasAllPermissions } = usePermissions();

	// Check authentication
	if (requireAuth && !isAuthenticated) {
		return <>{fallback}</>;
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

export default ConditionalRender;
