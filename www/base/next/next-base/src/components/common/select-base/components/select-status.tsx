import { type ComponentProps } from 'react';
import { StatusDot } from '@/components/images/status-dot';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type SelectStatusOptions = {
	value: string;
	label: string;
	color: string;
};

export interface SelectStatusProps extends ComponentProps<typeof Select> {
	label?: string;
	placeholder?: string;
	error?: string;
	options: SelectStatusOptions[];
}

export function SelectStatus({
	label = '',
	error,
	options,
	placeholder = 'Selecione um Status',
	...props
}: SelectStatusProps) {
	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={props.name}>
				{label} {props.required && <span className="text-red-500">*</span>}
			</Label>
			<Select {...props}>
				<SelectTrigger
					id={props.name}
					aria-invalid={!!error}
					className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80">
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							<span className="flex items-center gap-2">
								<StatusDot className={option.color} />
								<span className="truncate">{option.label}</span>
							</span>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{error && <p className="text-destructive text-sm mt-1">{error}</p>}
		</div>
	);
}
