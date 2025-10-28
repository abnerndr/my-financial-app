import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StringHelper } from '@/lib/helpers/string';
import { cn } from '@/lib/utils';
import type { CircumferenceType } from '@/types/circumference';
import type { SizeOptions } from '@/types/size';
import { avatarSizes } from '../utils/sizes';

export interface AvatarProfileProps {
	src?: string;
	alt?: string;
	fallback: string;
	size?: SizeOptions;
	type?: CircumferenceType;
}

export function AvatarProfile({
	src = '',
	alt = '',
	fallback,
	size = 'md',
	type = 'circle',
}: AvatarProfileProps) {
	const initials = StringHelper.initials(fallback);
	const dimension = avatarSizes[size];
	return (
		<Avatar className={cn(type === 'circle' ? 'rounded-full' : 'rounded-md', dimension)}>
			<AvatarImage src={src} alt={alt} />
			<AvatarFallback>{initials}</AvatarFallback>
		</Avatar>
	);
}
