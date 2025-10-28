import { useAuth } from '@/contexts/auth-context';
import { useMemo } from 'react';
import { AuthHelper } from '@/lib/auth';

export const usePermissions = () => {
	const { user } = useAuth();

	const permissions = useMemo(() => {
		return {
			hasPermission: (permission: string) => AuthHelper.hasPermission(user, permission),
			hasAnyPermission: (permissions: string[]) =>
				AuthHelper.hasAnyPermission(user, permissions),
			hasAllPermissions: (permissions: string[]) =>
				AuthHelper.hasAllPermissions(user, permissions),
			canAccessResource: (resource: string, action: string) =>
				AuthHelper.canAccessResource(user, resource, action),
		};
	}, [user]);

	return permissions;
};
