import type { ComponentPropsWithRef } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { IconProps } from '@/types/icons';

export interface SwitchLabelProps extends ComponentPropsWithRef<typeof Switch> {
	label: string;
	sublabel?: string;
	description: string;
	icon?: IconProps;
}

export function SwitchLabel({
	icon: Icon,
	label,
	sublabel,
	description,
	...props
}: SwitchLabelProps) {
	return (
		<div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
			<Switch
				{...props}
				className={cn(
					'order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2',
					props.className,
				)}
				aria-describedby={`${props.id}-description`}
			/>
			<div className="flex grow items-center gap-3">
				{Icon && <Icon className="shrink-0" width={32} height={32} />}
				<div className="grid grow gap-2">
					<Label htmlFor={props.id}>
						{label}
						{sublabel && (
							<span className="text-muted-foreground text-xs leading-[inherit] font-normal">
								({sublabel})
							</span>
						)}
					</Label>
					<p id={`${props.id}-description`} className="text-muted-foreground text-xs">
						{description}
					</p>
				</div>
			</div>
		</div>
	);
}
