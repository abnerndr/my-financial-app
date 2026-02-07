import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
	phone: z.string().min(1, "phone é obrigatório"),
});

const CODE_EXPIRY_MINUTES = 10;

/** Número no formato aceito pela Evolution API (sem +): 5511999999999 */
function toEvolutionNumber(phone: string): string {
	return phone.replace(/\D/g, "");
}

async function sendWhatsAppViaEvolution(phone: string, text: string): Promise<boolean> {
	const baseUrl = process.env.EVOLUTION_API_URL?.trim();
	const apiKey = process.env.EVOLUTION_API_KEY?.trim();
	const instance = process.env.EVOLUTION_INSTANCE?.trim();

	if (!baseUrl || !apiKey || !instance) {
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
			console.error("[evolution]", res.status, await res.text());
			return false;
		}
		return true;
	} catch (e) {
		console.error("[evolution]", e);
		return false;
	}
}

/**
 * API pública: solicitar código de verificação e enviar via WhatsApp (Evolution API).
 * Recebe o número, gera um código válido para /verify e, se configurada a Evolution API,
 * envia a mensagem automaticamente. Caso contrário, retorna o código para o n8n enviar.
 *
 * POST /api/integrations/whatsapp/request-code
 * Body: { "phone": "+5511999999999" }
 * Response: { "code": "123456", "sent": true } ou { "code": "123456", "sent": false }
 */
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const parsed = bodySchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
				{ status: 400 }
			);
		}

		const { phone } = parsed.data;

		const settings = await prisma.userSettings.findFirst({
			where: { phone },
		});

		if (!settings) {
			return NextResponse.json(
				{
					error: "Número não cadastrado. Cadastre o telefone nas configurações da plataforma primeiro.",
				},
				{ status: 404 }
			);
		}

		const code = crypto.randomInt(100_000, 999_999).toString();
		const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

		await prisma.userSettings.update({
			where: { id: settings.id },
			data: {
				verificationCode: code,
				verificationCodeExpiresAt: expiresAt,
			},
		});

		// Envia via Evolution API se configurada (https://doc.evolution-api.com)
		const message = `Seu código de verificação é: *${code}*\n\nVálido por ${CODE_EXPIRY_MINUTES} minutos.`;
		const sent = await sendWhatsAppViaEvolution(phone, message);

		return NextResponse.json({
			code,
			expiresInMinutes: CODE_EXPIRY_MINUTES,
			sent,
		});
	} catch (e) {
		console.error("[whatsapp/request-code]", e);
		return NextResponse.json({ error: "Erro interno" }, { status: 500 });
	}
}
