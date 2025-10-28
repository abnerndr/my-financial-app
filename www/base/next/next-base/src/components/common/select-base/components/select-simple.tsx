import { type ComponentProps } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type SelectOptions = {
	value: string;
	label: string;
};

export interface SelectSimpleProps extends ComponentProps<typeof Select> {
	label?: string;
	placeholder?: string;
	error?: string;
	options: SelectOptions[];
}

export function SelectSimple({ label = '', error, placeholder, options, ...props }: SelectSimpleProps) {
	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={props.name}>
				{label}
				{props.required && <span className="text-destructive">*</span>}
			</Label>
			<Select {...props}>
				<SelectTrigger id={props.name} aria-invalid={!!error}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{error && <p className="text-destructive text-sm mt-1">{error}</p>}
		</div>
	);
}
