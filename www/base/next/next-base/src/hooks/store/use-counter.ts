import { create } from 'zustand';

export type UseCounterState = {
	count: number;
};

export type UseCounterActions = {
	increment: () => void;
	decrement: () => void;
	reset: () => void;
};

export const useCounterStore = create<UseCounterState & UseCounterActions>((set) => ({
	count: 0,
	increment: () => set((state) => ({ count: state.count + 1 })),
	decrement: () => set((state) => ({ count: state.count - 1 })),
	reset: () => set({ count: 0 }),
}));
