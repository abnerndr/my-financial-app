import { CheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CircumferenceType } from '@/types/circumference';

export interface BadgeStatusProps {
	text: string;
	type?: CircumferenceType;
	status?: 'success' | 'error' | 'warning' | 'info';
}

const statusColors = {
	success: 'text-emerald-500',
	error: 'text-red-500',
	warning: 'text-yellow-500',
	info: 'text-blue-500',
};

const statusIcon = {
	success: CheckIcon,
	error: XIcon,
	warning: TriangleAlertIcon,
	info: InfoIcon,
};

export function BadgeStatus({
	text,
	type = 'circle',
	status = 'success',
}: BadgeStatusProps) {
	const Icon = statusIcon[status];
	return (
		<Badge className={cn(type === 'circle' ? '' : 'rounded', 'gap-1')} variant="outline">
			<Icon className={statusColors[status]} size={12} aria-hidden="true" />
			{text}
		</Badge>
	);
}
