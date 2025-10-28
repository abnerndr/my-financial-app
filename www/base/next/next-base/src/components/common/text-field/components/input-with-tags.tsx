'use client';

import { Tag, TagInput } from 'emblor';
import { type ComponentProps, useId } from 'react';
import { Label } from '@/components/ui/label';

export type InputWithTagsProps = ComponentProps<typeof TagInput> & {
	label?: string;
	tags?: Tag[];
	error?: string;
};

export function InputWithTags({ tags, label = '', error, ...props }: InputWithTagsProps) {
	const id = useId();
	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={props.id}>
				{label} {props.required && <span className="text-red-500">*</span>}
			</Label>
			<TagInput
				tags={tags}
				styleClasses={{
					tagList: {
						container: 'gap-1',
					},
					input:
						'rounded-md transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
					tag: {
						body: 'relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7',
						closeButton:
							'absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground',
					},
				}}
				inlineTags={false}
				inputFieldPosition="top"
				{...props}
			/>
			{error && <p className="text-sm text-red-500 mt-1">{error}</p>}
		</div>
	);
}
