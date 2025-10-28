'use client';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { Button, Group, Input, Label, NumberField } from 'react-aria-components';
import type { Currency } from '@/types/currency';

export interface InputNumberChevronProps extends ComponentPropsWithRef<typeof NumberField> {
	label?: string;
	required?: boolean;
	error?: string;
	numberType: 'decimal' | 'currency' | 'percent' | 'unit';
	currency?: Currency;
	currencySign?: 'standard' | 'accounting';
}

export function InputNumberChevron({
	label,
	required,
	error: _,
	numberType,
	currency = 'BRL',
	currencySign = 'accounting',
	...props
}: InputNumberChevronProps) {
	const { minValue = 0 } = props;
	return (
		<NumberField
			defaultValue={minValue}
			formatOptions={{
				style: numberType,
				currency: currency,
				currencySign: currencySign,
			}}
			{...props}
		>
			<div className="*:not-first:mt-2">
				<Label className="text-sm font-medium text-foreground">
					{label} {required && <span className="text-destructive">*</span>}
				</Label>
				<Group className="doutline-none relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border border-input text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] data-disabled:opacity-50 data-focus-within:border-ring data-focus-within:ring-[3px] data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:border-destructive data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40">
					<Input className="flex-1 bg-background px-3 py-2 text-foreground tabular-nums" />
					<div className="flex h-[calc(100%+2px)] flex-col">
						<Button
							slot="increment"
							className="-me-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-sm text-muted-foreground/80 transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							<ChevronUpIcon size={12} aria-hidden="true" />
						</Button>
						<Button
							slot="decrement"
							className="-me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-sm text-muted-foreground/80 transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							<ChevronDownIcon size={12} aria-hidden="true" />
						</Button>
					</div>
				</Group>
			</div>
		</NumberField>
	);
}
