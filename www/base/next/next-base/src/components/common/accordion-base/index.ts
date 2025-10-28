import {
	AccordionChevron,
	type AccordionChevronProps,
} from './components/accordion-chevron';
import {
	AccordionIcon,
	type AccordionIconItems,
	type AccordionIconProps,
} from './components/accordion-icon';
import {
	type AccordionItems,
	AccordionSimple,
	type AccordionSimpleProps,
} from './components/accordion-simple';
import {
	AccordionSubHeader,
	type AccordionSubHeaderItems,
	type AccordionSubHeaderProps,
} from './components/accordion-sub-header';

export const AccordionBase = {
	Simple: AccordionSimple,
	Icon: AccordionIcon,
	SubHeader: AccordionSubHeader,
	Chevron: AccordionChevron,
};

export type {
	AccordionChevronProps,
	AccordionIconItems,
	AccordionIconProps,
	AccordionItems,
	AccordionSimpleProps,
	AccordionSubHeaderItems,
	AccordionSubHeaderProps,
};
