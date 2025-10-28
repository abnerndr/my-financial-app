'use client';

import type { OnSelectHandler } from 'react-day-picker';
import { ptBR } from 'react-day-picker/locale';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '../../../../lib/utils';

export interface CalendarMultipleDaySelectionProps {
	selected: Date[] | undefined;
	onSelect?: OnSelectHandler<Date[] | undefined>;
	className?: string;
}

export function CalendarMultipleDaySelection({
	selected,
	onSelect,
	className,
}: CalendarMultipleDaySelectionProps) {
	return (
		<div>
			<Calendar
				locale={ptBR}
				mode="multiple"
				selected={selected}
				onSelect={onSelect}
				className={cn('rounded-md border p-2', className)}
			/>
		</div>
	);
}
