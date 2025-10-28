'use client';

import { MultiSelectBase } from '@/components/common/multi-select-base';
import {
	type SelectAvatarOptions,
	SelectBase,
	type SelectDescriptionOptions,
	type SelectGroupsOptions,
	type SelectOptions,
	type SelectStatusOptions,
} from '@/components/common/select-base';
import { TimezoneEnum } from '@/types/timezones';

const simpleOptions: SelectOptions[] = [
	{
		value: 'option1',
		label: 'Option 1',
	},
	{
		value: 'option2',
		label: 'Option 2',
	},
];

const groupedOptions: SelectGroupsOptions[] = [
	{
		name: 'Group 1',
		items: [
			{
				value: 'option1',
				label: 'Option 1',
			},
			{
				value: 'option1-1',
				label: 'Option 1-1',
			},
		],
	},
	{
		name: 'Group 2',
		items: [
			{
				value: 'option2',
				label: 'Option 2',
			},
		],
	},
];

const statusOptions: SelectStatusOptions[] = [
	{ value: '1', label: 'Completed', color: 'text-emerald-600' },
	{ value: '2', label: 'In Progress', color: 'text-blue-500' },
	{ value: '3', label: 'Pending', color: 'text-amber-500' },
	{ value: '4', label: 'Cancelled', color: 'text-gray-500' },
	{ value: '5', label: 'Failed', color: 'text-red-500' },
];

const statusDescription: SelectDescriptionOptions[] = [
	{ value: '1', label: 'Completed', description: 'The task has been completed successfully.' },
	{ value: '2', label: 'In Progress', description: 'The task is currently being worked on.' },
	{ value: '3', label: 'Pending', description: 'The task is waiting for approval.' },
	{ value: '4', label: 'Cancelled', description: 'The task has been cancelled.' },
	{ value: '5', label: 'Failed', description: 'The task has failed.' },
];

const avatarOptions: SelectAvatarOptions[] = [
	{
		value: '1',
		label: 'John Doe',
		src: 'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611746.jpg?semt=ais_hybrid&w=740&q=80',
	},
	{
		value: '2',
		label: 'Vanessa Jackson',
		src: 'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611716.jpg?semt=ais_hybrid&w=740&q=80',
	},
];

export default function SelectPage() {
	return (
		<div className="w-full flex flex-col h-screen justify-center gap-y-10 my-20">
			<div className="w-full flex justify-center flex-col items-center mb-14 space-y-6">
				<SelectBase.Simple
					label="Simple Select"
					options={simpleOptions}
					placeholder="Selecione uma opção"
					onValueChange={(value) => console.log(value)}
					name="select-options"
					error="Selecione uma opção válida"
				/>

				<SelectBase.Group
					label="Group Select"
					options={groupedOptions}
					placeholder="Selecione uma opção"
					onValueChange={(value) => console.log(value)}
					name="select-options"
				/>

				<SelectBase.Status
					label="Status Select"
					options={statusOptions}
					onValueChange={(value) => console.log(value)}
					name="select-status-options"
				/>

				<SelectBase.Description
					label="Status Select"
					placeholder="Selecione uma opção"
					options={statusDescription}
					onValueChange={(value) => console.log(value)}
					name="select-description-options"
				/>

				<SelectBase.Avatar
					label="Avatar Select"
					placeholder="Selecione uma opção"
					optionsTitle="users"
					options={avatarOptions}
					onValueChange={(value) => console.log(value)}
					name="select-avatar-options"
				/>

				<SelectBase.Timezone
					label="Timezone Select"
					placeholder="Selecione uma opção"
					onChange={(value) => console.log(value)}
					value={TimezoneEnum.America_Sao_Paulo}
					name="select-timezone-options"
				/>

				<SelectBase.Search
					label="Search Select"
					placeholder="Selecione uma opção"
					options={simpleOptions}
					onChange={(value) => console.log(value)}
					value="option1"
					name="select-search-options"
				/>

				<MultiSelectBase.Simple
					label="Search Select"
					placeholder="Selecione uma opção"
					onChange={(value) => console.log(value)}
					defaultOptions={simpleOptions}
				/>
			</div>
		</div>
	);
}
