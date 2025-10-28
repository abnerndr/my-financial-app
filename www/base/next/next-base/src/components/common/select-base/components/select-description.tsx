import { type ComponentProps } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type SelectDescriptionOptions = {
	value: string;
	label: string;
	description: string;
};

export interface SelectDescriptionProps extends ComponentProps<typeof Select> {
	label?: string;
	placeholder?: string;
	error?: string;
	options: SelectDescriptionOptions[];
}

export function SelectDescription({ label = '', error, options, placeholder, ...props }: SelectDescriptionProps) {
	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={props.name}>
				{label} {props.required && <span className="text-red-500">*</span>}
			</Label>
			<Select {...props}>
				<SelectTrigger id={props.name} aria-invalid={!!error} className="**:data-desc:hidden">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							<span>
								{option.label}
								<span className="mt-1 block text-xs text-muted-foreground" data-desc>
									{option.description}
								</span>
							</span>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
