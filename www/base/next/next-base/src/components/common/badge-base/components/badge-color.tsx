import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CircumferenceType } from '@/types/circumference';

export interface BadgeColorProps {
	text: string;
	type?: CircumferenceType;
	variant?: 'success' | 'error' | 'warning' | 'info';
}

const variantColors = {
	success: 'bg-emerald-500',
	error: 'bg-red-500',
	warning: 'bg-yellow-500',
	info: 'bg-blue-500',
};

export function BadgeColor({
	text,
	type = 'circle',
	variant = 'success',
}: BadgeColorProps) {
	const variantColor = variantColors[variant];
	return (
		<Badge
			variant="outline"
			className={cn(type === 'circle' ? '' : 'rounded', 'gap-1.5')}
		>
			<span
				className={cn('size-1.5 rounded-full ', variantColor)}
				aria-hidden="true"
			></span>
			{text}
		</Badge>
	);
}
