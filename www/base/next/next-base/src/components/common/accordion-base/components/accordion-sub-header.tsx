import { ChevronDownIcon } from 'lucide-react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import type { IconProps } from '@/types/icons';
import type { AccordionItems } from './accordion-simple';

export type AccordionSubHeaderItems = AccordionItems & {
	icon: IconProps;
	sub: string;
};

export type AccordionSubHeaderProps = {
	title: string;
	items: AccordionSubHeaderItems[];
};

export function AccordionSubHeader({ items, title }: AccordionSubHeaderProps) {
	return (
		<div className="space-y-4 w-full">
			<h2 className="text-xl font-bold">{title}</h2>
			<Accordion type="single" collapsible className="w-full" defaultValue="3">
				{items.map((item) => (
					<AccordionItem value={item.id} key={item.id} className="py-2">
						<AccordionPrimitive.Header className="flex">
							<AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&[data-state=open]>svg]:rotate-180">
								<span className="flex items-center gap-3">
									<span
										className="flex size-10 shrink-0 items-center justify-center rounded-full border"
										aria-hidden="true"
									>
										<item.icon size={16} className="opacity-60" />
									</span>
									<span className="flex flex-col space-y-1">
										<span>{item.title}</span>
										{item.sub && <span className="text-sm font-normal">{item.sub}</span>}
									</span>
								</span>
								<ChevronDownIcon
									size={16}
									className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
									aria-hidden="true"
								/>
							</AccordionPrimitive.Trigger>
						</AccordionPrimitive.Header>
						<AccordionContent className="ms-3 ps-10 pb-2 text-muted-foreground">
							{item.content}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
