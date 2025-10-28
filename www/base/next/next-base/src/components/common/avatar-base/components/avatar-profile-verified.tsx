import { VerifiedIcon } from '@/components/images/verified';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StringHelper } from '@/lib/helpers/string';
import { cn } from '@/lib/utils';
import type { CircumferenceType } from '@/types/circumference';
import type { SizeOptions } from '@/types/size';
import { avatarSizes } from '../utils/sizes';

export interface AvatarProfileVerifiedProps {
	src?: string;
	alt?: string;
	fallback: string;
	size?: SizeOptions;
	type?: CircumferenceType;
}

export function AvatarProfileVerified({
	src = '',
	alt = '',
	fallback,
	size = 'md',
	type = 'circle',
}: AvatarProfileVerifiedProps) {
	const initials = StringHelper.initials(fallback);
	const dimension = avatarSizes[size];
	return (
		<div className="relative">
			<Avatar
				className={cn(type === 'circle' ? 'rounded-full' : 'rounded-md', dimension)}
			>
				<AvatarImage src={src} alt={alt} />
				<AvatarFallback>{initials}</AvatarFallback>
			</Avatar>
			<span className="absolute -end-1.5 -top-1.5">
				<span className="sr-only">Verified</span>
				<VerifiedIcon />
			</span>
		</div>
	);
}
