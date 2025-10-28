'use client';

import type { ComponentPropsWithRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { IconProps } from '@/types/icons';

export interface ButtonLinkProps extends ComponentPropsWithRef<typeof Link> {
	leftIcon?: IconProps;
	rightIcon?: IconProps;
	children: React.ReactNode;
}

export function ButtonLink({
	leftIcon: LeftIcon,
	rightIcon: RightIcon,
	children,
	...props
}: ButtonLinkProps) {
	return (
		<Button variant="link" className={'gap-1'} asChild>
			<Link {...props} className={cn('inline-flex items-center', props.className)}>
				{LeftIcon && <LeftIcon className="opacity-60" size={16} aria-hidden="true" />}
				{children}
				{RightIcon && <RightIcon className="opacity-60" size={16} aria-hidden="true" />}
			</Link>
		</Button>
	);
}
