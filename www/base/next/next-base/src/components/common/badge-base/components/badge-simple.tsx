import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CircumferenceType } from '@/types/circumference';
import type { IconProps } from '@/types/icons';

export interface BadgeSimpleProps {
	text: string;
	type?: CircumferenceType;
	icon?: IconProps;
}

export function BadgeSimple({ text, type = 'circle', icon: Icon }: BadgeSimpleProps) {
	return (
		<Badge className={cn(type === 'circle' ? '' : 'rounded')}>
			{Icon && <Icon className="-ms-0.5 opacity-60" size={12} aria-hidden="true" />}
			{text}
		</Badge>
	);
}
