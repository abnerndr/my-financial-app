'use client';

import { MinusIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ButtonCountProps {
	count: number;
	max: number;
	min: number;
	increment: () => void;
	decrement: () => void;
}

export function ButtonCount({
	count,
	max,
	min = 0,
	increment,
	decrement,
}: ButtonCountProps) {
	return (
		<fieldset className="inline-flex items-center" aria-labelledby="volume-control">
			<span id="volume-control" className="sr-only">
				Button Counter
			</span>
			<Button
				className="rounded-full"
				variant="outline"
				size="icon"
				aria-label="Decrease number"
				onClick={decrement}
				disabled={count === min}
			>
				<MinusIcon size={16} aria-hidden="true" />
			</Button>
			<div
				className="flex items-center px-3 text-sm font-medium tabular-nums"
				aria-live="polite"
			>
				{count}
			</div>
			<Button
				className="rounded-full"
				variant="outline"
				size="icon"
				aria-label="Increase number"
				onClick={increment}
				disabled={count === max}
			>
				<PlusIcon size={16} aria-hidden="true" />
			</Button>
		</fieldset>
	);
}
