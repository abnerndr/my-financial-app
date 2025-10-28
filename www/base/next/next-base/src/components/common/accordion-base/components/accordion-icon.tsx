import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import type { IconProps } from '@/types/icons';
import type { AccordionItems } from './accordion-simple';

export type AccordionIconItems = AccordionItems & {
	icon: IconProps;
};

export type AccordionIconProps = {
	title: string;
	items: AccordionIconItems[];
};

export function AccordionIcon({ items, title }: AccordionIconProps) {
	return (
		<div className="space-y-4 w-full">
			<h2 className="text-xl font-bold">{title}</h2>
			<Accordion type="single" collapsible className="w-full" defaultValue="3">
				{items.map((item) => (
					<AccordionItem value={item.id} key={item.id} className="py-2">
						<AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
							<span className="flex items-center gap-3">
								<item.icon size={16} className="shrink-0 opacity-60" aria-hidden="true" />
								<span>{item.title}</span>
							</span>
						</AccordionTrigger>
						<AccordionContent className="ps-7 pb-2 text-muted-foreground">
							{item.content}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
