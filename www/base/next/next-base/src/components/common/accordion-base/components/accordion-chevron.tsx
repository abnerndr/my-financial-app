import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import type { AccordionItems } from './accordion-simple';

export type AccordionChevronProps = {
	title: string;
	items: AccordionItems[];
};

export function AccordionChevron({ title, items }: AccordionChevronProps) {
	return (
		<div className="space-y-4 w-full">
			<h2 className="text-xl font-bold">{title}</h2>
			<Accordion type="single" collapsible className="w-full space-y-2" defaultValue="3">
				{items.map((item) => (
					<AccordionItem
						value={item.id}
						key={item.id}
						className="rounded-md border bg-background px-4 py-1 outline-none last:border-b has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
					>
						<AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline focus-visible:ring-0">
							{item.title}
						</AccordionTrigger>
						<AccordionContent className="pb-2 text-muted-foreground">
							{item.content}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
