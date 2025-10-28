import { TooltipBase, type TooltipBaseProps } from './base';
import { TooltipDescription, type TooltipDescriptionProps } from './description';
import { TooltipImage, type TooltipImageProps } from './image';
import { TooltipNews, type TooltipNewsProps } from './news';
import {
	type PostData,
	type ProfileData,
	TooltipProfileCard,
	type TooltipProfileCardProps,
} from './profile';
import { type StatsOptions, TooltipStats, type TooltipStatsProps } from './stats';

export const Tooltip = {
	Base: TooltipBase,
	Description: TooltipDescription,
	Image: TooltipImage,
	News: TooltipNews,
	Profile: TooltipProfileCard,
	Stats: TooltipStats,
};

export type {
	PostData,
	ProfileData,
	StatsOptions,
	TooltipBaseProps,
	TooltipDescriptionProps,
	TooltipImageProps,
	TooltipNewsProps,
	TooltipProfileCardProps,
	TooltipStatsProps,
};
