'use client';

import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type SelectSearchOptions = {
	value: string;
	label: string;
};

export interface SelectSearchProps {
	name: string;
	label?: string;
	required?: boolean;
	placeholder?: string;
	emptyMessage?: string;
	options: SelectSearchOptions[];
	value?: string;
	onChange?: (value: string) => void;
}

export function SelectSearch({
	name,
	label = '',
	required,
	placeholder = '',
	emptyMessage = 'Nenhum registro encontrado.',
	options,
	value,
	onChange,
}: SelectSearchProps) {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={name}>
				{label} {required && <span className="text-red-500">*</span>}
			</Label>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						id={name}
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between border-input bg-background px-3 font-normal outline-offset-0 outline-none hover:bg-background focus-visible:outline-[3px]"
					>
						<span className={cn('truncate', !value && 'text-muted-foreground')}>
							{value ? options.find((framework) => framework.value === value)?.label : 'Select framework'}
						</span>
						<ChevronDownIcon size={16} className="shrink-0 text-muted-foreground/80" aria-hidden="true" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0" align="start">
					<Command>
						<CommandInput placeholder={placeholder} />
						<CommandList>
							<CommandEmpty>{emptyMessage}</CommandEmpty>
							<CommandGroup>
								{options.map((framework) => (
									<CommandItem
										key={framework.value}
										value={framework.value}
										onSelect={(currentValue) => {
											onChange?.(currentValue === value ? '' : currentValue);
											setOpen(false);
										}}
									>
										{framework.label}
										{value === framework.value && <CheckIcon size={16} className="ml-auto" />}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
