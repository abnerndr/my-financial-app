import { useMemo } from 'react';
import { AuthHelper } from '../lib/auth';
import { useAuth } from './use-auth';

export const useRoles = () => {
	const { user } = useAuth();

	const roles = useMemo(() => {
		return {
			hasRole: (role: string) => AuthHelper.hasRole(user, role),
			hasAnyRole: (roles: string[]) => AuthHelper.hasAnyRole(user, roles),
			userRoles: user?.roles?.map((role) => role.name) || [],
		};
	}, [user]);

	return roles;
};
