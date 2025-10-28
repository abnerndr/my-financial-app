'use client';

import type { VariantProps } from 'class-variance-authority';
import { BookmarkIcon } from 'lucide-react';
import { tv } from 'tailwind-variants';
import type { ComponentPropsWithRef } from 'react';
import { Toggle } from '@/components/ui/toggle';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

const buttonBookmarkVariants = tv({
	base: 'group size-9 p-0 ',
	variants: {
		color: {
			indigo:
				'hover:bg-indigo-50 hover:text-indigo-500 data-[state=on]:bg-indigo-50 data-[state=on]:text-indigo-500',
			zinc: 'hover:bg-zinc-50 hover:text-zinc-900 data-[state=on]:bg-zinc-50 data-[state=on]:text-zinc-900',
			red: 'hover:bg-red-50 hover:text-red-500 data-[state=on]:bg-red-50 data-[state=on]:text-red-500',
			emerald:
				'hover:bg-emerald-50 hover:text-emerald-500 data-[state=on]:bg-emerald-50 data-[state=on]:text-emerald-500',
			yellow:
				'hover:bg-yellow-50 hover:text-yellow-500 data-[state=on]:bg-yellow-50 data-[state=on]:text-yellow-500',
			orange:
				'hover:bg-orange-50 hover:text-orange-500 data-[state=on]:bg-orange-50 data-[state=on]:text-orange-500',
		},
	},
	defaultVariants: {
		color: 'indigo',
	},
});

export interface ButtonBookmarkProps
	extends Omit<ComponentPropsWithRef<typeof Toggle>, 'color'>,
		VariantProps<typeof buttonBookmarkVariants> {
	color?: VariantProps<typeof buttonBookmarkVariants>['color'];
}

export function ButtonBookmark({ color, ...props }: ButtonBookmarkProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div>
						<Toggle
							className={buttonBookmarkVariants({ color, className: props.className })}
							aria-label="Bookmark this"
							{...props}
						>
							<BookmarkIcon size={16} aria-hidden="true" />
						</Toggle>
					</div>
				</TooltipTrigger>
				<TooltipContent className="px-2 py-1 text-xs">
					<p>
						{props.value && props.value === 'true' ? 'Remove bookmark' : 'Bookmark this'}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
