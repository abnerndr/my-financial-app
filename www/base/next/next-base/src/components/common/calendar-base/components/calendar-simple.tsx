'use client';

import type { ComponentPropsWithRef } from 'react';
import { Calendar } from '@/components/ui/calendar-rac';
import { cn } from '@/lib/utils';

export type CalendarSimpleProps = ComponentPropsWithRef<typeof Calendar>;

export function CalendarSimple({ ...props }: CalendarSimpleProps) {
	return (
		<div>
			<Calendar className={cn('rounded-md border p-2', props.className)} {...props} />
		</div>
	);
}
