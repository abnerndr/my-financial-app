/**
 * Regras de listagem vs histórico:
 * - MONTHLY / ANNUAL: sempre na lista ativa (pagamento é por mês de referência).
 * - ONE_TIME: na lista só enquanto nunca foi pago; após pagamento vai só para o histórico.
 */
export function isActiveExpense(
	frequency: "ONE_TIME" | "MONTHLY" | "ANNUAL" | string,
	hasEverBeenPaid: boolean,
): boolean {
	if (frequency === "MONTHLY" || frequency === "ANNUAL") return true;
	if (frequency === "ONE_TIME") return !hasEverBeenPaid;
	return true;
}

/** Agrupa pagamentos pelo mês de referência (YYYY-MM), do mais recente ao mais antigo. */
export function groupPaymentsByReferenceMonth<
	T extends { referenceMonth: Date | string },
>(payments: T[]): { key: string; label: string; payments: T[] }[] {
	const groups = new Map<string, T[]>();

	for (const payment of payments) {
		const date = payment.referenceMonth instanceof Date
			? payment.referenceMonth
			: new Date(payment.referenceMonth);
		const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
		const list = groups.get(key);
		if (list) list.push(payment);
		else groups.set(key, [payment]);
	}

	return [...groups.entries()]
		.sort(([a], [b]) => (a < b ? 1 : a > b ? -1 : 0))
		.map(([key, groupPayments]) => {
			const [year, month] = key.split("-").map(Number);
			const label = new Date(Date.UTC(year, month - 1, 1)).toLocaleString("pt-BR", {
				month: "long",
				year: "numeric",
				timeZone: "UTC",
			});
			return { key, label, payments: groupPayments };
		});
}
