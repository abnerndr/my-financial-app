import { create } from 'zustand';
import type { DateValue } from 'react-aria-components';

export type UseCalendarDateState = {
	date?: DateValue | null;
};

export type UseCalendarDateActions = {
	setDate: (date: DateValue | null) => void;
	reset: () => void;
};

export const useCalendarDateStore = create<UseCalendarDateState & UseCalendarDateActions>(
	(set) => ({
		date: undefined,
		setDate: (date: DateValue | null) => set(() => ({ date })),
		reset: () => set(() => ({ date: undefined })),
	}),
);
