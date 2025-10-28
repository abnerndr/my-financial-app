import type { ComponentPropsWithRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { IconProps } from '@/types/icons';

export interface InputSimpleProps extends ComponentPropsWithRef<typeof Input> {
	label?: string;
	error?: string;
	leftIcon?: IconProps;
	rightIcon?: IconProps;
}

export function InputSimple({
	label,
	error,
	leftIcon: LeftIcon,
	rightIcon: RightIcon,
	...props
}: InputSimpleProps) {
	const { id, required, className } = props;
	const isIcon = !!LeftIcon || !!RightIcon;
	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={id}>
				{label} {required && <span className="text-destructive">*</span>}
			</Label>
			<div className={cn(isIcon && 'relative flex items-center')}>
				<Input
					className={cn(
						error && 'border-destructive peer',
						LeftIcon && 'ps-8',
						RightIcon && 'pe-8',
						className,
					)}
					{...props}
				/>
				{LeftIcon && (
					<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
						<LeftIcon size={16} aria-hidden="true" />
					</div>
				)}
				{RightIcon && (
					<div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
						<RightIcon size={16} aria-hidden="true" />
					</div>
				)}
			</div>
			{error && <p className="mt-2 text-xs text-destructive absolute">{error}</p>}
		</div>
	);
}
