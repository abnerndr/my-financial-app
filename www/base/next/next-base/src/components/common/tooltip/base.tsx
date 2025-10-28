import { type VariantProps, tv } from 'tailwind-variants';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

const tooltipVariants = tv({
	base: 'px-2 py-1 text-xs',
	variants: {
		dark: {
			true: 'dark',
			false: '',
		},
	},
});

export interface TooltipBaseProps extends VariantProps<typeof tooltipVariants> {
	text: string;
	delayDuration?: number;
	children: React.ReactNode;
}

export function TooltipBase({ text, delayDuration, children, dark }: TooltipBaseProps) {
	return (
		<TooltipProvider delayDuration={delayDuration ?? 0}>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent className={tooltipVariants({ dark })}>{text}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
