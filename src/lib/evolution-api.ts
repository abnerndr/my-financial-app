/**
 * Integração com Evolution API (WhatsApp).
 * Documentação: https://doc.evolution-api.com/v2/api-reference/get-information
 * Envio de texto: https://doc.evolution-api.com/v2/api-reference/message-controller/send-text
 */

const getConfig = () => {
	const baseUrl = process.env.EVOLUTION_API_URL?.trim();
	const apiKey = process.env.EVOLUTION_API_KEY?.trim();
	const instance = process.env.EVOLUTION_INSTANCE?.trim();
	return { baseUrl, apiKey, instance };
};

/** Número no formato aceito pela Evolution API (apenas dígitos, com DDI): 5511999999999 */
export function toEvolutionNumber(phone: string): string {
	return phone.replace(/\D/g, "");
}

export type EvolutionInfo = {
	status: number;
	message: string;
	version?: string;
	swagger?: string;
	manager?: string;
	documentation?: string;
};

/**
 * Obtém informações da instância Evolution API.
 * GET /{instance} — https://doc.evolution-api.com/v2/api-reference/get-information
 */
export async function getEvolutionInfo(): Promise<EvolutionInfo | null> {
	const { baseUrl, apiKey, instance } = getConfig();
	if (!baseUrl || !apiKey || !instance) return null;

	const url = `${baseUrl.replace(/\/$/, "")}/${instance}`;

	try {
		const res = await fetch(url, {
			method: "GET",
			headers: { apikey: apiKey },
		});
		if (!res.ok) return null;
		const data = (await res.json()) as EvolutionInfo;
		return data;
	} catch (e) {
		console.error("[evolution-api] getInfo", e);
		return null;
	}
}

/**
 * Envia mensagem de texto via WhatsApp (Evolution API).
 * POST /message/sendText/{instance}
 */
export async function sendWhatsAppText(phone: string, text: string): Promise<boolean> {
	const { baseUrl, apiKey, instance } = getConfig();
	if (!baseUrl || !apiKey || !instance) {
		console.warn("[evolution-api] Envio desabilitado: EVOLUTION_API_URL, EVOLUTION_API_KEY ou EVOLUTION_INSTANCE não configurados.");
		return false;
	}

	const url = `${baseUrl.replace(/\/$/, "")}/message/sendText/${instance}`;
	const number = toEvolutionNumber(phone);

	try {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				apikey: apiKey,
			},
			body: JSON.stringify({ number, text }),
		});

		if (!res.ok) {
			console.error("[evolution-api] sendText", res.status, await res.text());
			return false;
		}
		return true;
	} catch (e) {
		console.error("[evolution-api] sendText", e);
		return false;
	}
}
