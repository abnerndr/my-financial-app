import { normalizePhoneDigits, phoneLookupValues } from "@/lib/phone";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
	phone: z.string().min(1, "phone é obrigatório"),
	code: z.string().length(6, "code deve ter 6 dígitos"),
});

/**
 * POST /api/integrations/whatsapp/verify
 * Body: { "phone": "5511999999999", "code": "123456" }
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
		const { code } = parsed.data;
		const now = new Date();
		const variants = phoneLookupValues(phone);

		const settings = await prisma.userSettings.findFirst({
			where: {
				phone: { in: variants },
				verificationCode: code,
				verificationCodeExpiresAt: { gt: now },
			},
		});

		if (!settings) {
			return NextResponse.json(
				{ error: "Código inválido ou expirado. Solicite um novo código na plataforma." },
				{ status: 400 }
			);
		}

		await prisma.userSettings.update({
			where: { id: settings.id },
			data: {
				phone,
				phoneVerified: true,
				verificationCode: null,
				verificationCodeExpiresAt: null,
			},
		});

		return NextResponse.json({ success: true, message: "Telefone verificado com sucesso." });
	} catch (e) {
		console.error("[whatsapp/verify]", e);
		return NextResponse.json({ error: "Erro interno" }, { status: 500 });
	}
}
