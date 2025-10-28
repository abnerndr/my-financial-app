'use client';

import { CreditCardIcon } from 'lucide-react';
import { usePaymentInputs } from 'react-payment-inputs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type InputCardNumberProps = React.ComponentProps<typeof Input> & {
	label?: string;
	error?: string;
};

export function InputCardNumber({ label = '', error, ...props }: InputCardNumberProps) {
	const { getCardNumberProps } = usePaymentInputs();
	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={props.id}>
				{label} {props.required && <span className="text-red-500">*</span>}
			</Label>
			<div className="relative">
				<Input
					{...getCardNumberProps()}
					className={cn('peer ps-9 [direction:inherit]', error && 'border-red-500', props.className)}
					{...props}
				/>
				<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
					<CreditCardIcon size={16} aria-hidden="true" />
				</div>
			</div>
			{error && <p className="mt-1 text-sm text-destructive">{error}</p>}
		</div>
	);
}
