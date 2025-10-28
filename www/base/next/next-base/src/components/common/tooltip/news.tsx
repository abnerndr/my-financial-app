import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';

export interface TooltipNewsProps {
	title: string;
	description: string;
	children: React.ReactNode;
	readTime: string;
	updatedTime: string;
}

export function TooltipNews({
	title,
	description,
	children,
	readTime,
	updatedTime,
}: TooltipNewsProps) {
	return (
		<div className="max-w-md text-sm">
			<HoverCard>
				<HoverCardTrigger asChild>{children}</HoverCardTrigger>
				<HoverCardContent className="w-[320px]">
					<div className="space-y-3">
						<div className="space-y-1">
							<h2 className="font-semibold">{title}</h2>
							<p className="text-muted-foreground text-sm">{description}</p>
						</div>
						<div className="text-muted-foreground flex items-center gap-2 text-xs">
							<span>{readTime} min read</span>
							<span>·</span>
							<span>{updatedTime}</span>
						</div>
					</div>
				</HoverCardContent>
			</HoverCard>
		</div>
	);
}
