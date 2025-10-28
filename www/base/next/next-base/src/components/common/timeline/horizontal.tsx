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

export type TimelineHorizontalOptions = {
	id: number;
	date: string;
	title: string;
	description: string;
};

export interface TimelineHorizontalProps extends ComponentPropsWithRef<typeof Timeline> {
	items: TimelineHorizontalOptions[];
}

export function TimelineHorizontal({ items, ...props }: TimelineHorizontalProps) {
	return (
		<Timeline orientation="horizontal" {...props}>
			{items.map((item) => (
				<TimelineItem
					key={item.id}
					step={item.id}
					className="group-data-[orientation=horizontal]/timeline:mt-0"
				>
					<TimelineHeader>
						<TimelineSeparator className="group-data-[orientation=horizontal]/timeline:top-8" />
						<TimelineDate className="mb-10">{item.date}</TimelineDate>
						<TimelineTitle>{item.title}</TimelineTitle>
						<TimelineIndicator className="group-data-[orientation=horizontal]/timeline:top-8" />
					</TimelineHeader>
					<TimelineContent>{item.description}</TimelineContent>
				</TimelineItem>
			))}
		</Timeline>
	);
}
