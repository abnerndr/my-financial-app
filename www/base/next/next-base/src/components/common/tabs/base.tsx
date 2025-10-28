import { type VariantProps, tv } from 'tailwind-variants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const tabVariants = tv({
	base: '',
	variants: {
		type: {
			default: '',
			underline: 'data-[state=active]:bg-muted data-[state=active]:shadow-none',
			rounded:
				'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none',
			linear:
				'data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none',
			divisor:
				'bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none',
		},
	},
	defaultVariants: {
		type: 'default',
	},
});

export type TabOptions = {
	label: string;
	value: string;
	content?: React.ReactNode;
};

export interface TabsBaseProps extends VariantProps<typeof tabVariants> {
	tabs: TabOptions[];
	defaultValue?: string;
}

const tabListClasses = {
	default: '',
	underline: 'bg-transparent',
	rounded: 'bg-transparent gap-1',
	linear: 'h-auto rounded-none border-b bg-transparent p-0',
	divisor:
		'before:bg-border relative h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px',
};

export function TabsBase({ tabs, defaultValue, type }: TabsBaseProps) {
	return (
		<Tabs defaultValue={defaultValue} className="items-center">
			<TabsList className={cn(tabListClasses[type ?? 'default'])}>
				{tabs.map((tab) => (
					<TabsTrigger
						className={tabVariants({ type })}
						key={tab.value}
						value={tab.value}
					>
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>
			{tabs.map((tab) => (
				<TabsContent key={tab.value} value={tab.value}>
					{tab.content}
				</TabsContent>
			))}
		</Tabs>
	);
}
