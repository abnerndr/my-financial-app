import type React from 'react';
import type { ReactNode } from 'react';

interface LayoutProps {
	children: ReactNode;
	showHeader?: boolean;
}

const Header = () => {
	return (
		<header className="bg-white shadow-sm border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center">
						<h1 className="text-xl font-semibold text-gray-900">App</h1>
					</div>
				</div>
			</div>
		</header>
	);
};

const Layout: React.FC<LayoutProps> = ({ children, showHeader = true }) => {
	return (
		<div className="min-h-screen bg-gray-50">
			{showHeader && <Header />}
			<main>{children}</main>
		</div>
	);
};

export default Layout;
