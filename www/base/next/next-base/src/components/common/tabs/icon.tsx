import { type VariantProps, tv } from 'tailwind-variants';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { IconProps } from '@/types/icons';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tabVariants = tv({
	base: '',
	variants: {
		type: {
			default: '',
			underline:
				'data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e',
			rounded:
				'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none',
			linear:
				'hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none',
			divisor:
				'bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none',
		},
	},
	defaultVariants: {
		type: 'default',
	},
});

export type TabIconOptions = {
	icon: IconProps;
	amount?: number;
	isNew?: boolean;
	label: string;
	value: string;
	content?: React.ReactNode;
};

export interface TabsIconBaseProps extends VariantProps<typeof tabVariants> {
	tabs: TabIconOptions[];
	defaultValue?: string;
}

const tabListClasses = {
	default: 'mb-3',
	underline: 'bg-background mb-3 h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse',
	rounded: 'mb-3 gap-1 bg-transparent',
	linear: 'text-foreground mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1',
	divisor:
		'before:bg-border relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px',
};

export function TabsIconBase({ tabs, defaultValue, type }: TabsIconBaseProps) {
	return (
		<Tabs defaultValue={defaultValue}>
			<ScrollArea>
				<TabsList className={tabListClasses[type ?? 'default']}>
					{tabs.map((tab) => (
						<TabsTrigger value={tab.value} key={tab.value}>
							{tab.icon && <tab.icon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />}
							{tab.label}
							{tab.amount && (
								<Badge
									className="bg-primary/15 ms-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50"
									variant="secondary"
								>
									{tab.amount}
								</Badge>
							)}
							{tab.isNew && (
								<Badge className="ms-1.5 transition-opacity group-data-[state=inactive]:opacity-50">Novo</Badge>
							)}
						</TabsTrigger>
					))}
				</TabsList>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
			{tabs.map((tab) => (
				<TabsContent key={tab.value} value={tab.value}>
					{tab.content}
				</TabsContent>
			))}
		</Tabs>
	);
}
