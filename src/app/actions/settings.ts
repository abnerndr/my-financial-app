"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const settingsSchema = z.object({
	warningLimitPercent: z.number().min(1).max(99),
});

/** Formato E.164: +5511999999999. Aceita vazio para remover. */
const phoneSchema = z.preprocess(
	(v) => (v === "" ? null : v),
	z
		.string()
		.regex(/^\+[1-9]\d{6,14}$/, "Use o formato internacional: +5511999999999")
		.nullable()
);

export async function updateWarningLimit(formData: FormData) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const value = Number(formData.get("warningLimitPercent"));
	const parsed = settingsSchema.safeParse({ warningLimitPercent: value });
	if (!parsed.success) {
		return { error: "Percentual deve ser entre 1 e 99" };
	}

	await prisma.userSettings.upsert({
		where: { userId: session.user.id },
		create: {
			userId: session.user.id,
			warningLimitPercent: parsed.data.warningLimitPercent,
		},
		update: { warningLimitPercent: parsed.data.warningLimitPercent },
	});

	revalidatePath("/");
	revalidatePath("/dashboard");
	revalidatePath("/configuracoes");
	return { success: true };
}

export async function updateEmailNotifications(enabled: boolean) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	await prisma.userSettings.upsert({
		where: { userId: session.user.id },
		create: {
			userId: session.user.id,
			emailNotificationsEnabled: enabled,
		},
		update: { emailNotificationsEnabled: enabled },
	});

	revalidatePath("/");
	revalidatePath("/dashboard");
	revalidatePath("/configuracoes");
	return { success: true };
}

export async function updatePhone(phone: string | null) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const parsed = phoneSchema.safeParse(phone || null);
	if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Telefone inválido" };

	const normalized = parsed.data ?? null;

	await prisma.userSettings.upsert({
		where: { userId: session.user.id },
		create: {
			userId: session.user.id,
			phone: normalized,
			phoneVerified: false,
		},
		update: {
			phone: normalized,
			phoneVerified: false,
			verificationCode: null,
			verificationCodeExpiresAt: null,
		},
	});

	revalidatePath("/configuracoes");
	return { success: true };
}

const CODE_EXPIRY_MINUTES = 10;

export async function requestWhatsAppVerification(): Promise<{ success: true; code: string } | { error: string }> {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const settings = await prisma.userSettings.findUnique({
		where: { userId: session.user.id },
	});

	if (!settings?.phone) return { error: "Cadastre seu número de telefone antes" };

	const code = crypto.randomInt(100_000, 999_999).toString();
	const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

	await prisma.userSettings.update({
		where: { userId: session.user.id },
		data: {
			verificationCode: code,
			verificationCodeExpiresAt: expiresAt,
		},
	});

	revalidatePath("/configuracoes");
	return { success: true, code };
}

export async function updateWhatsappNotifications(enabled: boolean) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	await prisma.userSettings.upsert({
		where: { userId: session.user.id },
		create: {
			userId: session.user.id,
			whatsappNotificationsEnabled: enabled,
		},
		update: { whatsappNotificationsEnabled: enabled },
	});

	revalidatePath("/configuracoes");
	return { success: true };
}

export async function generateIntegrationApiKey(): Promise<{ success: true; apiKey: string } | { error: string }> {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const apiKey = `n8n_${crypto.randomBytes(24).toString("hex")}`;

	await prisma.userSettings.upsert({
		where: { userId: session.user.id },
		create: {
			userId: session.user.id,
			integrationApiKey: apiKey,
		},
		update: { integrationApiKey: apiKey },
	});

	revalidatePath("/configuracoes");
	return { success: true, apiKey };
}
