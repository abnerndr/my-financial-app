'use client';

import { OTPInput, type SlotProps } from 'input-otp';
import { useId } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface InputOTPSpacedProps {
	label: string;
	required?: boolean;
	maxLength?: number;
	disabled?: boolean;
}

export function InputOTPSpaced({ label, required, ...props }: InputOTPSpacedProps) {
	const id = useId();
	const { maxLength = 4, disabled } = props;
	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={id}>
				{label} {required && <span className="text-red-500">*</span>}
			</Label>
			<OTPInput
				id={id}
				disabled={disabled}
				containerClassName="flex items-center gap-3 has-disabled:opacity-50"
				maxLength={maxLength}
				render={({ slots }) => (
					<div className="flex gap-2">
						{slots.map((slot, idx) => (
							<Slot key={idx} {...slot} />
						))}
					</div>
				)}
			/>
		</div>
	);
}

function Slot(props: SlotProps) {
	return (
		<div
			className={cn(
				'flex size-9 items-center justify-center rounded-md border border-input bg-background font-medium text-foreground shadow-xs transition-[color,box-shadow]',
				{
					'z-10 border-ring ring-[3px] ring-ring/50': props.isActive,
				},
			)}
		>
			{props.char !== null && <div>{props.char}</div>}
		</div>
	);
}
