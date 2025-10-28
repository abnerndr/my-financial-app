'use client';

import { ChevronDownIcon } from 'lucide-react';
import { type ComponentPropsWithRef, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { IconProps } from '@/types/icons';

export type GroupedItems = {
	icon: IconProps;
	label: string;
	variant?: 'default' | 'destructive';
};

export type DropdownGroupedItems = {
	label: string;
	items: GroupedItems[];
};

export interface DropdownGroupedProps extends ComponentPropsWithRef<typeof DropdownMenu> {
	label: string;
	items: DropdownGroupedItems[];
}

export function DropdownGrouped({ label, items, ...props }: DropdownGroupedProps) {
	return (
		<DropdownMenu {...props}>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">
					{label}
					<ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{items.map((group) => (
					<Fragment key={group.label}>
						<DropdownMenuLabel className="opacity-70 text-xs">
							{group.label}
						</DropdownMenuLabel>
						<DropdownMenuGroup>
							{group.items.map((item) => (
								<DropdownMenuItem key={item.label} variant={item.variant || 'default'}>
									<item.icon size={16} className="opacity-60" aria-hidden="true" />
									{item.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
						{items.length > 1 && items[items.length - 1].label !== group.label && (
							<DropdownMenuSeparator />
						)}
					</Fragment>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
