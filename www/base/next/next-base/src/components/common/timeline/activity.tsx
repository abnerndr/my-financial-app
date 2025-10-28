'use client';

import {
	BookOpenIcon,
	type LucideIcon,
	MessageCircleIcon,
	PencilIcon,
	PlusIcon,
} from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Timeline, TimelineContent, TimelineItem } from '@/components/ui/timeline';

function getActionIcon(action: ActionType): LucideIcon {
	const icons: Record<ActionType, LucideIcon> = {
		post: BookOpenIcon,
		reply: MessageCircleIcon,
		edit: PencilIcon,
		create: PlusIcon,
	};
	return icons[action];
}

function getActionText(action: ActionType): string {
	const texts: Record<ActionType, string> = {
		post: 'wrote a new post',
		reply: 'replied to a comment',
		edit: 'edited a post',
		create: 'created a new project',
	};
	return texts[action];
}

function getRelativeTimeString(date: Date): string {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return `${diffInSeconds} seconds ago`;
	} else if (diffInSeconds < 3600) {
		const minutes = Math.floor(diffInSeconds / 60);
		return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
	} else if (diffInSeconds < 86400) {
		const hours = Math.floor(diffInSeconds / 3600);
		return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
	} else {
		const days = Math.floor(diffInSeconds / 86400);
		return `${days} ${days === 1 ? 'day' : 'days'} ago`;
	}
}

export type ActionType = 'post' | 'reply' | 'edit' | 'create';

export type TimelineActivityOptions = {
	id: number;
	user: string;
	userPath?: string;
	actionPath?: string;
	image: string;
	action: ActionType;
	date: Date;
};

export interface TimelineActivityProps extends ComponentPropsWithRef<typeof Timeline> {
	title?: string;
	items: TimelineActivityOptions[];
}

export function TimelineActivity({ items, title, ...props }: TimelineActivityProps) {
	return (
		<div className="space-y-3">
			{title && <div className="text-muted-foreground text-xs font-medium">{title}</div>}
			<Timeline {...props}>
				{items.map((item) => {
					const ActionIcon = getActionIcon(item.action);
					return (
						<TimelineItem
							key={item.id}
							step={item.id}
							className="m-0! flex-row items-center gap-3 py-2.5!"
						>
							<ActionIcon className="text-muted-foreground/80" size={16} />
							<Image
								src={item.image}
								alt={item.user}
								className="size-6 rounded-full"
								width={24}
								height={24}
							/>
							<TimelineContent className="text-foreground">
								<Link className="font-medium hover:underline" href={item.userPath || '#'}>
									{item.user}
								</Link>
								<span className="font-normal">
									{' '}
									{getActionText(item.action)}{' '}
									<Link className="hover:underline" href={item.actionPath || '#'}>
										{getRelativeTimeString(item.date)}
									</Link>
								</span>
							</TimelineContent>
						</TimelineItem>
					);
				})}
			</Timeline>
		</div>
	);
}
