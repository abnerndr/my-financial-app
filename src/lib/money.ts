/** Máscara e conversão de valores em reais (pt-BR). */

/** Formata número para exibição no input: 1234.5 → "1.234,50" */
export function formatCurrencyInput(value: number): string {
	if (!Number.isFinite(value) || value <= 0) return "";
	return new Intl.NumberFormat("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);
}

/**
 * Converte texto mascarado (ou digitado) em número.
 * Aceita "1.234,56", "1234,56", "1234.56", "R$ 10,00", ou só dígitos (centavos).
 */
export function parseCurrencyInput(raw: string): number {
	const trimmed = raw.trim().replace(/R\$\s?/gi, "");
	if (!trimmed) return 0;

	// Número já normalizado (ex.: FormData com toFixed(2) → "1234.56")
	if (/^\d+(\.\d{1,2})?$/.test(trimmed)) {
		const n = Number(trimmed);
		return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
	}

	// pt-BR com vírgula decimal
	if (trimmed.includes(",")) {
		const normalized = trimmed.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
		const n = Number(normalized);
		return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
	}

	// Só dígitos → máscara progressiva em centavos
	const digitsOnly = trimmed.replace(/\D/g, "");
	if (!digitsOnly) return 0;
	return Math.round(Number(digitsOnly)) / 100;
}

/** Aplica máscara enquanto digita (centavos). */
export function maskCurrencyFromDigits(raw: string): string {
	const digits = raw.replace(/\D/g, "");
	if (!digits) return "";
	const cents = Number(digits);
	return formatCurrencyInput(cents / 100);
}
