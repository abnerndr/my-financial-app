import type { ComponentPropsWithRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CurrencyHelper } from '@/lib/helpers/currency';
import { MaskHelper } from '@/lib/helpers/mask';
import { cn } from '@/lib/utils';
import type { Currency } from '@/types/currency';

export interface InputCurrencyProps extends ComponentPropsWithRef<typeof Input> {
	label?: string;
	error?: string;
	currency: Currency;
}

export function InputCurrency({
	label,
	error,
	currency = 'BRL',
	...props
}: InputCurrencyProps) {
	const { id, required, className, onChange } = props;
	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={id}>
				{label} {required && <span className="text-destructive">*</span>}
			</Label>
			<div className="relative">
				<Input
					id={id}
					className={cn('peer pe-12', currency === 'BRL' ? 'ps-8' : 'ps-6', className)}
					placeholder="0.00"
					type="text"
					onChange={(e) => {
						MaskHelper.onChangeApplyMask(e, 'currency');
						onChange?.(e);
					}}
				/>
				<span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground peer-disabled:opacity-50">
					{CurrencyHelper.getSymbol(currency)}
				</span>
				<span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
					{currency}
				</span>
			</div>
			{error && <p className="mt-2 text-xs text-destructive absolute">{error}</p>}
		</div>
	);
}
