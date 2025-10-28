'use client';

import { type VariantProps, tv } from 'tailwind-variants';
import type { ComponentPropsWithoutRef } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const switchVariants = tv({
	base: '',
	variants: {
		size: {
			sm: 'h-4 w-7 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2.5 data-[state=checked]:[&_span]:rtl:-translate-x-2.5',
			md: 'h-5 w-8 [&_span]:size-4 data-[state=checked]:[&_span]:translate-x-3 data-[state=checked]:[&_span]:rtl:-translate-x-3',
			lg: 'h-6 w-10 [&_span]:size-5 data-[state=checked]:[&_span]:translate-x-4 data-[state=checked]:[&_span]:rtl:-translate-x-4',
			xl: 'h-7 w-12 [&_span]:size-6 data-[state=checked]:[&_span]:translate-x-5 data-[state=checked]:[&_span]:rtl:-translate-x-5',
		},
		variant: {
			primary:
				'[--primary:var(--color-primary/50)] [--ring:var(--color-primary/30)] in-[.dark]:[--primary:var(--color-primary/50)] in-[.dark]:[--ring:var(--color-primary/90)]',
			indigo:
				'[--primary:var(--color-indigo-500)] [--ring:var(--color-indigo-300)] in-[.dark]:[--primary:var(--color-indigo-500)] in-[.dark]:[--ring:var(--color-indigo-900)]',
			red: '[--primary:var(--color-red-500)] [--ring:var(--color-red-300)] in-[.dark]:[--primary:var(--color-red-500)] in-[.dark]:[--ring:var(--color-red-900)]',
			yellow:
				'[--primary:var(--color-amber-500)] [--ring:var(--color-amber-300)] in-[.dark]:[--primary:var(--color-amber-500)] in-[.dark]:[--ring:var(--color-amber-900)]',
			green:
				'[--primary:var(--color-emerald-500)] [--ring:var(--color-emerald-300)] in-[.dark]:[--primary:var(--color-emerald-500)] in-[.dark]:[--ring:var(--color-emerald-900)]',
			dark: '[--primary:var(--color-zinc-700)] [--ring:var(--color-zinc-500)] in-[.dark]:[--primary:var(--color-zinc-300)] in-[.dark]:[--ring:var(--color-zinc-700)]',
		},
		rounded: {
			square: 'rounded-sm [&_span]:rounded',
			default: 'rounded-full [&_span]:rounded-full',
		},
	},
	defaultVariants: {
		variant: 'dark',
		size: 'md',
		type: 'default',
	},
});

export interface SwitchBaseProps
	extends VariantProps<typeof switchVariants>,
		ComponentPropsWithoutRef<typeof Switch> {
	isLabel?: boolean;
	isInternalLabel?: boolean;
}

export function SwitchBase({
	size,
	variant,
	isLabel,
	isInternalLabel,
	rounded,
	...props
}: SwitchBaseProps) {
	return (
		<div className={cn('inline-flex items-center gap-2', switchVariants({ variant }))}>
			<Switch className={switchVariants({ size, rounded })} {...props} />
			{isInternalLabel && (
				<>
					<span className="pointer-events-none relative ms-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
						<span className="text-[10px] font-medium uppercase">Off</span>
					</span>
					<span className="peer-data-[state=checked]:text-background pointer-events-none relative me-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
						<span className="text-[10px] font-medium uppercase">On</span>
					</span>
				</>
			)}
			<Label htmlFor={props.id ?? props.name} className={cn(isLabel ? '' : 'sr-only')}>
				{props.checked ? 'On' : 'Off'}
			</Label>
		</div>
	);
}
