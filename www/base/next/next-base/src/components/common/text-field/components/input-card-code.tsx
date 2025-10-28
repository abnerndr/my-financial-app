'use client';

import { usePaymentInputs } from 'react-payment-inputs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type InputCardCodeProps = React.ComponentProps<typeof Input> & {
	label?: string;
	error?: string;
};

export function InputCardCode({ label = '', error, ...props }: InputCardCodeProps) {
	const { getCVCProps } = usePaymentInputs();

	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={props.id}>
				{label} {props.required && <span className="text-red-500">*</span>}
			</Label>
			<Input
				{...getCVCProps()}
				className={cn('[direction:inherit]', error && 'border-red-500', props.className)}
				{...props}
			/>
			{error && <p className="mt-1 text-sm text-destructive">{error}</p>}
		</div>
	);
}
