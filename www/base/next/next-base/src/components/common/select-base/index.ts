import { SelectAvatar, SelectAvatarOptions, SelectAvatarProps } from './components/select-avatar';
import { SelectDescription, SelectDescriptionOptions, SelectDescriptionProps } from './components/select-description';
import { SelectGroups, SelectGroupsOptions, SelectGroupsProps } from './components/select-groups';
import { SelectSearch, SelectSearchOptions, SelectSearchProps } from './components/select-search';
import { SelectOptions, SelectSimple, SelectSimpleProps } from './components/select-simple';
import { SelectStatus, SelectStatusOptions, SelectStatusProps } from './components/select-status';
import { SelectTimezone, SelectTimezoneProps } from './components/select-timezone';

export const SelectBase = {
	Simple: SelectSimple,
	Group: SelectGroups,
	Status: SelectStatus,
	Description: SelectDescription,
	Avatar: SelectAvatar,
	Timezone: SelectTimezone,
	Search: SelectSearch,
};

export type {
	SelectAvatarOptions,
	SelectAvatarProps,
	SelectDescriptionOptions,
	SelectDescriptionProps,
	SelectGroupsOptions,
	SelectGroupsProps,
	SelectOptions,
	SelectSearchOptions,
	SelectSearchProps,
	SelectSimpleProps,
	SelectStatusOptions,
	SelectStatusProps,
	SelectTimezoneProps,
};
