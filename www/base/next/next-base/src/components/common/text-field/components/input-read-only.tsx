import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface InputReadOnlyProps {
	label?: string;
	value: string;
}

export function InputReadOnly({ label, value }: InputReadOnlyProps) {
	const id = useId();
	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={id}>{label}</Label>
			<Input id={id} className="read-only:bg-muted" defaultValue={value} readOnly placeholder="Email" type="email" />
		</div>
	);
}
