'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Dispatch, SetStateAction } from 'react';
import type { DayButtonProps } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { StringHelper } from '@/lib/helpers/string';
import { cn } from '@/lib/utils';

export interface CalendarTwoMonthsProps {
	onSelectDate: Dispatch<SetStateAction<Date | undefined>>;
	selectedDate: Date | undefined;
	className?: string;
}

export function CalendarTwoMonths({
	className,
	onSelectDate,
	selectedDate,
}: CalendarTwoMonthsProps) {
	return (
		<div>
			<Calendar
				mode={'single'}
				selected={selectedDate}
				onSelect={onSelectDate}
				locale={ptBR}
				numberOfMonths={2}
				pagedNavigation
				showOutsideDays={false}
				className={cn('rounded-md border p-2', className)}
				classNames={{
					months: 'sm:flex-col md:flex-row gap-8',
					month:
						'relative first-of-type:before:hidden before:absolute max-md:before:inset-x-2 max-md:before:h-px max-md:before:-top-4 md:before:inset-y-2 md:before:w-px before:bg-border md:before:-left-4',
					weekday: 'w-12',
					day_button: 'size-12',
					today: '*:after:hidden',
				}}
				components={{
					DayButton: (props: DayButtonProps) => <DayButton {...props} />,
				}}
			/>
		</div>
	);
}

function DayButton(props: DayButtonProps) {
	const { day, ...buttonProps } = props;
	const weekday = format(day.date, 'EEEEEE', { locale: ptBR });

	return (
		<button {...buttonProps}>
			<span className="flex flex-col">
				{props.children}
				<span
					className={cn(
						'text-[10px] font-medium',
						'text-muted-foreground group-data-selected:text-primary-foreground/70',
					)}
				>
					{StringHelper.uppercase(weekday)}
				</span>
			</span>
		</button>
	);
}
