'use client';

import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DateTimeUtils } from '@/lib/utils/datetime';

export interface SelectTimezoneProps {
	name: string;
	label?: string;
	required?: boolean;
	placeholder?: string;
	error?: string;
	value?: string;
	onChange?: (value: string) => void;
}

export function SelectTimezone({
	name,
	label = '',
	required = false,
	placeholder = 'Search timezone...',
	error,
	value = 'America/Sao_Paulo',
	onChange,
}: SelectTimezoneProps) {
	const [open, setOpen] = useState<boolean>(false);

	const timezones = DateTimeUtils.timezones();
	const formattedTimezones = useMemo(() => {
		return timezones
			.map((timezone) => {
				const formatter = DateTimeUtils.formatterToTimezone(timezone, 'pt-BR');
				const parts = formatter.formatToParts(new Date());
				const offset = parts.find((part) => part.type === 'timeZoneName')?.value || '';
				const modifiedOffset = offset === 'GMT' ? 'GMT+0' : offset;
				return {
					value: timezone,
					label: `(${modifiedOffset}) ${timezone.replace(/_/g, ' ')}`,
					numericOffset: parseInt(offset.replace('GMT', '').replace('+', '') || '0'),
				};
			})
			.sort((a, b) => a.numericOffset - b.numericOffset);
	}, [timezones]);

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
							{value ? formattedTimezones.find((timezone) => timezone.value === value)?.label : 'Select timezone'}
						</span>
						<ChevronDownIcon size={16} className="shrink-0 text-muted-foreground/80" aria-hidden="true" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0" align="start">
					<Command
						filter={(value, search) => {
							const normalizedValue = value.toLowerCase();
							const normalizedSearch = search.toLowerCase().replace(/\s+/g, '');
							return normalizedValue.includes(normalizedSearch) ? 1 : 0;
						}}
					>
						<CommandInput placeholder={placeholder} />
						<CommandList>
							<CommandEmpty>Nenhum fuso horário encontrado.</CommandEmpty>
							<CommandGroup>
								{formattedTimezones.map(({ value: itemValue, label }) => (
									<CommandItem
										key={itemValue}
										value={itemValue}
										onSelect={(currentValue) => {
											onChange?.(currentValue === value ? '' : currentValue);
											setOpen(false);
										}}
									>
										{label}
										{value === itemValue && <CheckIcon size={16} className="ml-auto" />}
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
