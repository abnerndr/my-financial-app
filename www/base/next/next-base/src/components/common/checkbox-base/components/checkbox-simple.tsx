'use client';

import type { ComponentPropsWithRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface CheckboxSimpleProps extends ComponentPropsWithRef<typeof Checkbox> {
	text: string;
}

export function CheckboxSimple({ text, ...props }: CheckboxSimpleProps) {
	return (
		<div className="flex items-center gap-2">
			<Checkbox {...props} />
			<Label htmlFor={props.id}>{text}</Label>
		</div>
	);
}
