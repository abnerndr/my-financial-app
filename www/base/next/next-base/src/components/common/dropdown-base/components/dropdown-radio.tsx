'use client';

import { ChevronDownIcon } from 'lucide-react';
import { type ComponentPropsWithRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type DropdownRadioItems = {
	label: string;
	value: string;
	disabled?: boolean;
};

export interface DropdownRadioProps extends ComponentPropsWithRef<typeof DropdownMenu> {
	label: string;
	items: DropdownRadioItems[];
}

export function DropdownRadio({ label, items, ...props }: DropdownRadioProps) {
	const [framework, setFramework] = useState('nextjs');

	return (
		<DropdownMenu {...props}>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">
					{label}
					<ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuRadioGroup value={framework} onValueChange={setFramework}>
					{items.map((item) => (
						<DropdownMenuRadioItem
							key={item.value}
							value={item.value}
							disabled={item.disabled}
						>
							{item.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
