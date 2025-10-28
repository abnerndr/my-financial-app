'use client';

import { Tag, TagInput } from 'emblor';
import { type ComponentProps } from 'react';
import { Label } from '@/components/ui/label';

export type InputWithInnerTagsProps = ComponentProps<typeof TagInput> & {
	label?: string;
	tags?: Tag[];
	error?: string;
};

export function InputWithInnerTags({ label, error, ...props }: InputWithInnerTagsProps) {
	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={props.id}>
				{label} {props.required && <span className="text-red-500">*</span>}
			</Label>
			<TagInput
				styleClasses={{
					inlineTagsContainer:
						'border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1',
					input: 'w-full min-w-[80px] shadow-none px-2 h-7',
					tag: {
						body: 'h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7',
						closeButton:
							'absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground',
					},
				}}
				{...props}
			/>
			{error && <p className="text-sm text-red-500 mt-1">{error}</p>}
		</div>
	);
}
