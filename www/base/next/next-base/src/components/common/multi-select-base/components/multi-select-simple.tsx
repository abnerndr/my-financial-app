import type { ComponentProps } from 'react';
import { Label } from '@/components/ui/label';
import MultipleSelector, { Option } from '@/components/ui/multiselect';

const frameworks: Option[] = [
	{
		value: 'next.js',
		label: 'Next.js',
	},
	{
		value: 'sveltekit',
		label: 'SvelteKit',
	},
	{
		value: 'nuxt.js',
		label: 'Nuxt.js',
	},
	{
		value: 'remix',
		label: 'Remix',
	},
	{
		value: 'astro',
		label: 'Astro',
	},
	{
		value: 'angular',
		label: 'Angular',
	},
	{
		value: 'vue',
		label: 'Vue.js',
	},
	{
		value: 'react',
		label: 'React',
	},
	{
		value: 'ember',
		label: 'Ember.js',
	},
	{
		value: 'gatsby',
		label: 'Gatsby',
	},
	{
		value: 'eleventy',
		label: 'Eleventy',
	},
	{
		value: 'solid',
		label: 'SolidJS',
	},
	{
		value: 'preact',
		label: 'Preact',
	},
	{
		value: 'qwik',
		label: 'Qwik',
	},
	{
		value: 'alpine',
		label: 'Alpine.js',
	},
	{
		value: 'lit',
		label: 'Lit',
	},
];

export interface MultiSelectSimpleProps extends ComponentProps<typeof MultipleSelector> {
	label?: string;
	required?: boolean;
	defaultOptions?: Option[];
}

export function MultiSelectSimple({
	label = '',
	placeholder = '',
	required = false,
	defaultOptions,
	...props
}: MultiSelectSimpleProps) {
	return (
		<div className="*:not-first:mt-2">
			<Label>
				{label} {required && <span className="text-red-500">*</span>}
			</Label>
			<MultipleSelector
				commandProps={{
					label: props.commandProps?.label,
				}}
				defaultOptions={defaultOptions}
				placeholder={placeholder}
				emptyIndicator={<p className="text-center text-sm">Nenhum resultado encontrado.</p>}
				{...props}
			/>
		</div>
	);
}
