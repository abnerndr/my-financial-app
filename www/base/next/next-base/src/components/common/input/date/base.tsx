'use client';

import { format } from 'date-fns';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { useId, useState } from 'react';
import {
	Dialog,
	Group,
	Button as RACButton,
	DatePicker as RACDatePicker,
	DateRangePicker as RACDateRangePicker,
	Label as RACLabel,
	Popover as RACPopover,
} from 'react-aria-components';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as RACCalendar, RangeCalendar } from '@/components/ui/calendar-rac';
import { DateInput, dateInputStyle } from '@/components/ui/datefield-rac';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type DateInputMode = 'date' | 'date-range' | 'datetime' | 'datetime-range';
export type DateInputType = 'daypicker' | 'react-aria';

interface BaseDateInputProps {
	mode?: DateInputMode;
	type?: DateInputType;
	label?: string;
	placeholder?: string;
	value?: Date | DateRange | undefined;
	onSelect?: (date: Date | DateRange | undefined) => void;
	defaultValue?: Date | DateRange | undefined;
	disabled?: boolean;
	required?: boolean;
	className?: string;
	buttonClassName?: string;
	popoverClassName?: string;
	numberOfMonths?: number;
	showOutsideDays?: boolean;
	fromYear?: number;
	toYear?: number;
	captionLayout?: 'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years';
	align?: 'start' | 'center' | 'end';
	side?: 'top' | 'right' | 'bottom' | 'left';
	showTime?: boolean;
	timeStep?: number;
	timeDefaultValue?: string;
	timeLabel?: string;
}

