/**
 * Telefone BR: máscara na UI, armazenamento só com dígitos (sem +, espaços ou símbolos).
 * Ex. salvo: 5511999999999
 */

export type PhoneKind = "mobile" | "landline" | "auto";

/** Remove tudo que não for dígito. */
export function digitsOnly(input: string): string {
	return input.replace(/\D/g, "");
}

/**
 * Normaliza para gravação: apenas dígitos, com DDI 55 quando for número BR local (10/11 dígitos).
 */
export function normalizePhoneDigits(input: string): string {
	let digits = digitsOnly(input);
	if (!digits) return "";

	// Remove 00 internacional → 55…
	if (digits.startsWith("00")) digits = digits.slice(2);

	if (digits.length === 10 || digits.length === 11) {
		digits = `55${digits}`;
	}

	return digits;
}

/** Variantes para busca (compatível com registros antigos com +). */
export function phoneLookupValues(input: string): string[] {
	const digits = normalizePhoneDigits(input);
	if (!digits) return [];
	return Array.from(new Set([digits, `+${digits}`]));
}

export function isValidBrazilPhone(input: string): boolean {
	const digits = normalizePhoneDigits(input);
	// 55 + DDD(2) + número(8 ou 9) = 12 ou 13 dígitos
	return digits.length === 12 || digits.length === 13;
}

/** Parte local (DDD + número), sem DDI. */
export function toLocalDigits(input: string): string {
	const digits = normalizePhoneDigits(input);
	if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
		return digits.slice(2);
	}
	return digitsOnly(input);
}

function detectKind(localDigits: string): "mobile" | "landline" {
	// 11 dígitos ou 3º dígito = 9 → celular
	if (localDigits.length >= 11) return "mobile";
	if (localDigits.length === 10 && localDigits[2] === "9") return "mobile";
	return "landline";
}

/**
 * Formata dígitos locais para exibição.
 * Celular: (11) 98765-4321
 * Fixo: (11) 3456-7890
 */
export function formatPhoneMask(input: string, kind: PhoneKind = "auto"): string {
	const rawLocal = toLocalDigits(input);
	const resolved =
		kind === "auto" ? detectKind(rawLocal.slice(0, 11)) : kind;
	const maxLen = resolved === "mobile" ? 11 : 10;
	const local = rawLocal.slice(0, maxLen);
	if (!local) return "";

	const ddd = local.slice(0, 2);
	const rest = local.slice(2);

	if (local.length <= 2) {
		return `(${local}`;
	}

	if (resolved === "mobile") {
		if (rest.length <= 5) return `(${ddd}) ${rest}`;
		return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5, 9)}`;
	}

	if (rest.length <= 4) return `(${ddd}) ${rest}`;
	return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4, 8)}`;
}

/** Máscara progressiva a partir do que o usuário digitou. */
export function maskPhoneInput(raw: string, kind: PhoneKind = "auto"): string {
	return formatPhoneMask(raw, kind);
}
