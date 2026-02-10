import { prisma } from "@/lib/prisma";
import type { ExpenseFrequency } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const expenseBodySchema = z.object({
	title: z.string().min(1, { message: "Título é obrigatório" }),
	description: z.string().optional(),
	logoUrl: z.url({ message: "URL do logo deve ser uma URL válida" }).optional().or(z.literal("")),
	value: z.number().positive({ message: "Valor deve ser positivo" }),
	frequency: z.enum(["ONE_TIME", "MONTHLY", "ANNUAL"], { message: "Periodicidade inválida" }),
});

const FREQUENCIES: ExpenseFrequency[] = ["ONE_TIME", "MONTHLY", "ANNUAL"];

function getApiKey(request: Request): string | null {
	const auth = request.headers.get("authorization");
	if (auth?.startsWith("Bearer ")) return auth.slice(7).trim();
	return request.headers.get("x-api-key")?.trim() ?? null;
}

function getPhone(request: Request): string | null {
	return request.headers.get("x-phone")?.trim() ?? null;
}

/**
 * API pública para o n8n: criar gasto.
 * Autenticação por API Key (recomendado) ou por telefone verificado.
 *
 * POST /api/integrations/expenses
 * Headers:
 *   - X-API-Key: <sua-chave> (ou Authorization: Bearer <sua-chave>)
 *   - ou X-Phone: +5511999999999 (telefone já verificado na plataforma)
 * Body (JSON): mesmo formato da criação na plataforma
 *   { "title", "description?", "logoUrl?", "value", "frequency" }
 *   frequency: "ONE_TIME" | "MONTHLY" | "ANNUAL"
 */
export async function POST(request: Request) {
	try {
		const apiKey = getApiKey(request);
		const phone = getPhone(request);

		let userId: string | null = null;

		if (apiKey) {
			const settings = await prisma.userSettings.findFirst({
				where: { integrationApiKey: apiKey },
				select: { userId: true },
			});
			if (settings) userId = settings.userId;
		}

		if (!userId && phone) {
			const settings = await prisma.userSettings.findFirst({
				where: { phone, phoneVerified: true },
				select: { userId: true },
			});
			if (settings) userId = settings.userId;
		}

		if (!userId) {
			return NextResponse.json(
				{
					error:
						"Não autorizado. Envie X-API-Key (ou Authorization: Bearer <chave>) ou X-Phone com telefone verificado.",
				},
				{ status: 401 },
			);
		}

		const body = await request.json();
		const parsed = expenseBodySchema.safeParse({
			...body,
			value: typeof body.value === "string" ? Number(body.value) : body.value,
		});

		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Dados do gasto inválidos", details: parsed.error.flatten().fieldErrors },
				{ status: 400 },
			);
		}

		const { title, description, logoUrl, value, frequency } = parsed.data;
		const frequencyValid = FREQUENCIES.includes(frequency as ExpenseFrequency);

		const expense = await prisma.expense.create({
			data: {
				userId,
				title,
				description: description || null,
				logoUrl: logoUrl || null,
				value,
				frequency: frequencyValid ? (frequency as ExpenseFrequency) : "ONE_TIME",
			},
		});

		return NextResponse.json(
			{
				success: true,
				id: expense.id,
				title: expense.title,
				value: Number(expense.value),
				frequency: expense.frequency,
			},
			{ status: 201 },
		);
	} catch (e) {
		console.error("[integrations/expenses]", e);
		return NextResponse.json({ error: "Erro interno" }, { status: 500 });
	}
}
