'use client';

import { type VariantProps, tv } from 'tailwind-variants';
import type { ComponentPropsWithoutRef } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { IconProps } from '@/types/icons';

const switchVariants = tv({
	base: 'peer data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full',
	variants: {
		variant: {
			primary: 'bg-primary/50 in-[.dark]:bg-primary/50',
			indigo: 'bg-indigo-500/50 in-[.dark]:bg-indigo-500/50',
			red: 'bg-red-500/50 in-[.dark]:bg-red-500/50',
			yellow: 'bg-amber-500/50 in-[.dark]:bg-amber-500/50',
			green: 'bg-emerald-500/50 in-[.dark]:bg-emerald-500/50',
			dark: 'bg-zinc-700/50 in-[.dark]:bg-zinc-300/50',
		},
		size: {
			sm: 'h-6 w-12 [&_span]:size-5 [&_span]:data-[state=checked]:translate-x-5 [&_span]:data-[state=checked]:rtl:-translate-x-5',
			md: 'h-8 w-16 [&_span]:size-6 [&_span]:data-[state=checked]:translate-x-6 [&_span]:data-[state=checked]:rtl:-translate-x-6',
			lg: 'h-10 w-20 [&_span]:size-7 [&_span]:data-[state=checked]:translate-x-7 [&_span]:data-[state=checked]:rtl:-translate-x-7',
		},
	},
	defaultVariants: {
		variant: 'dark',
		size: 'md',
	},
});

export interface SwitchIconProps
	extends VariantProps<typeof switchVariants>,
		ComponentPropsWithoutRef<typeof Switch> {
	onIcon?: IconProps;
	offIcon?: IconProps;
	label?: string;
}

export function SwitchIcon({
	variant,
	size,
	onIcon: OnIcon,
	offIcon: OffIcon,
	label,
	...props
}: SwitchIconProps) {
	return (
		<div>
			<div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
				<Switch {...props} className={switchVariants({ variant, size })} />
				{OffIcon && (
					<span className="pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
						<OffIcon size={16} aria-hidden="true" />
					</span>
				)}
				{OnIcon && (
					<span className="peer-data-[state=checked]:text-background pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
						<OnIcon size={16} aria-hidden="true" />
					</span>
				)}
			</div>
			<Label htmlFor={props.id ?? props.name} className="sr-only">
				{label}
			</Label>
		</div>
	);
}
