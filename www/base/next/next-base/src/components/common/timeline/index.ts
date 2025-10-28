import {
	type ActionType,
	TimelineActivity,
	type TimelineActivityOptions,
	type TimelineActivityProps,
} from './activity';
import { TimelineBase, type TimelineBaseProps, type TimelineOptions } from './base';
import {
	TimelineComment,
	type TimelineCommentOptions,
	type TimelineCommentProps,
} from './comments';
import {
	TimelineHorizontal,
	type TimelineHorizontalOptions,
	type TimelineHorizontalProps,
} from './horizontal';
import { TimelineIcon, type TimelineIconOptions, type TimelineIconProps } from './icon';

export const Timeline = {
	Base: TimelineBase,
	Horizontal: TimelineHorizontal,
	Comments: TimelineComment,
	Icon: TimelineIcon,
	Activity: TimelineActivity,
};

export type {
	ActionType,
	TimelineActivityOptions,
	TimelineActivityProps,
	TimelineBaseProps,
	TimelineCommentOptions,
	TimelineCommentProps,
	TimelineHorizontalOptions,
	TimelineHorizontalProps,
	TimelineIconOptions,
	TimelineIconProps,
	TimelineOptions,
};
