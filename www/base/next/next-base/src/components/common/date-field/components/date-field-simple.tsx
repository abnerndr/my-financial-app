'use client';

import { CalendarIcon } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { Button, DatePicker, Dialog, Group, Label, Popover } from 'react-aria-components';
import { Calendar } from '@/components/ui/calendar-rac';
import { DateInput } from '@/components/ui/datefield-rac';
import { cn } from '@/lib/utils';

export interface DateFieldSimpleProps extends ComponentPropsWithRef<typeof DatePicker> {
	label?: string;
	error?: string;
}

export function DateFieldSimple({ label, error, ...props }: DateFieldSimpleProps) {
	return (
		<DatePicker className={cn('*:not-first:mt-2', props.className)} {...props}>
			<Label className="text-sm font-medium text-foreground">{label}</Label>
			<div className="flex">
				<Group className="w-full">
					<DateInput className={cn('pe-9', error && 'border-red-500')} />
				</Group>
				<Button className="z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50">
					<CalendarIcon size={16} />
				</Button>
			</div>
			{error && <p className="text-sm text-red-500 absolute">{error}</p>}
			<Popover
				className="z-50 rounded-lg border bg-background text-popover-foreground shadow-lg outline-hidden data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
				offset={4}
			>
				<Dialog className="max-h-[inherit] overflow-auto p-2">
					<Calendar />
				</Dialog>
			</Popover>
		</DatePicker>
	);
}
