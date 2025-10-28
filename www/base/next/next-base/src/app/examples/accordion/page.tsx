'use client';

import { BellIcon, CommandIcon, EclipseIcon, Link2Icon } from 'lucide-react';
import { AccordionBase } from '@/components/common/accordion-base';

const simpleItems = [
	{
		id: '1',
		title: 'What makes coss.com ui different?',
		content:
			'coss.com ui focuses on developer experience and performance. Built with TypeScript, it offers excellent type safety, follows accessibility standards, and provides comprehensive documentation with regular updates.',
	},
	{
		id: '2',
		title: 'How can I customize the components?',
		content:
			'Use our CSS variables for global styling, or className and style props for component-specific changes. We support CSS modules, Tailwind, and dark mode out of the box.',
	},
];

const iconItems = [
	{
		id: '1',
		icon: CommandIcon,
		title: 'What makes coss.com ui different?',
		content:
			'coss.com ui focuses on developer experience and performance. Built with TypeScript, it offers excellent type safety, follows accessibility standards, and provides comprehensive documentation with regular updates.',
	},
	{
		id: '2',
		icon: EclipseIcon,
		title: 'How can I customize the components?',
		content:
			'Use our CSS variables for global styling, or className and style props for component-specific changes. We support CSS modules, Tailwind, and dark mode out of the box.',
	},
];

const subHeaderItems = [
	{
		id: '1',
		icon: Link2Icon,
		title: 'Connected accounts',
		sub: 'Manage your linked social and work accounts',
		content:
			'Connect your accounts from Google, GitHub, or Microsoft to enable single sign-on and streamline your workflow. Connected accounts can be used for quick login and importing your preferences across platforms. You can revoke access to any connected account at any time.',
	},
	{
		id: '2',
		icon: BellIcon,
		title: 'Notifications',
		sub: 'Customize your notification preferences',
		content:
			'Choose which updates you want to receive. You can get notifications for: security alerts, billing updates, newsletter and product announcements, usage reports, and scheduled maintenance. Notifications can be delivered via email, SMS, or push notifications on your devices.',
	},
];

export default function AccordionPage() {
	return (
		<div className="w-full max-w-md mx-auto h-screen flex justify-center flex-col gap-y-10 items-center my-10">
			<AccordionBase.Simple title="Simple Accordion" items={simpleItems} />
			<AccordionBase.Icon title="Icon Accordion" items={iconItems} />
			<AccordionBase.SubHeader title="SubHeader Accordion" items={subHeaderItems} />
			<AccordionBase.Chevron title="Chevron Accordion" items={simpleItems} />
		</div>
	);
}
