export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
	statusCode: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface QueryParams {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
	filters?: Record<string, unknown>;
}

export interface TableColumn<T> {
	id: keyof T;
	header: string;
	accessorKey: keyof T;
	cell?: (value: T[keyof T]) => React.ReactNode;
	sortable?: boolean;
	filterable?: boolean;
}

export interface RoutePermission {
	resource: string;
	action: string;
	requiredRoles?: string[];
}

export interface ProtectedRouteProps {
	children: React.ReactNode;
	permissions?: RoutePermission[];
	fallback?: React.ReactNode;
	redirectTo?: string;
}
