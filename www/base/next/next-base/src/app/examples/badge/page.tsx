'use client';

import { BoltIcon } from 'lucide-react';
import { BadgeBase } from '@/components/common/badge-base';

export default function BadgePage() {
	return (
		<div className="w-full max-w-md mx-auto h-screen flex justify-center flex-col gap-y-2 items-center my-10">
			<h2>Default Badge</h2>
			<BadgeBase.Simple text="Default Badge" />
			<BadgeBase.Simple text="Default Badge" type="square" icon={BoltIcon} />
			<h2>Badge Color</h2>
			<BadgeBase.Color text="Red Badge" variant="error" />
			<BadgeBase.Color text="Red Badge" variant="error" type="square" />
			<BadgeBase.Color text="Blue Badge" variant="info" />
			<BadgeBase.Color text="Blue Badge" variant="info" type="square" />
			<BadgeBase.Color text="Green Badge" variant="success" />
			<BadgeBase.Color text="Green Badge" variant="success" type="square" />
			<BadgeBase.Color text="Yellow Badge" variant="warning" />
			<BadgeBase.Color text="Yellow Badge" variant="warning" type="square" />
			<h2>Badge Status</h2>
			<BadgeBase.Status text="Success Badge" status="success" type="circle" />
			<BadgeBase.Status text="Success Badge" status="success" type="square" />
			<BadgeBase.Status text="Error Badge" status="error" type="circle" />
			<BadgeBase.Status text="Error Badge" status="error" type="square" />
			<BadgeBase.Status text="Warning Badge" status="warning" type="circle" />
			<BadgeBase.Status text="Warning Badge" status="warning" type="square" />
			<BadgeBase.Status text="Info Badge" status="info" type="circle" />
			<BadgeBase.Status text="Info Badge" status="info" type="square" />
		</div>
	);
}
