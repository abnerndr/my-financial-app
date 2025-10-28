'use client';

import { PlusIcon } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { IconProps } from '@/types/icons';

export interface ButtonCenteredIconProps extends ComponentPropsWithRef<typeof Button> {
	rounded?: boolean;
	icon?: IconProps;
}

export function ButtonCenteredIcon({
	rounded,
	icon: Icon = PlusIcon,
	...props
}: ButtonCenteredIconProps) {
	return (
		<Button
			className={cn(rounded ? 'rounded-full' : 'rounded-md', props.className)}
			variant="outline"
			size="icon"
			{...props}
		>
			<Icon size={16} aria-hidden="true" />
		</Button>
	);
}
