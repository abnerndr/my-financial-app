'use client';

import { BannerBase } from '@/components/common/banner-base';

export default function BannerPage() {
	return (
		<div className="w-full px-10 mx-auto h-screen flex justify-center flex-col gap-y-6 items-center my-10">
			<BannerBase.Consent
				message="We use cookies to improve your experience, analyze site usage, and show personalized content."
				acceptText="Accept"
				declineText="Decline"
				onAccept={() => {}}
				onDecline={() => {}}
			/>
			<BannerBase.Redirect
				emoji="✨"
				message="Introducing transactional and marketing emails"
				href="#"
			/>
			<BannerBase.Download
				version="v2.1.0"
				message="A new version is available."
				downloadText="Update Now"
				updatingText="Updating..."
				onDownload={() => {}}
				isLoading={false}
			/>
		</div>
	);
}
