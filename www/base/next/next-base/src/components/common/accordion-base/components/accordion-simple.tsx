import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

export type AccordionItems = {
	id: string;
	title: string;
	content: string;
};

export type AccordionSimpleProps = {
	title: string;
	items: AccordionItems[];
};

export function AccordionSimple({ items, title }: AccordionSimpleProps) {
	return (
		<div className="space-y-4 w-full">
			<h2 className="text-xl font-bold">{title}</h2>
			<Accordion type="single" collapsible className="w-full" defaultValue="3">
				{items.map((item) => (
					<AccordionItem value={item.id} key={item.id} className="py-2">
						<AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
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
