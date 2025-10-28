import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export type RadioDescriptionItems = {
	value: string;
	label: string;
	sublabel?: string;
	description: string;
};

export interface RadioDescriptionProps {
	defaultValue?: string | undefined;
	items: RadioDescriptionItems[];
	onSelected?: (value: string) => void;
}

export function RadioDescription({ defaultValue, items, onSelected }: RadioDescriptionProps) {
	return (
		<RadioGroup className="gap-6" defaultValue={defaultValue}>
			{items.map((item) => (
				<div className="flex items-start gap-2">
					<RadioGroupItem
						value={item.value}
						id={item.value}
						aria-describedby={`${item.value}-description`}
						onClick={() => onSelected?.(item.value)}
					/>
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
			))}
		</RadioGroup>
	);
}
