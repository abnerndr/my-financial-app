/**
 * Status do andamento de pagamento de um gasto — rótulos em PT-BR num só lugar.
 */
export type PaymentStatus = "PAID" | "PAID_LATE" | "PENDING" | "DUE_TODAY" | "DUE_SOON" | "OVERDUE";

export const paymentStatusLabel: Record<PaymentStatus, string> = {
	PAID: "Pago",
	PAID_LATE: "Pago com atraso",
	PENDING: "Pendente",
	DUE_TODAY: "Vence hoje",
	DUE_SOON: "Vence em breve",
	OVERDUE: "Atrasado",
};

export const paymentStatusVariant = {
	PAID: "success",
	PAID_LATE: "warning",
	PENDING: "outline",
	DUE_TODAY: "warning",
	DUE_SOON: "info",
	OVERDUE: "critical",
} as const satisfies Record<PaymentStatus, string>;

/** Dias considerados "em breve" antes do vencimento. */
const DUE_SOON_DAYS = 3;

function startOfDay(date: Date): number {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function daysBetween(from: Date, to: Date): number {
	return Math.round((startOfDay(to) - startOfDay(from)) / 86_400_000);
}

/** Status de um gasto ativo no mês corrente. */
export function getExpenseStatus(paid: boolean, dueDate: Date | null, today = new Date()): PaymentStatus {
	if (paid) return "PAID";
	if (!dueDate) return "PENDING";
	const days = daysBetween(today, dueDate);
	if (days < 0) return "OVERDUE";
	if (days === 0) return "DUE_TODAY";
	if (days <= DUE_SOON_DAYS) return "DUE_SOON";
	return "PENDING";
}

/** Status de um pagamento já concluído: pago em dia ou com atraso. */
export function getPaidStatus(paidAt: Date, dueDate: Date | null): PaymentStatus {
	if (dueDate && daysBetween(dueDate, paidAt) > 0) return "PAID_LATE";
	return "PAID";
}
