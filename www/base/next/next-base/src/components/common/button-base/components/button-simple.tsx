'use client';

import type { VariantProps } from 'class-variance-authority';
import { LoaderCircleIcon } from 'lucide-react';
import { tv } from 'tailwind-variants';
import type { ComponentPropsWithRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { IconProps } from '@/types/icons';

const buttonVariants = tv({
	base: '',
	variants: {
		rounded: {
			true: 'rounded-full',
			false: 'rounded-md',
		},
	},
	defaultVariants: {},
});

export interface ButtonSimpleProps
	extends ComponentPropsWithRef<typeof Button>,
		VariantProps<typeof buttonVariants> {
	leftIcon?: IconProps;
	rightIcon?: IconProps;
	isLoading?: boolean;
}

export function ButtonSimple({
	rounded = false,
	leftIcon: LeftIcon,
	rightIcon: RightIcon,
	isLoading = false,
	...props
}: ButtonSimpleProps) {
	return (
		<Button
			{...props}
			disabled={props.disabled || isLoading}
			className={cn(buttonVariants({ rounded }), props.className)}
		>
			{LeftIcon && <LeftIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />}
			<span className="group-data-loading:text-transparent">{props.children}</span>
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center">
					<LoaderCircleIcon className="animate-spin" size={16} aria-hidden="true" />
				</div>
			)}
			{RightIcon && (
				<RightIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
			)}
		</Button>
	);
}
