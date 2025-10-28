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

export type SelectAvatarOptions = {
	value: string;
	label: string;
	src: string;
};

export interface SelectAvatarProps extends ComponentProps<typeof Select> {
	label?: string;
	placeholder?: string;
	error?: string;
	optionsTitle: string;
	options: SelectAvatarOptions[];
}

export function SelectAvatar({ label, placeholder, error, options, optionsTitle, ...props }: SelectAvatarProps) {
	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={props.name}>
				{label} {props.required && <span className="text-red-500">*</span>}
			</Label>
			<Select {...props}>
				<SelectTrigger
					id={props.name}
					aria-invalid={!!error}
					className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0"
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
					<SelectGroup>
						<SelectLabel className="ps-2">{optionsTitle}</SelectLabel>
						{options.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								<img className="size-5 rounded" src={item.src} alt={item.label} width={20} height={20} />
								<span className="truncate">{item.label}</span>
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
