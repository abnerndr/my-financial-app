'use client';

import { RadioBase, type RadioItems, type RadioLabelItems, type RadioTableItems } from '@/components/common/radio-base';
import { MasterCardIcon } from '@/components/images/master-card';
import { PrismaLogo } from '@/components/images/prisma-logo';

const simpleItems: RadioItems[] = [
	{
		value: 'option1',
		label: 'Option 1',
	},
	{
		value: 'option2',
		label: 'Option 2',
	},
];

const labelItems: RadioLabelItems[] = [
	{
		value: '1',
		label: 'Option 1',
		icon: PrismaLogo,
		description: 'This is the description for option 1.',
		sublabel: 'Sublabel 1',
	},
	{
		value: '2',
		label: 'Option 2',
		icon: MasterCardIcon,
		description: 'This is the description for option 2.',
		sublabel: 'Sublabel 2',
	},
];

const tableItems: RadioTableItems[] = [
	{
		label: 'Option 1',
		value: 'option1',
		price: '$10',
	},
	{
		label: 'Option 2',
		value: 'option2',
		price: '$20',
	},
	{
		label: 'Option 3',
		value: 'option3',
		price: '$30',
	},
];

export default function RadioPage() {
	return (
		<div className="w-full flex flex-col h-screen justify-center gap-y-10 my-20">
			<div className="w-full flex justify-center flex-row items-center gap-x-4 mb-14">
				<RadioBase.Simple items={simpleItems} onSelected={(value) => console.log(value)} />
			</div>
			<div className="w-full flex justify-center flex-row items-center gap-x-4 mb-14">
				<RadioBase.Label items={labelItems} onSelected={(value) => console.log(value)} />
			</div>
			<div className="w-full flex justify-center flex-row items-center gap-x-4 mb-14">
				<RadioBase.Description items={labelItems} onSelected={(value) => console.log(value)} />
			</div>
			<div className="w-full flex justify-center flex-row items-center mb-14">
				<RadioBase.Table items={tableItems} onSelected={(value) => console.log(value)} />
			</div>
		</div>
	);
}
