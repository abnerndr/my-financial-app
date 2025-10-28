'use client';

import type { ComponentPropsWithRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface CheckboxLabelSimpleProps extends ComponentPropsWithRef<typeof Checkbox> {
	label: string;
	sublabel?: string;
	description: string;
}

export function CheckboxLabelSimple({
	label,
	sublabel,
	description,
	...props
}: CheckboxLabelSimpleProps) {
	return (
		<div className="relative flex w-full items-start gap-2 rounded-md border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/50">
			<Checkbox
				{...props}
				className={cn('order-1 after:absolute after:inset-0', props.className)}
				aria-describedby={`${props.id}-description`}
			/>
			<div className="grid grow gap-2">
				<Label htmlFor={props.id}>
					{label}
					{sublabel ? (
						<span className="text-xs leading-[inherit] font-normal text-muted-foreground">
							({sublabel})
						</span>
					) : null}
				</Label>
				<p id={`${props.id}-description`} className="text-xs text-muted-foreground">
					{description}
				</p>
			</div>
		</div>
	);
}
