'use client';

import type { ComponentPropsWithRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { IconProps } from '@/types/icons';

export type CheckboxLabelItems = {
	value: string;
	label: string;
	icon: IconProps;
	defaultChecked?: boolean;
};

export interface CheckboxLabelItemsProps extends ComponentPropsWithRef<typeof Checkbox> {
	items: CheckboxLabelItems[];
}

export function CheckboxLabelGroup({ items, ...props }: CheckboxLabelItemsProps) {
	return (
		<div className="grid grid-cols-2 gap-3">
			{items.map((item) => (
				<div
					key={`${props.id}-${item.value}`}
					className="relative flex cursor-pointer flex-col gap-4 rounded-md border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/50"
				>
					<div className="flex justify-between gap-2">
						<Checkbox
							{...props}
							value={item.value}
							className="order-1 after:absolute after:inset-0"
							defaultChecked={item.defaultChecked}
						/>
						<item.icon className="opacity-60" size={16} aria-hidden="true" />
					</div>
					<Label htmlFor={`${props.id}-${item.value}`}>{item.label}</Label>
				</div>
			))}
		</div>
	);
}
