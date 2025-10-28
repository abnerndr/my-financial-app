'use client';

import { ClockIcon } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { Label } from 'react-aria-components';
import { DateInput, TimeField } from '@/components/ui/datefield-rac';
import { cn } from '@/lib/utils';

export interface InputTimeProps extends ComponentPropsWithRef<typeof TimeField> {
	isIcon: boolean;
	iconPosition?: 'left' | 'right';
	label: string;
	required?: boolean;
	error?: string;
}

export function InputTime({
	isIcon,
	iconPosition,
	label,
	required,
	error,
	...props
}: InputTimeProps) {
	const { className } = props;
	return (
		<TimeField className={cn('*:not-first:mt-2', className)} {...props}>
			<Label className="text-sm font-medium text-foreground">
				{label} {required && <span className="text-red-500">*</span>}
			</Label>
			<div className={cn(isIcon ? 'relative' : '')}>
				{isIcon && iconPosition === 'left' && (
					<div className="pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3 text-muted-foreground/80">
						<ClockIcon size={16} aria-hidden="true" />
					</div>
				)}
				<DateInput
					className={cn(
						isIcon && iconPosition === 'left' && 'ps-9',
						isIcon && iconPosition === 'right' && 'pe-9',
						error && 'border-red-500',
					)}
				/>
				{isIcon && iconPosition === 'right' && (
					<div className="pointer-events-none absolute inset-y-0 end-0 z-10 flex items-center justify-center pe-3 text-muted-foreground/80">
						<ClockIcon size={16} aria-hidden="true" />
					</div>
				)}
			</div>
			{error && <p className="mt-2 text-xs text-red-500 absolute">{error}</p>}
		</TimeField>
	);
}
