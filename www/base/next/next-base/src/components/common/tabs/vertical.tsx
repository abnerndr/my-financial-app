import { type VariantProps, tv } from 'tailwind-variants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { IconProps } from '@/types/icons';

const tabVariants = tv({
	base: '',
	variants: {
		type: {
			default: 'w-full',
			underline:
				'data-[state=active]:bg-muted w-full justify-start data-[state=active]:shadow-none',
			linear:
				'data-[state=active]:after:bg-primary relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none',
		},
	},
	defaultVariants: {
		type: 'default',
	},
});

export type TabVerticalOptions = {
	icon: IconProps;
	label: string;
	value: string;
	content?: React.ReactNode;
};

export interface TabsVerticalBaseProps extends VariantProps<typeof tabVariants> {
	tabs: TabVerticalOptions[];
	defaultValue?: string;
}

const tabListClasses = {
	default: 'flex-col',
	underline: 'flex-col gap-1 bg-transparent py-0',
	linear: 'flex-col rounded-none border-l bg-transparent p-0',
};

export function TabsVerticalBase({ tabs, defaultValue, type }: TabsVerticalBaseProps) {
	return (
		<Tabs defaultValue={defaultValue} orientation="vertical" className="w-full flex-row">
			<TabsList className={tabListClasses[type ?? 'default']}>
				{tabs.map((tab) => (
					<TabsTrigger
						value={tab.value}
						className={tabVariants({ type })}
						key={tab.value}
					>
						{tab.icon && (
							<tab.icon
								className="-ms-0.5 me-1.5 opacity-60"
								size={16}
								aria-hidden="true"
							/>
						)}
						{tab.label}
					</TabsTrigger>
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
