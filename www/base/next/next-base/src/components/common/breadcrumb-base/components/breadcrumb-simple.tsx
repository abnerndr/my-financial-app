'use client';

import { Fragment } from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import type { IconProps } from '@/types/icons';

export type BreadcrumbItemType = {
	label: string;
	href: string;
	icon?: IconProps;
	isCurrentPage: boolean;
};

export interface BreadcrumbSimpleProps {
	separatorType?: 'bar' | 'slash' | 'arrow' | 'dot';
	items: BreadcrumbItemType[];
}

const breadcrumbSeparators = {
	bar: ' | ',
	slash: ' / ',
	arrow: ' → ',
	dot: ' • ',
};

export function BreadcrumbSimple({
	separatorType = 'dot',
	items,
}: BreadcrumbSimpleProps) {
	const separator = breadcrumbSeparators[separatorType];
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{items.map((item, index) => (
					<Fragment key={item.label}>
						<BreadcrumbItem>
							<BreadcrumbLink href={item.href}>
								{item.icon && <item.icon size={16} aria-hidden="true" />}
								<span className={cn(index === 0 && 'sr-only')}>{item.label}</span>
							</BreadcrumbLink>
						</BreadcrumbItem>
						{index < items.length - 1 && (
							<BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
						)}
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
