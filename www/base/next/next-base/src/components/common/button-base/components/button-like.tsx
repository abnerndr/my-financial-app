'use client';

import { HeartIcon, StarIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ButtonLikeProps extends ComponentPropsWithRef<typeof Button> {
	likeType: 'like' | 'dislike' | 'star' | 'heart';
	text: string;
	total: number;
	increment: () => void;
	decrement: () => void;
}

const likeTypeIcons = {
	like: ThumbsUpIcon,
	dislike: ThumbsDownIcon,
	star: StarIcon,
	heart: HeartIcon,
};

export function ButtonLike({
	likeType,
	text,
	total,
	increment,
	decrement,
	...props
}: ButtonLikeProps) {
	const Icon = likeType ? likeTypeIcons[likeType] : ThumbsUpIcon;

	return (
		<Button
			className={cn('py-0 pe-0', props.className)}
			value={total}
			onClick={() => {
				if (likeType === 'dislike') decrement();
				else increment();
			}}
			variant="outline"
			{...props}
		>
			<Icon className="opacity-60" size={16} aria-hidden="true" />
			{text}
			<span className="relative ms-1 inline-flex h-full items-center justify-center rounded-full px-3 -mr-3 text-xs font-medium text-muted-foreground before:absolute before:inset-0 before:left-0 before:w-px before:bg-input">
				{total}
			</span>
		</Button>
	);
}
