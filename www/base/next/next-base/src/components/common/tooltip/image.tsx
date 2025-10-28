import { type VariantProps, tv } from 'tailwind-variants';
import Image from 'next/image';
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

export interface TooltipImageProps extends VariantProps<typeof tooltipVariants> {
	title: string;
	description?: string;
	delayDuration?: number;
	children: React.ReactNode;
	src: string;
	alt?: string;
}

export function TooltipImage({
	title,
	description,
	delayDuration,
	children,
	dark,
	src,
	alt = 'Content image',
}: TooltipImageProps) {
	return (
		<TooltipProvider delayDuration={delayDuration ?? 0}>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent className={tooltipVariants({ dark })}>
					<div className="space-y-2">
						<Image
							className="w-full rounded"
							src={src}
							width={382}
							height={216}
							alt={alt}
						/>
						<div className="space-y-1">
							<p className="text-[13px] font-medium">{title}</p>
							<p className="text-muted-foreground text-xs">{description}</p>
						</div>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
