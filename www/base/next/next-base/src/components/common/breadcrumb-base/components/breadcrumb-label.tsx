import { Fragment } from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import type { BreadcrumbItemType } from './breadcrumb-simple';

export interface BreadcrumbLabelProps {
	separatorType?: 'bar' | 'slash' | 'arrow' | 'dot';
	items: BreadcrumbItemType[];
}

const breadcrumbSeparators = {
	bar: ' | ',
	slash: ' / ',
	arrow: ' > ',
	dot: ' • ',
};

export function BreadcrumbLabel({ separatorType = 'dot', items }: BreadcrumbLabelProps) {
	const separator = breadcrumbSeparators[separatorType];
	return (
		<Breadcrumb>
			<BreadcrumbList className="rounded-md border bg-background px-3 py-2 shadow-xs">
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
