import { ButtonBookmark, type ButtonBookmarkProps } from './components/button-bookmark';
import {
	ButtonCenteredIcon,
	type ButtonCenteredIconProps,
} from './components/button-centered-icon';
import { ButtonCopy, type ButtonCopyProps } from './components/button-copy';
import { ButtonCount, type ButtonCountProps } from './components/button-count';
import { ButtonKeyword, type ButtonKeywordProps } from './components/button-keyword';
import { ButtonLike, type ButtonLikeProps } from './components/button-like';
import { ButtonLink, type ButtonLinkProps } from './components/button-link';
import {
	ButtonProfileUsername,
	type ButtonProfileUsernameProps,
} from './components/button-profile-username';
import { ButtonSimple, type ButtonSimpleProps } from './components/button-simple';
import {
	ButtonToggleTheme,
	type ButtonToggleThemeProps,
} from './components/button-toggle-theme';

export const ButtonBase = {
	Simple: ButtonSimple,
	ToggleTheme: ButtonToggleTheme,
	Keyword: ButtonKeyword,
	Profile: ButtonProfileUsername,
	CenteredIcon: ButtonCenteredIcon,
	Bookmark: ButtonBookmark,
	Count: ButtonCount,
	Copy: ButtonCopy,
	Like: ButtonLike,
	Link: ButtonLink,
};

export type {
	ButtonBookmarkProps,
	ButtonCenteredIconProps,
	ButtonCopyProps,
	ButtonCountProps,
	ButtonKeywordProps,
	ButtonLikeProps,
	ButtonLinkProps,
	ButtonProfileUsernameProps,
	ButtonSimpleProps,
	ButtonToggleThemeProps,
};
