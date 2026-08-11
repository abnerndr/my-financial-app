import { sendWhatsAppText } from "@/lib/evolution-api";
import { normalizePhoneDigits, phoneLookupValues } from "@/lib/phone";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
	phone: z.string().min(1, "phone é obrigatório"),
});

const CODE_EXPIRY_MINUTES = 10;

/**
 * POST /api/integrations/whatsapp/request-code
 * Body: { "phone": "5511999999999" } (só dígitos; aceita máscara/+ e normaliza)
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

		const phone = normalizePhoneDigits(parsed.data.phone);
		const variants = phoneLookupValues(phone);

		const settings = await prisma.userSettings.findFirst({
			where: { phone: { in: variants } },
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
				phone,
				verificationCode: code,
				verificationCodeExpiresAt: expiresAt,
			},
		});

		const message = `Seu código de verificação é: *${code}*\n\nVálido por ${CODE_EXPIRY_MINUTES} minutos.`;
		const sent = await sendWhatsAppText(phone, message);

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
