'use client';

import { MinusIcon, PlusIcon } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { Button, Group, Input, Label, NumberField } from 'react-aria-components';
import { cn } from '@/lib/utils';

export interface InputNumberPlusProps extends ComponentPropsWithRef<typeof NumberField> {
	label?: string;
	required?: boolean;
	error?: string;
}

export function InputNumberPlus({
	label = '',
	error,
	required = false,
	...props
}: InputNumberPlusProps) {
	const { minValue = 0 } = props;
	return (
		<NumberField minValue={minValue} {...props}>
			<div className="*:not-first:mt-2">
				<Label className="text-sm font-medium text-foreground ">
					{label} {required && <span className="text-destructive">*</span>}
				</Label>
				<Group className="relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border border-input text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:opacity-50 data-focus-within:border-ring data-focus-within:ring-[3px] data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:border-destructive data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40">
					<Button
						slot="decrement"
						className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-md border border-input bg-background text-sm text-muted-foreground/80 transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						<MinusIcon size={16} aria-hidden="true" />
					</Button>
					<Input
						className={cn(
							'w-full grow bg-background px-3 py-2 text-center text-foreground tabular-nums',
							error && 'border-destructive',
						)}
					/>
					<Button
						slot="increment"
						className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-md border border-input bg-background text-sm text-muted-foreground/80 transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						<PlusIcon size={16} aria-hidden="true" />
					</Button>
				</Group>
				{error && <p className="mt-2 text-xs text-destructive absolute">{error}</p>}
			</div>
		</NumberField>
	);
}
