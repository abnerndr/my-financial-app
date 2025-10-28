'use client';

import type { ComponentPropsWithRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ButtonProfileUsernameProps extends ComponentPropsWithRef<typeof Button> {
	src: string;
	alt?: string;
	username: string;
}

export function ButtonProfileUsername({
	src,
	alt = 'Profile Picture',
	username,
	...props
}: ButtonProfileUsernameProps) {
	return (
		<Button className={cn('gap-0 rounded-full py-0 ps-0', props.className)} {...props}>
			<div className="me-0.5 flex aspect-square h-full p-1.5">
				<Image
					className="h-auto w-full rounded-full"
					src={src}
					alt={alt}
					width={24}
					height={24}
					aria-hidden="true"
				/>
			</div>
			{username}
		</Button>
	);
}
