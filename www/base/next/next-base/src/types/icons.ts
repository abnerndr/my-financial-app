import type { RemixiconComponentType } from '@remixicon/react';
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export type LucideIconProps = ForwardRefExoticComponent<
	Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>;
export type RemixIconProps = RemixiconComponentType;
export type IconProps = LucideIconProps | RemixIconProps;
