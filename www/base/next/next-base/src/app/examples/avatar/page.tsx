import { AvatarBase } from '@/components/common/avatar-base';

const profilePicture =
	'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611746.jpg?semt=ais_hybrid&w=740&q=80';
const profilePicture2 =
	'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611716.jpg?semt=ais_hybrid&w=740&q=80';
const profilePicture3 =
	'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611701.jpg?semt=ais_hybrid&w=740&q=80';

export default function AvatarPage() {
	return (
		<div className="w-full max-w-md mx-auto h-screen flex justify-center flex-col items-center gap-y-4 ">
			<AvatarBase.Simple
				src={profilePicture}
				fallback="Claudio Alcides"
				alt="Profile"
				size="md"
			/>
			<AvatarBase.Simple
				src={profilePicture}
				fallback="Claudio Alcides"
				alt="Profile"
				size="md"
				type="square"
			/>
			<AvatarBase.Status
				src={profilePicture2}
				fallback="Lara Golveia"
				alt="Profile"
				size="lg"
			/>
			<AvatarBase.Status
				src={profilePicture2}
				fallback="Lara Golveia"
				alt="Profile"
				size="lg"
				status="offline"
				type="square"
			/>
			<AvatarBase.Verified
				src={profilePicture3}
				fallback="Julia Luiza"
				alt="Profile"
				size="xl"
			/>
			<AvatarBase.Verified
				src={profilePicture3}
				fallback="Julia Luiza"
				alt="Profile"
				size="xl"
				type="square"
			/>
		</div>
	);
}
