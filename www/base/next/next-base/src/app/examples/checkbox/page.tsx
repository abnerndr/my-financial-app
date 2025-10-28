'use client';

import { HomeIcon } from 'lucide-react';
import { CheckboxBase, type CheckboxLabelItems } from '@/components/common/checkbox-base';
import { MasterCardIcon } from '@/components/images/master-card';

const groupItems: CheckboxLabelItems[] = [
	{
		label: 'Option 1',
		value: 'option1',
		defaultChecked: true,
		icon: HomeIcon,
	},
	{
		label: 'Option 2',
		value: 'option2',
		defaultChecked: false,
		icon: HomeIcon,
	},
	{
		label: 'Option 3',
		value: 'option3',
		defaultChecked: false,
		icon: HomeIcon,
	},
	{
		label: 'Option 4',
		value: 'option4',
		defaultChecked: false,
		icon: HomeIcon,
	},
];

export default function CheckboxPage() {
	return (
		<div className="w-full max-w-md mx-auto h-screen flex justify-center flex-col gap-y-10 items-center ">
			<CheckboxBase.Simple text="Basic Checkbox" />
			<CheckboxBase.Label.Simple
				label="Card Checkbox"
				description="This is a card checkbox"
			/>
			<CheckboxBase.Label.Icon
				label="Group Checkbox"
				description="This is a group checkbox"
				icon={MasterCardIcon}
			/>
			<CheckboxBase.Label.Group items={groupItems} />
		</div>
	);
}
