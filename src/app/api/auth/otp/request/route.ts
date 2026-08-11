import { NextResponse } from "next/server";
import { z } from "zod";
import {
	generateOtpCode,
	normalizePhone,
	sendOtpEmail,
	sendOtpWhatsApp,
	storeOtp,
	type OtpChannel,
} from "@/lib/otp";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
	channel: z.enum(["email", "whatsapp"]),
	destination: z.string().min(3),
	/** login = usuário deve existir (exceto email cria no verify); register = só envia código */
	intent: z.enum(["login", "register"]).default("login"),
	name: z.string().optional(),
});

/**
 * POST /api/auth/otp/request
 * Body: { channel: "email"|"whatsapp", destination: string, intent?: "login"|"register", name?: string }
 */
export async function POST(request: Request) {
	try {
		const json = await request.json();
		const parsed = bodySchema.safeParse(json);
		if (!parsed.success) {
			return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
		}

		const { channel, intent, name } = parsed.data;
		const destination =
			channel === "email"
				? parsed.data.destination.trim().toLowerCase()
				: normalizePhone(parsed.data.destination);

		if (channel === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destination)) {
			return NextResponse.json({ error: "Email inválido" }, { status: 400 });
		}
		if (channel === "whatsapp" && destination.replace(/\D/g, "").length < 10) {
			return NextResponse.json({ error: "Telefone inválido" }, { status: 400 });
		}

		if (intent === "register" && channel === "email") {
			const existing = await prisma.user.findUnique({ where: { email: destination } });
			if (existing?.emailVerified) {
				return NextResponse.json({ error: "Este email já está cadastrado. Faça login." }, { status: 409 });
			}
			if (!existing) {
				await prisma.user.create({
					data: {
						email: destination,
						name: name?.trim() || destination.split("@")[0],
						emailVerified: null,
						settings: { create: {} },
					},
				});
			}
		}

		if (intent === "register" && channel === "whatsapp") {
			const existing = await prisma.user.findFirst({
				where: { OR: [{ phone: destination }, { settings: { phone: destination } }] },
			});
			if (existing?.phoneVerified) {
				return NextResponse.json({ error: "Este telefone já está cadastrado. Faça login." }, { status: 409 });
			}
			if (!existing) {
				const syntheticEmail = `wa_${destination.replace(/\D/g, "")}@whatsapp.local`;
				await prisma.user.create({
					data: {
						email: syntheticEmail,
						phone: destination,
						name: name?.trim() || destination,
						settings: { create: { phone: destination, phoneVerified: false } },
					},
				});
			}
		}

		const code = generateOtpCode();
		await storeOtp(channel as OtpChannel, destination, code);

		const sent =
			channel === "email" ? await sendOtpEmail(destination, code) : await sendOtpWhatsApp(destination, code);

		if (!sent) {
			// Em dev sem provedor, ainda gravamos o OTP — loga para testes
			console.warn("[otp/request] falha no envio; código (dev):", code, channel, destination);
			if (process.env.NODE_ENV === "production") {
				return NextResponse.json(
					{ error: channel === "email" ? "Não foi possível enviar o email" : "Não foi possível enviar o WhatsApp" },
					{ status: 502 }
				);
			}
		}

		return NextResponse.json({
			success: true,
			channel,
			destination,
			expiresInSeconds: 600,
		});
	} catch (e) {
		console.error("[otp/request]", e);
		return NextResponse.json({ error: "Erro interno" }, { status: 500 });
	}
}
