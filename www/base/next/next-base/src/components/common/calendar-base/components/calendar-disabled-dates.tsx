'use client';

import type { ComponentPropsWithRef } from 'react';
import { RangeCalendar } from '@/components/ui/calendar-rac';
import { cn } from '@/lib/utils';

export type CalendarDisabledDatesProps = ComponentPropsWithRef<typeof RangeCalendar>;

export function CalendarDisabledDates({ ...props }: CalendarDisabledDatesProps) {
	return (
		<div>
			<RangeCalendar className={cn('rounded-md border p-2', props.className)} {...props} />
		</div>
	);
}
