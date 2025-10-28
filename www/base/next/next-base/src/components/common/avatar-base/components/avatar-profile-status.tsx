import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StringHelper } from '@/lib/helpers/string';
import { cn } from '@/lib/utils';
import type { CircumferenceType } from '@/types/circumference';
import type { SizeOptions } from '@/types/size';
import { avatarSizes } from '../utils/sizes';

export interface AvatarProfileStatusProps {
	src?: string;
	alt?: string;
	fallback: string;
	size?: SizeOptions;
	type?: CircumferenceType;
	statusPosition?: 'top' | 'bottom';
	status?: 'online' | 'offline' | 'busy';
}

const statusColors = {
	online: 'bg-emerald-500',
	offline: 'bg-muted-foreground',
	busy: 'bg-red-500',
};

export function AvatarProfileStatus({
	src = '',
	alt = '',
	type = 'circle',
	fallback,
	size = 'md',
	statusPosition = 'bottom',
	status = 'online',
}: AvatarProfileStatusProps) {
	const initials = StringHelper.initials(fallback);
	const dimension = avatarSizes[size];
	const statusColor = statusColors[status];
	return (
		<div className="relative">
			<Avatar
				className={cn(type === 'circle' ? 'rounded-full' : 'rounded-md', dimension)}
			>
				<AvatarImage src={src} alt={alt} />
				<AvatarFallback>{initials}</AvatarFallback>
			</Avatar>
			{statusPosition === 'bottom' ? (
				<span
					className={cn(
						'absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background',
						statusColor,
					)}
				>
					<span className="sr-only">{status}</span>
				</span>
			) : (
				<span
					className={cn(
						'absolute -end-1 -top-1 size-3 rounded-full border-2 border-background',
						statusColor,
					)}
				>
					<span className="sr-only">{status}</span>
				</span>
			)}
		</div>
	);
}
