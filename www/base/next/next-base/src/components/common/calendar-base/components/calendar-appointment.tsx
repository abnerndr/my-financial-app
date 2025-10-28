'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';

export type CalendarAppointmentSlots = {
	time: string; // e.g., "09:00", "09:30"
	available: boolean;
};

export interface CalendarAppointmentProps {
	slots: CalendarAppointmentSlots[];
	onSelectTime: (time: string | null) => void;
	selectedTime: string | null;
	onSelectDate: Dispatch<SetStateAction<Date | undefined>>;
	selectedDate: Date | undefined;
}

export function CalendarAppointment({
	slots,
	onSelectDate,
	onSelectTime,
	selectedDate,
	selectedTime,
}: CalendarAppointmentProps) {
	const today = new Date();

	return (
		<div>
			<div className="rounded-md border">
				<div className="flex max-sm:flex-col">
					<Calendar
						locale={ptBR}
						mode="single"
						selected={selectedDate}
						onSelect={(newDate) => {
							if (newDate) {
								onSelectDate(newDate);
								onSelectTime(null);
							}
						}}
						className="p-2 sm:pe-5"
						disabled={[
							{ before: today }, // Dates before today
						]}
					/>
					<div className="relative w-full max-sm:h-48 sm:w-40">
						<div className="absolute inset-0 py-4 max-sm:border-t">
							<ScrollArea className="h-full sm:border-s">
								<div className="space-y-3">
									<div className="flex h-5 shrink-0 items-center px-5">
										{selectedDate && (
											<p className="text-sm font-medium">
												{format(selectedDate, 'EE, d', { locale: ptBR })}
											</p>
										)}
									</div>
									<div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
										{slots.map(({ time: timeSlot, available }) => (
											<Button
												key={timeSlot}
												variant={selectedTime === timeSlot ? 'default' : 'outline'}
												size="sm"
												className="w-full"
												onClick={() => onSelectTime(timeSlot)}
												disabled={!available}
											>
												{timeSlot}
											</Button>
										))}
									</div>
								</div>
							</ScrollArea>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
