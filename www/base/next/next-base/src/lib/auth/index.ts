import type { User } from '@/types/auth';

export class AuthHelper {
	static hasRole(user: User | null, role: string): boolean {
		if (!user || !user.roles) return false;
		return user.roles.some((r) => r.name === role);
	}

	static hasAnyRole(user: User | null, roles: string[]): boolean {
		if (!user || !user.roles) return false;
		return roles.some((role) => AuthHelper.hasRole(user, role));
	}

	static hasPermission(user: User | null, permission: string): boolean {
		if (!user || !user.roles) return false;

		const userPermissions = user.roles
			.flatMap((role) => role.permissions)
			.map((p) => p.name);

		return userPermissions.includes(permission);
	}

	static hasAnyPermission(user: User | null, permissions: string[]): boolean {
		if (!user || !user.roles) return false;
		return permissions.some((permission) => AuthHelper.hasPermission(user, permission));
	}

	static hasAllPermissions(user: User | null, permissions: string[]): boolean {
		if (!user || !user.roles) return false;
		return permissions.every((permission) => AuthHelper.hasPermission(user, permission));
	}

	static canAccessResource(user: User | null, resource: string, action: string): boolean {
		if (!user || !user.roles) return false;

		return user.roles.some((role) =>
			role.permissions.some((p) => p.resource === resource && p.action === action),
		);
	}
}
