import { type VariantProps, tv } from 'tailwind-variants';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

const tooltipVariants = tv({
	base: 'py-3',
	variants: {
		dark: {
			true: 'dark',
			false: '',
		},
	},
});

export type StatsOptions = {
	title: string;
	value: string;
};

export interface TooltipStatsProps extends VariantProps<typeof tooltipVariants> {
	title: string;
	delayDuration?: number;
	children: React.ReactNode;
	stats: StatsOptions[];
}

export function TooltipStats({
	dark,
	children,
	delayDuration,
	stats,
}: TooltipStatsProps) {
	return (
		<TooltipProvider delayDuration={delayDuration ?? 0}>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent className={tooltipVariants({ dark })}>
					<ul className="grid gap-3 text-xs">
						{stats.map((stat) => (
							<li className="grid gap-0.5" key={stat.title}>
								<span className="text-muted-foreground">{stat.title}</span>
								<span className="font-medium">{stat.value}</span>
							</li>
						))}
					</ul>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
