'use client';

import { ChevronDownIcon } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type DropdownSimpleOptions = {
	label: string;
	value: string;
};

export interface DropdownSimpleProps extends ComponentPropsWithRef<typeof DropdownMenu> {
	label: string;
	items: DropdownSimpleOptions[];
}

export function DropdownSimple({ label, items, ...props }: DropdownSimpleProps) {
	return (
		<DropdownMenu {...props}>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">
					{label}
					<ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
				{items.map((item) => (
					<DropdownMenuItem key={item.value}>{item.label}</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
