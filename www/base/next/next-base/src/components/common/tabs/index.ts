import { type TabOptions, TabsBase, type TabsBaseProps } from './base';
import { type TabIconOptions, TabsIconBase, type TabsIconBaseProps } from './icon';
import {
	type TabVerticalOptions,
	TabsVerticalBase,
	type TabsVerticalBaseProps,
} from './vertical';
import {
	type TabVerticalIconBaseProps,
	type TabVerticalIconOptions,
	TabsVerticalIconBase,
} from './vertical-icon';

export const Tabs = {
	Base: TabsBase,
	Icon: TabsIconBase,
	Vertical: {
		Base: TabsVerticalBase,
		Icon: TabsVerticalIconBase,
	},
};

export type {
	TabIconOptions,
	TabOptions,
	TabsBaseProps,
	TabsIconBaseProps,
	TabsVerticalBaseProps,
	TabVerticalIconBaseProps,
	TabVerticalIconOptions,
	TabVerticalOptions,
};
