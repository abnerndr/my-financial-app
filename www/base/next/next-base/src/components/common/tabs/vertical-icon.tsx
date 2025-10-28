import { type VariantProps, tv } from 'tailwind-variants';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { IconProps } from '@/types/icons';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tabVariants = tv({
	base: '',
	variants: {
		type: {
			default: 'w-full',
			underline: 'data-[state=active]:bg-muted w-full justify-start data-[state=active]:shadow-none',
			linear:
				'data-[state=active]:after:bg-primary relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none',
		},
	},
	defaultVariants: {
		type: 'default',
	},
});

export type TabVerticalIconOptions = {
	icon: IconProps;
	amount?: number;
	delayDuration?: number;
	label: string;
	value: string;
	content?: React.ReactNode;
};

export interface TabVerticalIconBaseProps extends VariantProps<typeof tabVariants> {
	tabs: TabVerticalIconOptions[];
	defaultValue?: string;
}

export function TabsVerticalIconBase({ tabs, defaultValue }: TabVerticalIconBaseProps) {
	return (
		<Tabs defaultValue={defaultValue} orientation="vertical" className="w-full flex-row">
			<TabsList className="flex-col">
				{tabs.map((tab) => (
					<TooltipProvider delayDuration={tab.delayDuration ?? 0} key={tab.value}>
						<Tooltip>
							<TooltipTrigger asChild>
								<span className={tab.amount ? 'relative' : ''}>
									<TabsTrigger value={tab.value} className="py-3">
										{tab.icon && <tab.icon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />}
										{tab.amount && (
											<Badge className="border-background absolute -top-2.5 left-full min-w-4 -translate-x-1.5 px-0.5 text-[10px]/[.875rem] transition-opacity group-data-[state=inactive]:opacity-50">
												{tab.amount}
											</Badge>
										)}
									</TabsTrigger>
								</span>
							</TooltipTrigger>
							<TooltipContent side="right" className="px-2 py-1 text-xs">
								{tab.label}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				))}
			</TabsList>
			<div className="grow rounded-md border text-start">
				{tabs.map((tab) => (
					<TabsContent key={tab.value} value={tab.value}>
						{tab.content}
					</TabsContent>
				))}
			</div>
		</Tabs>
	);
}
