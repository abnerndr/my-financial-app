import { type ComponentProps } from 'react';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { SelectOptions } from './select-simple';

export type SelectGroupsOptions = {
	name: string;
	items: SelectOptions[];
};

export interface SelectGroupsProps extends ComponentProps<typeof Select> {
	label?: string;
	placeholder?: string;
	error?: string;
	options: SelectGroupsOptions[];
}

export function SelectGroups({ label = '', error, placeholder, options, ...props }: SelectGroupsProps) {
	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={props.name}>{label}</Label>
			<Select {...props}>
				<SelectTrigger id={props.name} aria-invalid={!!error}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((group) => (
						<SelectGroup key={group.name}>
							<SelectLabel>{group.name}</SelectLabel>
							{group.items.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectGroup>
					))}
				</SelectContent>
			</Select>
			{error && <p className="text-destructive text-sm mt-1">{error}</p>}
		</div>
	);
}
