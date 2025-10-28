import {
	DropdownGrouped,
	type DropdownGroupedItems,
	type DropdownGroupedProps,
	type GroupedItems,
} from './components/dropdown-grouped';
import {
	DropdownProfile,
	type DropdownProfileItems,
	type DropdownProfileProps,
} from './components/dropdown-profile';
import {
	DropdownRadio,
	type DropdownRadioItems,
	type DropdownRadioProps,
} from './components/dropdown-radio';
import {
	DropdownSimple,
	type DropdownSimpleOptions,
	type DropdownSimpleProps,
} from './components/dropdown-simple';

export const DropdownBase = {
	Simple: DropdownSimple,
	Grouped: DropdownGrouped,
	Radio: DropdownRadio,
	Profile: DropdownProfile,
};

export type {
	DropdownGroupedItems,
	DropdownGroupedProps,
	DropdownProfileItems,
	DropdownProfileProps,
	DropdownRadioItems,
	DropdownRadioProps,
	DropdownSimpleOptions,
	DropdownSimpleProps,
	GroupedItems,
};
