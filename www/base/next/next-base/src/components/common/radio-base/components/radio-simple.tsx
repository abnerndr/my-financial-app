import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export type RadioItems = {
	value: string;
	label: string;
};

export interface RadioSimpleProps {
	defaultValue?: string | undefined;
	items: RadioItems[];
	onSelected?: (value: string) => void;
}

export function RadioSimple({ defaultValue, items, onSelected }: RadioSimpleProps) {
	return (
		<RadioGroup defaultValue={defaultValue}>
			{items.map((item) => (
				<div className="flex items-center gap-2" key={item.value}>
					<RadioGroupItem value={item.value} id={item.value} onClick={() => onSelected?.(item.value)} />
					<Label htmlFor={item.value}>{item.label}</Label>
				</div>
			))}
		</RadioGroup>
	);
}
