import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { IconProps } from '@/types/icons';

export type RadioLabelItems = {
	value: string;
	label: string;
	icon: IconProps;
	sublabel?: string;
	description: string;
};

export interface RadioLabelProps {
	defaultValue?: string | undefined;
	items: RadioLabelItems[];
	onSelected?: (value: string) => void;
}

export function RadioLabel({ defaultValue, items, onSelected }: RadioLabelProps) {
	return (
		<RadioGroup className="gap-2" defaultValue={defaultValue}>
			{items.map((item) => (
				<div className="relative flex w-full items-start gap-2 rounded-md border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/50">
					<RadioGroupItem
						onClick={() => onSelected?.(item.value)}
						value={item.value}
						id={item.value}
						aria-describedby={`${item.value}-description`}
						className="order-1 after:absolute after:inset-0"
					/>
					<div className="flex grow items-center gap-3">
						<item.icon className="shrink-0" width={32} height={32} aria-hidden="true" />
						<div className="grid grow gap-2">
							<Label htmlFor={item.value}>
								{item.label}{' '}
								<span className="text-xs leading-[inherit] font-normal text-muted-foreground">({item.sublabel})</span>
							</Label>
							<p id={`${item.value}-description`} className="text-xs text-muted-foreground">
								{item.description}
							</p>
						</div>
					</div>
				</div>
			))}
		</RadioGroup>
	);
}
