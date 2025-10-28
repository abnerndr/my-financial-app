import {
	CalendarAppointment,
	type CalendarAppointmentProps,
	type CalendarAppointmentSlots,
} from './components/calendar-appointment';
import {
	CalendarDisabledDates,
	type CalendarDisabledDatesProps,
} from './components/calendar-disabled-dates';
import {
	CalendarMultipleDaySelection,
	type CalendarMultipleDaySelectionProps,
} from './components/calendar-multiple-day-selection';
import { CalendarRange, type CalendarRangeProps } from './components/calendar-range';
import { CalendarSelect, type CalendarSelectProps } from './components/calendar-select';
import { CalendarSimple, type CalendarSimpleProps } from './components/calendar-simple';
import {
	CalendarTwoMonths,
	type CalendarTwoMonthsProps,
} from './components/calendar-two-months';

export const CalendarBase = {
	Simple: CalendarSimple,
	Range: CalendarRange,
	Disabled: CalendarDisabledDates,
	Multiple: CalendarMultipleDaySelection,
	Appointment: CalendarAppointment,
	TwoMonths: CalendarTwoMonths,
	Select: CalendarSelect,
};

export type {
	CalendarAppointmentProps,
	CalendarAppointmentSlots,
	CalendarDisabledDatesProps,
	CalendarMultipleDaySelectionProps,
	CalendarRangeProps,
	CalendarSelectProps,
	CalendarSimpleProps,
	CalendarTwoMonthsProps,
};
