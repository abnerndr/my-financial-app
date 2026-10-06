import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import { parseDateOnly } from "@/lib/date-only";
import { groupPaymentsByReferenceMonth } from "@/lib/expense-visibility";
import { getPaidStatus } from "@/lib/payment-status";
import { formatCurrency, getDueDateForMonth } from "@/lib/utils";

export const HISTORY_PAGE_SIZE = 10;

type Payment = {
	id: string;
	expenseTitle: string;
	expenseValue: number;
	expenseFrequency: string;
	expenseDueDate: string | null;
	referenceMonth: Date | string;
	paidAt: Date | string;
};

// "Uma vez" é o caso comum: só sinaliza recorrentes para reduzir ruído visual.
const recurringLabel: Record<string, string> = {
	MONTHLY: "Mensal",
	ANNUAL: "Anual",
};

const GRID = "md:grid md:grid-cols-[minmax(0,1fr)_8rem_10rem_8rem] md:items-center md:gap-4";

function capitalize(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

function statusOf(p: Payment) {
	const ref = new Date(p.referenceMonth);
	const dueDate = getDueDateForMonth(
		p.expenseDueDate ? parseDateOnly(p.expenseDueDate) : null,
		p.expenseFrequency as "ONE_TIME" | "MONTHLY" | "ANNUAL",
		ref.getUTCFullYear(),
		ref.getUTCMonth()
	);
	return getPaidStatus(new Date(p.paidAt), dueDate);
}

export function PaymentHistory({
	payments,
	page,
	hrefFor,
}: {
	payments: Payment[];
	page: number;
	hrefFor: (page: number) => string;
}) {
	if (payments.length === 0) {
		return <p className="py-4 text-center text-muted-foreground">Nenhum pagamento registrado ainda.</p>;
	}

	const totalPages = Math.ceil(payments.length / HISTORY_PAGE_SIZE);
	const current = Math.min(Math.max(1, page), totalPages);
	const pageItems = payments.slice((current - 1) * HISTORY_PAGE_SIZE, current * HISTORY_PAGE_SIZE);

	// Totais do mês consideram todos os pagamentos, não só os da página.
	const monthTotals = new Map(
		groupPaymentsByReferenceMonth(payments).map((g) => [
			g.key,
			{ count: g.payments.length, total: g.payments.reduce((acc, p) => acc + p.expenseValue, 0) },
		])
	);
	const pageMonths = groupPaymentsByReferenceMonth(pageItems);

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-lg border">
				<div className={`hidden bg-muted/60 px-4 py-2.5 text-xs font-medium text-muted-foreground ${GRID}`}>
					<span>Gasto</span>
					<span>Pago em</span>
					<span>Status</span>
					<span className="text-right">Valor</span>
				</div>

				{pageMonths.map((month) => {
					const summary = monthTotals.get(month.key);
					return (
						<section key={month.key} className="border-t first-of-type:border-t-0 md:first-of-type:border-t">
							<div className="flex items-center justify-between gap-3 bg-muted/30 px-4 py-2 text-xs">
								<span className="font-semibold text-foreground">{capitalize(month.label)}</span>
								<span className="text-muted-foreground">
									{summary?.count} {summary?.count === 1 ? "pagamento" : "pagamentos"} ·{" "}
									<span className="font-medium tabular-nums text-foreground">
										{formatCurrency(summary?.total ?? 0)}
									</span>
								</span>
							</div>

							<ul className="divide-y border-t">
								{month.payments.map((p) => (
									<li
										key={p.id}
										className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted/40 ${GRID}`}
									>
										<div className="min-w-0 flex-1">
											<p className="truncate font-medium">{p.expenseTitle}</p>
											<div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground md:mt-0">
												{recurringLabel[p.expenseFrequency] && <span>{recurringLabel[p.expenseFrequency]}</span>}
												<span className="md:hidden">
													{recurringLabel[p.expenseFrequency] && "· "}
													{new Date(p.paidAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
												</span>
											</div>
										</div>
										<span className="hidden text-muted-foreground tabular-nums md:block">
											{new Date(p.paidAt).toLocaleDateString("pt-BR")}
										</span>
										<span className="hidden md:block">
											<StatusBadge status={statusOf(p)} />
										</span>
										<div className="flex shrink-0 flex-col items-end gap-1 md:block md:text-right">
											<span className="font-semibold tabular-nums">{formatCurrency(p.expenseValue)}</span>
											<span className="md:hidden">
												<StatusBadge status={statusOf(p)} />
											</span>
										</div>
									</li>
								))}
							</ul>
						</section>
					);
				})}
			</div>

			<Pagination page={current} pageSize={HISTORY_PAGE_SIZE} total={payments.length} hrefFor={hrefFor} />
		</div>
	);
}
