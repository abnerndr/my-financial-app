import { RadioDescription, RadioDescriptionItems, RadioDescriptionProps } from './components/radio-description';
import { RadioLabel, RadioLabelItems, RadioLabelProps } from './components/radio-label';
import { RadioItems, RadioSimple, RadioSimpleProps } from './components/radio-simple';
import { RadioTable, RadioTableItems, RadioTableProps } from './components/radio-table';

export const RadioBase = {
	Simple: RadioSimple,
	Description: RadioDescription,
	Label: RadioLabel,
	Table: RadioTable,
};

export type {
	RadioDescriptionItems,
	RadioDescriptionProps,
	RadioItems,
	RadioLabelItems,
	RadioLabelProps,
	RadioSimpleProps,
	RadioTableItems,
	RadioTableProps,
};
