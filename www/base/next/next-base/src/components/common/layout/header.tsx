import { useAuth } from '@/contexts/auth-context';
import type React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRoles } from '@/hooks/use-roles';

const Header: React.FC = () => {
	const { user, logout, isAuthenticated } = useAuth();
	const { hasRole } = useRoles();

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	return (
		<header className="bg-white shadow-sm border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center">
						<Link href="/" className="text-xl font-bold text-gray-900">
							Your App
						</Link>
					</div>

					<nav className="hidden md:flex space-x-8">
						{isAuthenticated && (
							<>
								<Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
									Dashboard
								</Link>
								{hasRole('admin') && (
									<Link href="/admin/users" className="text-gray-700 hover:text-gray-900">
										Admin
									</Link>
								)}
							</>
						)}
					</nav>

					<div className="flex items-center space-x-4">
						{isAuthenticated ? (
							<>
								<span className="text-sm text-gray-700">
									Hello, {user?.name || user?.email}
								</span>
								<Button onClick={handleLogout} variant="outline" size="sm">
									Logout
								</Button>
							</>
						) : (
							<>
								<Link href="/auth/login">
									<Button variant="ghost" size="sm">
										Login
									</Button>
								</Link>
								<Link href="/auth/register">
									<Button size="sm">Register</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
