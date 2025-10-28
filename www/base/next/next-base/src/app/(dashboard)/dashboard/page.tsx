'use client';

import type React from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePermissions } from '@/lib/permissions';
import { useAuthStore } from '@/lib/stores/auth';

const DashboardPage: React.FC = () => {
	const { user } = useAuthStore();
	const permissions = usePermissions(user);

	return (
		<ProtectedRoute>
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<Card className="p-6">
							<h2 className="text-lg font-semibold mb-2">Welcome!</h2>
							<p className="text-gray-600">
								Hello {user?.name || user?.email}! Welcome to your dashboard.
							</p>
						</Card>

						<Card className="p-6">
							<h2 className="text-lg font-semibold mb-2">Your Roles</h2>
							<div className="space-y-1">
								{user?.roles?.map((role) => (
									<span
										key={role.id}
										className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1"
									>
										{role.name}
									</span>
								))}
							</div>
						</Card>

						{permissions.hasPermission('users', 'read') && (
							<Card className="p-6">
								<h2 className="text-lg font-semibold mb-2">User Management</h2>
								<p className="text-gray-600 mb-4">You have permission to view users.</p>
								<Link href="/admin/users">
									<Button size="sm">View Users</Button>
								</Link>
							</Card>
						)}
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default DashboardPage;
