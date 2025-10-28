import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export type RadioTableItems = {
	value: string;
	label: string;
	price: string;
};

export interface RadioTableProps {
	label?: string;
	defaultValue?: string | undefined;
	items: RadioTableItems[];
	onSelected?: (value: string) => void;
}

export function RadioTable({ defaultValue, label = '', items, onSelected }: RadioTableProps) {
	return (
		<fieldset className="space-y-4">
			<legend className="text-sm leading-none font-medium text-foreground">{label}</legend>
			<RadioGroup className="gap-0 -space-y-px rounded-md shadow-xs " defaultValue={defaultValue}>
				{items.map((item) => (
					<div
						key={item.value}
						className="relative flex flex-col gap-4 border border-input p-4 outline-none first:rounded-t-md last:rounded-b-md has-data-[state=checked]:z-10 has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent"
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<RadioGroupItem
									id={item.value}
									value={item.value}
									className="after:absolute after:inset-0"
									onClick={() => onSelected?.(item.value)}
								/>
								<Label className="inline-flex items-start" htmlFor={item.value}>
									{item.label}
									{item.value === '2' && <Badge className="ms-2 -mt-1">Popular</Badge>}
								</Label>
							</div>
							<div id={`${`${item.value}`}-price`} className="text-xs leading-[inherit] text-muted-foreground">
								{item.price}
							</div>
						</div>
					</div>
				))}
			</RadioGroup>
		</fieldset>
	);
}
