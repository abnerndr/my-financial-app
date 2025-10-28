import {
	DialogCardDetails,
	type DialogCardDetailsProps,
} from './components/dialog-card-details';
import { DialogCheckout } from './components/dialog-checkout';
import { DialogDelete, type DialogDeleteProps } from './components/dialog-delete';
import {
	DialogNewsletter,
	type DialogNewsletterProps,
} from './components/dialog-newsletter';
import { DialogProfile } from './components/dialog-profile';
import {
	DialogScrollable,
	type DialogScrollableDescription,
	type DialogScrollableProps,
} from './components/dialog-scrollable';
import { DialogSearch } from './components/dialog-search';
import { DialogSimple, type DialogSimpleProps } from './components/dialog-simple';

export const DialogBase = {
	Simple: DialogSimple,
	Scrollable: DialogScrollable,
	Delete: DialogDelete,
	Newsletter: DialogNewsletter,
	CardDetails: DialogCardDetails,
	Checkout: DialogCheckout,
	Profile: DialogProfile,
	Search: DialogSearch,
};

export type {
	DialogCardDetailsProps,
	DialogDeleteProps,
	DialogNewsletterProps,
	DialogScrollableDescription,
	DialogScrollableProps,
	DialogSimpleProps,
};
