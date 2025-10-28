import {
	BreadcrumbLabel,
	type BreadcrumbLabelProps,
} from './components/breadcrumb-label';
import {
	type BreadcrumbItemType,
	BreadcrumbSimple,
	type BreadcrumbSimpleProps,
} from './components/breadcrumb-simple';

export const BreadcrumbBase = {
	Simple: BreadcrumbSimple,
	Label: BreadcrumbLabel,
};

export type { BreadcrumbItemType, BreadcrumbLabelProps, BreadcrumbSimpleProps };