export function BaseDateInput({
	mode = 'date',
	type = 'daypicker',
	label,
	placeholder,
	value,
	onSelect,
	defaultValue,
	disabled = false,
	required = false,
	className,
	buttonClassName,
	popoverClassName,
	numberOfMonths = 1,
	showOutsideDays = false,
	fromYear,
	toYear,
	captionLayout = 'label',
	align = 'start',
	side = 'bottom',
	showTime = false,
	timeStep = 1,
	timeDefaultValue = '12:00:00',
	timeLabel = 'Time',
}: BaseDateInputProps) {
	const id = useId();
	const timeId = useId();

	const [selectedDate, setSelectedDate] = useState<Date | DateRange | undefined>(() => {
		return defaultValue;
	});

	const handleSelect = (date: Date | DateRange | undefined) => {
		setSelectedDate(date);
		onSelect?.(date);
	};

	const currentValue = value !== undefined ? value : selectedDate;

	const formatDate = (date: Date | DateRange | undefined) => {
		if (!date) {
			switch (mode) {
				case 'date':
					return placeholder || 'Pick a date';
				case 'date-range':
					return placeholder || 'Pick a date range';
				case 'datetime':
					return placeholder || 'Pick date and time';
				case 'datetime-range':
					return placeholder || 'Pick date range and time';
				default:
					return placeholder || 'Pick a date';
			}
		}

		if (mode.includes('range') && typeof date === 'object' && 'from' in date) {
			const range = date as DateRange;
			if (range.from) {
				if (range.to) {
					return `${format(range.from, 'LLL dd, y')} - ${format(range.to, 'LLL dd, y')}`;
				}
				return format(range.from, 'LLL dd, y');
			}
		}

		if (date instanceof Date) {
			return format(date, mode.includes('datetime') ? 'PPp' : 'PPP');
		}

		return placeholder || 'Pick a date';
	};

	// React Aria Components
	if (type === 'react-aria') {
		if (mode === 'datetime' || mode === 'date') {
			return (
				<div className={className}>
					<RACDatePicker className="*:not-first:mt-2">
						{label && <RACLabel className="text-foreground text-sm font-medium">{label}</RACLabel>}
						<div className="flex">
							<Group className="w-full">
								<DateInput className="pe-9" />
							</Group>
							<RACButton className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]">
								<CalendarIcon size={16} />
							</RACButton>
						</div>
						<RACPopover
							className="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-lg border shadow-lg outline-hidden"
							offset={4}
						>
							<Dialog className="max-h-[inherit] overflow-auto p-2">
								<RACCalendar />
							</Dialog>
						</RACPopover>
						<section className="text-muted-foreground mt-2 text-xs" aria-live="polite">
							Built with{' '}
							<a
								className="hover:text-foreground underline"
								href="https://react-spectrum.adobe.com/react-aria/DatePicker.html"
								target="_blank"
								rel="noopener nofollow"
							>
								React Aria
							</a>
						</section>
					</RACDatePicker>
				</div>
			);
		}

		if (mode === 'datetime-range' || mode === 'date-range') {
			return (
				<div className={className}>
					<RACDateRangePicker className="*:not-first:mt-2">
						{label && <RACLabel className="text-foreground text-sm font-medium">{label}</RACLabel>}
						<div className="flex">
							<Group className={cn(dateInputStyle, 'pe-9')}>
								<DateInput slot="start" unstyled />
								<span aria-hidden="true" className="text-muted-foreground/70 px-2">
									-
								</span>
								<DateInput slot="end" unstyled />
							</Group>
							<RACButton className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]">
								<CalendarIcon size={16} />
							</RACButton>
						</div>
						<RACPopover
							className="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-md border shadow-lg outline-hidden"
							offset={4}
						>
							<Dialog className="max-h-[inherit] overflow-auto p-2">
								<RangeCalendar />
							</Dialog>
						</RACPopover>
						<section className="text-muted-foreground mt-2 text-xs" aria-live="polite">
							Built with{' '}
							<a
								className="hover:text-foreground underline"
								href="https://react-spectrum.adobe.com/react-aria/DateRangePicker.html"
								target="_blank"
								rel="noopener nofollow"
							>
								React Aria
							</a>
						</section>
					</RACDateRangePicker>
				</div>
			);
		}
	}

	// DayPicker Components
	const calendarProps = {
		numberOfMonths: mode.includes('range') ? Math.max(numberOfMonths, 2) : numberOfMonths,
		showOutsideDays,
		fromYear,
		toYear,
		captionLayout,
		disabled,
		required: mode.includes('range') ? required : undefined,
		classNames:
			numberOfMonths > 1 || mode.includes('range')
				? {
						months: 'gap-8',
						month:
							'relative first-of-type:before:hidden before:absolute max-sm:before:inset-x-2 max-sm:before:h-px max-sm:before:-top-2 sm:before:inset-y-2 sm:before:w-px before:bg-border sm:before:-left-4',
					}
				: undefined,
	};

	return (
		<div className={cn('*:not-first:mt-2', className)}>
			{label && <Label htmlFor={id}>{label}</Label>}
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id={id}
						variant="outline"
						className={cn(
							'group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]',
							buttonClassName,
						)}
						disabled={disabled}
					>
						<span className={cn('truncate', !currentValue && 'text-muted-foreground')}>{formatDate(currentValue)}</span>
						<CalendarIcon
							size={16}
							className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
							aria-hidden="true"
						/>
					</Button>
				</PopoverTrigger>
				<PopoverContent className={cn('w-auto p-2', popoverClassName)} align={align} side={side}>
					<div className={cn(showTime && mode.includes('datetime') && 'overflow-hidden')}>
						{mode === 'date' || mode === 'datetime' ? (
							<Calendar
								mode="single"
								selected={currentValue as Date}
								onSelect={handleSelect}
								{...calendarProps}
								className={showTime && mode === 'datetime' ? 'pb-0' : ''}
							/>
						) : (
							<Calendar
								mode="range"
								selected={currentValue as DateRange}
								onSelect={handleSelect}
								{...calendarProps}
								className={showTime && mode === 'datetime-range' ? 'pb-0' : ''}
							/>
						)}

						{showTime && mode.includes('datetime') && (
							<div className="border-t p-3">
								<div className="flex items-center gap-3">
									<Label htmlFor={timeId} className="text-xs">
										{timeLabel}
									</Label>
									<div className="relative grow">
										<Input
											id={timeId}
											type="time"
											step={timeStep}
											defaultValue={timeDefaultValue}
											className="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
										/>
										<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
											<ClockIcon size={16} aria-hidden="true" />
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</PopoverContent>
			</Popover>

			<section className="text-muted-foreground mt-2 text-xs" aria-live="polite">
				Built with{' '}
				<a
					className="hover:text-foreground underline"
					href="https://daypicker.dev/"
					target="_blank"
					rel="noopener nofollow"
				>
					React DayPicker
				</a>
			</section>
		</div>
	);
}

// Specific date input components
export type DatePickerProps = Omit<BaseDateInputProps, 'mode'>;

export function DatePicker(props: DatePickerProps) {
	return <BaseDateInput mode="date" {...props} />;
}

export type DateRangePickerProps = Omit<BaseDateInputProps, 'mode'>;

export function DateRangePicker(props: DateRangePickerProps) {
	return <BaseDateInput mode="date-range" {...props} />;
}

export type DateTimePickerProps = Omit<BaseDateInputProps, 'mode'>;

export function DateTimePicker(props: DateTimePickerProps) {
	return <BaseDateInput mode="datetime" showTime {...props} />;
}

export type DateTimeRangePickerProps = Omit<BaseDateInputProps, 'mode'>;

export function DateTimeRangePicker(props: DateTimeRangePickerProps) {
	return <BaseDateInput mode="datetime-range" showTime {...props} />;
}

export default BaseDateInput;
