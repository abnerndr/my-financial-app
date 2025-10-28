import { BadgeColor, type BadgeColorProps } from './components/badge-color';
import { BadgeSimple, type BadgeSimpleProps } from './components/badge-simple';
import { BadgeStatus, type BadgeStatusProps } from './components/badge-status';

export const BadgeBase = {
	Simple: BadgeSimple,
	Color: BadgeColor,
	Status: BadgeStatus,
};

export type { BadgeColorProps, BadgeSimpleProps, BadgeStatusProps };
