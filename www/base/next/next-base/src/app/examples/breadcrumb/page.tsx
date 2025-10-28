'use client';

import { HomeIcon } from 'lucide-react';
import { BreadcrumbBase } from '@/components/common/breadcrumb-base';

export default function BreadcrumbPage() {
	return (
		<div className="w-full px-10 mx-auto h-screen flex justify-center flex-col gap-y-6 items-center my-10">
			<BreadcrumbBase.Simple
				separatorType="slash"
				items={[
					{ label: 'Home', href: '/', icon: HomeIcon, isCurrentPage: false },
					{ label: 'Category', href: '/category', isCurrentPage: false },
					{ label: 'Subcategory', href: '/category/subcategory', isCurrentPage: false },
					{
						label: 'Current Page',
						isCurrentPage: true,
						href: '/category/subcategory/current-page',
					},
				]}
			/>
			<BreadcrumbBase.Label
				separatorType="dot"
				items={[
					{ label: 'Home', href: '/', icon: HomeIcon, isCurrentPage: false },
					{ label: 'Category', href: '/category', isCurrentPage: false },
					{ label: 'Subcategory', href: '/category/subcategory', isCurrentPage: false },
					{
						label: 'Current Page',
						isCurrentPage: true,
						href: '/category/subcategory/current-page',
					},
				]}
			/>
		</div>
	);
}
