'use client';

import { getLocalTimeZone, isWeekend, today } from '@internationalized/date';
import { addDays, subDays } from 'date-fns';
import { useState } from 'react';
import { type DateRange, type DateValue, useLocale } from 'react-aria-components';
import { CalendarBase } from '@/components/common/calendar-base';

// Mock time slots data
const timeSlots = [
	{ time: '09:00', available: false },
	{ time: '09:30', available: false },
	{ time: '10:00', available: true },
	{ time: '10:30', available: true },
	{ time: '11:00', available: true },
	{ time: '11:30', available: true },
	{ time: '12:00', available: false },
	{ time: '12:30', available: true },
	{ time: '13:00', available: true },
	{ time: '13:30', available: true },
	{ time: '14:00', available: true },
	{ time: '14:30', available: false },
	{ time: '15:00', available: false },
	{ time: '15:30', available: true },
	{ time: '16:00', available: true },
	{ time: '16:30', available: true },
	{ time: '17:00', available: true },
	{ time: '17:30', available: true },
];

export default function CalendarPage() {
	const todayTs = new Date();
	const now = today(getLocalTimeZone());
	const [date, setDate] = useState<DateValue | null>(now);
	const [dates, setDates] = useState<DateRange | null>({
		start: now.add({ days: 1 }),
		end: now.add({ days: 3 }),
	});

	const [selectedDatesTwoMonths, setSelectedDateTwoMonths] = useState<Date | undefined>(
		todayTs,
	);

	const [selectedDate, setSelectedDate] = useState<Date | undefined>(todayTs);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);

	const [dateMultiple, setDateMultiple] = useState<Date[] | undefined>([
		subDays(todayTs, 17),
		addDays(todayTs, 2),
		addDays(todayTs, 6),
		addDays(todayTs, 8),
	]);

	const disabledRanges = [
		[now.add({ days: 4 }), now.add({ days: 7 })],
		[now.add({ days: 14 }), now.add({ days: 14 })],
		[now.add({ days: 23 }), now.add({ days: 23 })],
	];
	const { locale } = useLocale();
	const isDateUnavailable = (date: DateValue) =>
		isWeekend(date, locale) ||
		disabledRanges.some(
			(interval) => date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0,
		);

	console.log({ date, dates, dateMultiple });
	return (
		<div className="w-full flex flex-col h-screen justify-center gap-y-4 my-20">
			<div className="w-full max-w-md mx-auto flex justify-center flex-row items-center gap-x-4">
				<CalendarBase.Simple onChange={setDate} value={date} />
				<CalendarBase.Range onChange={setDates} value={dates} />
				<CalendarBase.Disabled
					isDateUnavailable={isDateUnavailable}
					minValue={now.add({ days: 1 })}
					onChange={setDates}
					value={dates}
				/>
				<CalendarBase.Multiple selected={dateMultiple} onSelect={setDateMultiple} />
			</div>
			<div className="w-full max-w-md mx-auto flex justify-center flex-row items-center gap-x-4 ">
				<CalendarBase.Multiple selected={dateMultiple} onSelect={setDateMultiple} />
				<CalendarBase.Appointment
					slots={timeSlots}
					onSelectDate={setSelectedDate}
					onSelectTime={setSelectedTime}
					selectedDate={selectedDate}
					selectedTime={selectedTime}
				/>
				<CalendarBase.Select onSelectDate={setSelectedDate} selectedDate={selectedDate} />
			</div>
			<div className="w-full max-w-md mx-auto flex justify-center flex-row items-center gap-x-4 ">
				<CalendarBase.TwoMonths
					onSelectDate={setSelectedDateTwoMonths}
					selectedDate={selectedDatesTwoMonths}
				/>
			</div>
		</div>
	);
}
