'use client';

import { HomeIcon, SettingsIcon, TrashIcon } from 'lucide-react';
import {
	DropdownBase,
	type DropdownGroupedItems,
	type DropdownRadioItems,
	type DropdownSimpleOptions,
} from '@/components/common/dropdown-base';
import type {
	DropdownProfile,
	DropdownProfileGroup,
} from '@/components/common/dropdown-base/components/dropdown-profile';

const dropdownItems = [
	{
		label: 'Item 1',
		value: 'item1',
	},
	{
		label: 'Item 2',
		value: 'item2',
	},
] as DropdownSimpleOptions[];

const dropdownGroupedItems = [
	{
		label: 'Group 1',
		items: [
			{
				icon: HomeIcon,
				label: 'Item 1',
				variant: 'default',
			},
			{
				icon: SettingsIcon,
				label: 'Item 2',
				variant: 'default',
			},
		],
	},
	{
		label: 'Group 2',
		items: [
			{
				icon: TrashIcon,
				label: 'Item 3',
				variant: 'destructive',
			},
		],
	},
] as DropdownGroupedItems[];

const dropdownRadioItems = [
	{
		label: 'Next.js',
		value: 'nextjs',
	},
	{
		label: 'Nuxt.js',
		value: 'nuxtjs',
	},
	{
		label: 'SvelteKit',
		value: 'sveltekit',
		disabled: true,
	},
] as DropdownRadioItems[];

const dropdownProfileItems = [
	{
		id: 'group1',
		items: [
			{
				icon: SettingsIcon,
				label: 'Settings',
				value: 'settings',
			},
		],
	},
] as DropdownProfileGroup[];

const profile = {
	name: 'Abner Ruperth',
	email: 'abner@example.com',
	imageUrl:
		'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611746.jpg?semt=ais_hybrid&w=740&q=80',
} as DropdownProfile;

export default function DropdownPage() {
	return (
		<div className="w-full flex flex-col h-screen justify-center gap-y-4 my-20">
			<div className="w-full max-w-md mx-auto flex justify-center flex-row items-center gap-x-4 ">
				<DropdownBase.Simple items={dropdownItems} label="Simple Dropdown" />
				<DropdownBase.Grouped items={dropdownGroupedItems} label="Grouped Dropdown" />
				<DropdownBase.Radio items={dropdownRadioItems} label="Radio Dropdown" />
				<DropdownBase.Profile
					items={dropdownProfileItems}
					profile={profile}
					logout={() => {}}
				/>
			</div>
		</div>
	);
}
