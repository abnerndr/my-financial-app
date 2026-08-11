import { prisma } from "@/lib/prisma";
import { sendWhatsAppText } from "@/lib/evolution-api";
import { randomInt } from "crypto";

export type OtpChannel = "email" | "whatsapp";

const OTP_TTL_MS = 10 * 60 * 1000;

function otpIdentifier(channel: OtpChannel, destination: string): string {
	return `${channel}:${destination}`;
}

export function generateOtpCode(): string {
	return String(randomInt(0, 10000)).padStart(4, "0");
}

export async function storeOtp(channel: OtpChannel, destination: string, code: string): Promise<void> {
	const identifier = otpIdentifier(channel, destination);
	const expires = new Date(Date.now() + OTP_TTL_MS);

	await prisma.verificationToken.deleteMany({ where: { identifier } });
	await prisma.verificationToken.create({
		data: { identifier, token: code, expires },
	});
}

export async function verifyStoredOtp(
	channel: OtpChannel,
	destination: string,
	code: string
): Promise<boolean> {
	const identifier = otpIdentifier(channel, destination);
	const row = await prisma.verificationToken.findFirst({
		where: { identifier, token: code },
	});
	if (!row) return false;
	if (row.expires < new Date()) {
		await prisma.verificationToken.deleteMany({ where: { identifier } });
		return false;
	}
	await prisma.verificationToken.deleteMany({ where: { identifier } });
	return true;
}

export async function sendOtpEmail(to: string, code: string): Promise<boolean> {
	const { sendOtpLoginEmail } = await import("@/lib/email");
	return sendOtpLoginEmail(to, code);
}

export async function sendOtpWhatsApp(phone: string, code: string): Promise<boolean> {
	const message = [
		"*Código de acesso*",
		"",
		`Seu código do Controle Financeiro é: *${code}*`,
		"",
		"Válido por 10 minutos. Se você não solicitou, ignore esta mensagem.",
	].join("\n");
	return sendWhatsAppText(phone, message);
}

/** Normaliza telefone para E.164 simples (+ e dígitos). */
export function normalizePhone(input: string): string {
	const digits = input.replace(/\D/g, "");
	if (!digits) return "";
	if (input.trim().startsWith("+")) return `+${digits}`;
	if (digits.startsWith("55")) return `+${digits}`;
	if (digits.length === 11 || digits.length === 10) return `+55${digits}`;
	return `+${digits}`;
}
