import {
	CheckboxLabelGroup,
	type CheckboxLabelItems,
	type CheckboxLabelItemsProps,
} from './components/checkbox-label-group';
import {
	CheckboxLabelIcon,
	type CheckboxLabelIconProps,
} from './components/checkbox-label-icon';
import {
	CheckboxLabelSimple,
	type CheckboxLabelSimpleProps,
} from './components/checkbox-label-simple';
import { CheckboxSimple, type CheckboxSimpleProps } from './components/checkbox-simple';

export const CheckboxBase = {
	Simple: CheckboxSimple,
	Label: {
		Simple: CheckboxLabelSimple,
		Icon: CheckboxLabelIcon,
		Group: CheckboxLabelGroup,
	},
};

export type {
	CheckboxLabelIconProps,
	CheckboxLabelItems,
	CheckboxLabelItemsProps,
	CheckboxLabelSimpleProps,
	CheckboxSimpleProps,
};
