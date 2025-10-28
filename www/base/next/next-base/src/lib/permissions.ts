import type { Permission, Role, User } from '@/types/auth';

export class PermissionValidator {
	private user: User | null;

	constructor(user: User | null) {
		this.user = user;
	}

	/**
	 * Verifica se o usuário tem uma permissão específica
	 */
	hasPermission(resource: string, action: string): boolean {
		if (!this.user || !this.user.roles) {
			return false;
		}

		return this.user.roles.some((role) =>
			role.permissions.some((permission) => permission.resource === resource && permission.action === action),
		);
	}

	/**
	 * Verifica se o usuário tem pelo menos uma das permissões fornecidas
	 */
	hasAnyPermission(permissions: Array<{ resource: string; action: string }>): boolean {
		return permissions.some(({ resource, action }) => this.hasPermission(resource, action));
	}

	/**
	 * Verifica se o usuário tem todas as permissões fornecidas
	 */
	hasAllPermissions(permissions: Array<{ resource: string; action: string }>): boolean {
		return permissions.every(({ resource, action }) => this.hasPermission(resource, action));
	}

	/**
	 * Verifica se o usuário tem um role específico
	 */
	hasRole(roleName: string): boolean {
		if (!this.user || !this.user.roles) {
			return false;
		}

		return this.user.roles.some((role) => role.name === roleName);
	}

	/**
	 * Verifica se o usuário tem pelo menos um dos roles fornecidos
	 */
	hasAnyRole(roleNames: string[]): boolean {
		return roleNames.some((roleName) => this.hasRole(roleName));
	}

	/**
	 * Verifica se o usuário tem todos os roles fornecidos
	 */
	hasAllRoles(roleNames: string[]): boolean {
		return roleNames.every((roleName) => this.hasRole(roleName));
	}

	/**
	 * Retorna todas as permissões do usuário
	 */
	getAllPermissions(): Permission[] {
		if (!this.user || !this.user.roles) {
			return [];
		}

		const permissions: Permission[] = [];
		this.user.roles.forEach((role) => {
			permissions.push(...role.permissions);
		});

		// Remove duplicadas
		const uniquePermissions = permissions.filter(
			(permission, index, array) =>
				array.findIndex((p) => p.resource === permission.resource && p.action === permission.action) === index,
		);

		return uniquePermissions;
	}

	/**
	 * Retorna todos os roles do usuário
	 */
	getAllRoles(): Role[] {
		return this.user?.roles || [];
	}

	/**
	 * Verifica se o usuário é proprietário de um recurso
	 */
	isOwner(resourceUserId: string): boolean {
		return this.user?.id === resourceUserId;
	}

	/**
	 * Verifica se o usuário pode acessar um recurso (é dono OU tem permissão)
	 */
	canAccess(resource: string, action: string, resourceUserId?: string): boolean {
		// Se tem a permissão, pode acessar
		if (this.hasPermission(resource, action)) {
			return true;
		}

		// Se é o dono do recurso, pode acessar
		if (resourceUserId && this.isOwner(resourceUserId)) {
			return true;
		}

		return false;
	}

	/**
	 * Verifica se o usuário é administrador
	 */
	isAdmin(): boolean {
		return this.hasRole('admin') || this.hasRole('administrator');
	}

	/**
	 * Verifica se o usuário é super admin
	 */
	isSuperAdmin(): boolean {
		return this.hasRole('super_admin') || this.hasRole('superadmin');
	}

	/**
	 * Atualiza o usuário atual
	 */
	updateUser(user: User | null): void {
		this.user = user;
	}
}

// Hook para usar o validador de permissões
export const usePermissions = (user: User | null) => {
	return new PermissionValidator(user);
};

// Constantes de permissões comuns
export const PERMISSIONS = {
	// Usuários
	USERS: {
		READ: { resource: 'users', action: 'read' },
		CREATE: { resource: 'users', action: 'create' },
		UPDATE: { resource: 'users', action: 'update' },
		DELETE: { resource: 'users', action: 'delete' },
	},
	// Posts
	POSTS: {
		READ: { resource: 'posts', action: 'read' },
		CREATE: { resource: 'posts', action: 'create' },
		UPDATE: { resource: 'posts', action: 'update' },
		DELETE: { resource: 'posts', action: 'delete' },
	},
	// Configurações
	SETTINGS: {
		READ: { resource: 'settings', action: 'read' },
		UPDATE: { resource: 'settings', action: 'update' },
	},
	// Dashboard
	DASHBOARD: {
		VIEW: { resource: 'dashboard', action: 'view' },
	},
} as const;

// Constantes de roles comuns
export const ROLES = {
	ADMIN: 'admin',
	USER: 'user',
	MODERATOR: 'moderator',
	SUPER_ADMIN: 'super_admin',
} as const;
