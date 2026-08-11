/**
 * Datas "só dia" (YYYY-MM-DD) sem deslocar fuso.
 * `new Date("2025-08-11")` é UTC midnight → no Brasil vira dia 10.
 */

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Converte "YYYY-MM-DD" em Date UTC meio-dia (calendário estável). */
export function parseDateOnly(yyyyMmDd: string): Date | null {
	const m = DATE_ONLY.exec(yyyyMmDd.trim());
	if (!m) return null;
	const y = Number(m[1]);
	const month = Number(m[2]);
	const day = Number(m[3]);
	if (month < 1 || month > 12 || day < 1 || day > 31) return null;
	return new Date(Date.UTC(y, month - 1, day, 12, 0, 0));
}

/** Formata Date para input type="date" usando partes UTC. */
export function formatDateOnly(date: Date): string {
	const y = date.getUTCFullYear();
	const m = String(date.getUTCMonth() + 1).padStart(2, "0");
	const d = String(date.getUTCDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

/** Hoje em YYYY-MM-DD no fuso America/Sao_Paulo. */
export function todayDateOnly(timeZone = "America/Sao_Paulo"): string {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(new Date());
	const y = parts.find((p) => p.type === "year")?.value;
	const m = parts.find((p) => p.type === "month")?.value;
	const d = parts.find((p) => p.type === "day")?.value;
	return `${y}-${m}-${d}`;
}

export function getUtcDay(date: Date): number {
	return date.getUTCDate();
}
