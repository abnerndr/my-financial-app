import { Badge } from "@/components/ui/badge";
import { groupPaymentsByReferenceMonth } from "@/lib/expense-visibility";
import { formatCurrency } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type Payment = {
	id: string;
	expenseTitle: string;
	expenseValue: number;
	expenseFrequency: string;
	referenceMonth: Date | string;
	paidAt: Date | string;
};

// "Uma vez" é o caso comum: só sinaliza recorrentes para reduzir ruído visual.
const recurringLabel: Record<string, string> = {
	MONTHLY: "Mensal",
	ANNUAL: "Anual",
};

function capitalize(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Agrupa pagamentos (já ordenados por paidAt desc) pelo dia do pagamento. */
function groupByPaidDay(payments: Payment[]) {
	const days: { key: string; date: Date; payments: Payment[] }[] = [];
	for (const p of payments) {
		const date = new Date(p.paidAt);
		const key = date.toLocaleDateString("pt-BR");
		const last = days.at(-1);
		if (last?.key === key) last.payments.push(p);
		else days.push({ key, date, payments: [p] });
	}
	return days;
}

export function PaymentHistory({ payments }: { payments: Payment[] }) {
	const months = groupPaymentsByReferenceMonth(payments);

	if (months.length === 0) {
		return <p className="py-4 text-center text-muted-foreground">Nenhum pagamento registrado ainda.</p>;
	}

	return (
		<div className="divide-y rounded-lg border">
			{months.map((month, index) => {
				const total = month.payments.reduce((acc, p) => acc + p.expenseValue, 0);
				const days = groupByPaidDay(month.payments);

				return (
					<details key={month.key} open={index === 0} className="group">
						<summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
							<ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
							<div className="min-w-0 flex-1">
								<p className="font-semibold">{capitalize(month.label)}</p>
								<p className="text-xs text-muted-foreground">
									{month.payments.length} {month.payments.length === 1 ? "pagamento" : "pagamentos"}
								</p>
							</div>
							<span className="font-semibold tabular-nums">{formatCurrency(total)}</span>
						</summary>

						<div className="border-t">
							{days.map((day) => (
								<div key={day.key} className="flex gap-3 border-b px-4 py-2 last:border-b-0">
									<div className="w-10 shrink-0 pt-1.5 text-center leading-tight">
										<p className="text-sm font-semibold tabular-nums">
											{day.date.toLocaleDateString("pt-BR", { day: "2-digit" })}
										</p>
										<p className="text-[11px] uppercase text-muted-foreground">
											{day.date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "")}
										</p>
									</div>
									<ul className="min-w-0 flex-1">
										{day.payments.map((p) => (
											<li key={p.id} className="flex items-center gap-2 py-1.5 text-sm">
												<span className="truncate">{p.expenseTitle}</span>
												{recurringLabel[p.expenseFrequency] && (
													<Badge variant="outline" className="px-1.5 py-0 text-[10px] font-medium">
														{recurringLabel[p.expenseFrequency]}
													</Badge>
												)}
												<span className="ml-auto shrink-0 font-medium tabular-nums">
													{formatCurrency(p.expenseValue)}
												</span>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</details>
				);
			})}
		</div>
	);
}
