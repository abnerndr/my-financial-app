import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
}

/** Data de vencimento para exibição: mensal = dia do mês no ano/mês dado; única vez = data fixa. */
export function getDueDateForMonth(
	dueDate: Date | null,
	frequency: "ONE_TIME" | "MONTHLY" | "ANNUAL",
	year: number,
	month: number
): Date | null {
	if (!dueDate) return null;
	if (frequency === "ONE_TIME") return dueDate;
	const day = dueDate.getDate();
	const d = new Date(year, month, Math.min(day, new Date(year, month + 1, 0).getDate()));
	return d;
}
