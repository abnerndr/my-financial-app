import { type VariantProps, tv } from 'tailwind-variants';
import type { ComponentPropsWithRef } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const textareaVariants = tv({
	base: '*:not-first:mt-2',
	variants: {
		type: {
			default: '',
			shortener: 'field-sizing-content max-h-29.5 min-h-0 resize-none py-1.75',
		},
		variant: {
			default: '',
			primary:
				'[--ring:var(--color-primary/30)]  in-[.dark]:[--ring:var(--color-primary/90)]',
			indigo:
				'[--ring:var(--color-indigo-300)]  in-[.dark]:[--ring:var(--color-indigo-900)]',
			destructive:
				'[--ring:var(--color-red-300)]  in-[.dark]:[--ring:var(--color-red-900)]',
		},
	},
});

export interface TextareaBaseProps
	extends ComponentPropsWithRef<typeof Textarea>,
		VariantProps<typeof textareaVariants> {
	label?: string;
	error?: string;
}

export function TextareaBase({
	label,
	error,
	variant,
	type,
	...props
}: TextareaBaseProps) {
	return (
		<div className={textareaVariants({ variant: error ? 'destructive' : variant })}>
			<Label htmlFor={props.id}>
				{label} {props.required && <span className="text-destructive">*</span>}
			</Label>
			<Textarea className={cn(textareaVariants({ type }), props.className)} {...props} />
			{error && (
				<p className="text-destructive mt-2 text-xs" role="alert" aria-live="polite">
					{error}
				</p>
			)}
		</div>
	);
}
