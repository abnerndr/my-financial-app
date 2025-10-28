import { type VariantProps, tv } from 'tailwind-variants';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { IconProps } from '@/types/icons';

const tooltipVariants = tv({
	base: 'py-3',
	variants: {
		dark: {
			true: 'dark',
			false: '',
		},
	},
});

export interface TooltipDescriptionProps extends VariantProps<typeof tooltipVariants> {
	title: string;
	description: string;
	delayDuration?: number;
	children: React.ReactNode;
	icon?: IconProps;
}

export function TooltipDescription({
	title,
	description,
	delayDuration,
	children,
	dark,
	icon: Icon,
}: TooltipDescriptionProps) {
	return (
		<TooltipProvider delayDuration={delayDuration ?? 0}>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent className={tooltipVariants({ dark })}>
					<div className={cn(Icon ? 'flex gap-3' : 'space-y-1')}>
						{Icon && (
							<Icon className="mt-0.5 shrink-0 opacity-60" size={16} aria-hidden="true" />
						)}
						{Icon ? (
							<div className="space-y-1">
								<p className="text-[13px] font-medium">{title}</p>
								<p className="text-muted-foreground text-xs">{description}</p>
							</div>
						) : (
							<>
								<p className="text-[13px] font-medium">{title}</p>
								<p className="text-muted-foreground text-xs">{description}</p>
							</>
						)}
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
