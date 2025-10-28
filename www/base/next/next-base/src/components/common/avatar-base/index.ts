import { AvatarProfile, type AvatarProfileProps } from './components/avatar-profile';
import {
	AvatarProfileStatus,
	type AvatarProfileStatusProps,
} from './components/avatar-profile-status';
import {
	AvatarProfileVerified,
	type AvatarProfileVerifiedProps,
} from './components/avatar-profile-verified';

export const AvatarBase = {
	Simple: AvatarProfile,
	Status: AvatarProfileStatus,
	Verified: AvatarProfileVerified,
};

export type { AvatarProfileProps, AvatarProfileStatusProps, AvatarProfileVerifiedProps };
