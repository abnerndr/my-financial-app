"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const registerSchema = z.object({
	name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
	email: z.string().email("Email inválido"),
	password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export async function register(formData: FormData) {
	const parsed = registerSchema.safeParse({
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!parsed.success) {
		const { fieldErrors } = z.flattenError(parsed.error);
		return {
			error: fieldErrors as Record<string, string[] | undefined>,
		};
	}

	const { name, email, password } = parsed.data;

	// Verifica se o email já existe
	const existingUser = await prisma.user.findUnique({
		where: { email },
	});

	if (existingUser) {
		return { error: { email: ["Este email já está cadastrado"] } };
	}

	// Hash da senha
	const hashedPassword = await bcrypt.hash(password, 10);

	// Gera token de verificação
	const token = randomBytes(32).toString("hex");
	const expires = new Date();
	expires.setHours(expires.getHours() + 24); // Expira em 24 horas

	try {
		// Cria o usuário
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				emailVerified: null, // Não verificado ainda
			},
		});

		// Cria token de verificação
		await prisma.verificationToken.create({
			data: {
				identifier: email,
				token,
				expires,
			},
		});

		// Envia email de verificação via SendGrid
		const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}&email=${encodeURIComponent(
			email,
		)}`;

		const { sendVerificationEmail } = await import("@/lib/email");
		const sent = await sendVerificationEmail(email, verificationUrl, name);
		if (!sent) {
			console.log("🔗 Link de verificação (fallback):", verificationUrl);
		}

		return { success: true, message: "Cadastro realizado! Verifique seu email para ativar a conta." };
	} catch (error: any) {
		console.error("Erro ao criar usuário:", error);
		return { error: { _form: ["Erro ao criar conta. Tente novamente."] } };
	}
}

export async function verifyEmail(token: string | undefined, email: string | undefined) {
	if (!token || !email) {
		return { success: false as const, error: "Token e email são obrigatórios" };
	}

	try {
		// Busca pelo token (único); o email na URL pode vir em outro case (ex.: Gmail)
		const verificationToken = await prisma.verificationToken.findUnique({
			where: { token },
		});

		if (!verificationToken) {
			return { success: false as const, error: "Token inválido" };
		}

		const identifierLower = verificationToken.identifier.toLowerCase();
		const emailLower = email.toLowerCase();
		if (identifierLower !== emailLower) {
			return { success: false as const, error: "O link não corresponde ao email informado." };
		}

		if (verificationToken.expires < new Date()) {
			return { success: false as const, error: "Token expirado. Solicite um novo link de verificação." };
		}

		// Usa o identifier do registro para evitar diferença de case
		await prisma.user.update({
			where: { email: verificationToken.identifier },
			data: { emailVerified: new Date() },
		});

		await prisma.verificationToken.delete({
			where: {
				identifier_token: {
					identifier: verificationToken.identifier,
					token,
				},
			},
		});

		revalidatePath("/login");
		return { success: true as const };
	} catch (err) {
		console.error("[verifyEmail]", err);
		return {
			success: false as const,
			error: "Não foi possível verificar seu email. Tente novamente ou solicite um novo link.",
		};
	}
}
