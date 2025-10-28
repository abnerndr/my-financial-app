import type { CalendarDate } from '@internationalized/date';
import { create } from 'zustand';

export type UseCalendarDatesState = {
	date?: { start?: CalendarDate; end?: CalendarDate } | null;
};

export type UseCalendarDatesActions = {
	setDate: (date: UseCalendarDatesState['date']) => void;
	reset: () => void;
};

export const useCalendarDatesStore = create<
	UseCalendarDatesState & UseCalendarDatesActions
>((set) => ({
	date: null,
	setDate: (date) => set(() => ({ date })),
	reset: () => set(() => ({ date: null })),
}));
