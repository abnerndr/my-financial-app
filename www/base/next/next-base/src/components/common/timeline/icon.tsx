'use client';

import type { ComponentPropsWithRef } from 'react';
import {
	Timeline,
	TimelineContent,
	TimelineDate,
	TimelineHeader,
	TimelineIndicator,
	TimelineItem,
	TimelineSeparator,
	TimelineTitle,
} from '@/components/ui/timeline';
import type { IconProps } from '@/types/icons';

export type TimelineIconOptions = {
	id: number;
	date: string;
	title: string;
	description: string;
	icon: IconProps;
};

export interface TimelineIconProps extends ComponentPropsWithRef<typeof Timeline> {
	items: TimelineIconOptions[];
}

export function TimelineIcon({ items, ...props }: TimelineIconProps) {
	return (
		<Timeline {...props}>
			{items.map((item) => (
				<TimelineItem
					key={item.id}
					step={item.id}
					className="group-data-[orientation=vertical]/timeline:ms-10"
				>
					<TimelineHeader>
						<TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
						<TimelineTitle className="mt-0.5">{item.title}</TimelineTitle>
						<TimelineIndicator className="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
							<item.icon size={14} />
						</TimelineIndicator>
					</TimelineHeader>
					<TimelineContent>
						{item.description}
						<TimelineDate className="mt-2 mb-0">{item.date}</TimelineDate>
					</TimelineContent>
				</TimelineItem>
			))}
		</Timeline>
	);
}
