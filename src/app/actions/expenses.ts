"use server";

import { getSession } from "@/lib/auth";
import { parseDateOnly } from "@/lib/date-only";
import { parseCurrencyInput } from "@/lib/money";
import { getMonthRangeInTimeZone } from "@/lib/month";
import { prisma } from "@/lib/prisma";
import type { ExpenseFrequency } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const expenseSchema = z.object({
	title: z.string().min(1, "Título é obrigatório"),
	description: z.string().optional(),
	logoId: z.string().optional().or(z.literal("")),
	value: z.number().positive("Valor deve ser positivo"),
	frequency: z.enum(["ONE_TIME", "MONTHLY", "ANNUAL"]),
	dueDate: z.string().optional(), // ISO date; opcional no servidor, obrigatório no front
});

const updateExpenseSchema = expenseSchema.extend({
	clearLogo: z.string().optional().or(z.literal("")),
});

/** Resolve logoId/logoUrl a partir da biblioteca de logos do usuário (ou logos de sistema). */
async function resolveLogo(
	userId: string,
	logoId: string | undefined
): Promise<{ logoId: string | null; logoUrl: string | null } | { error: string }> {
	if (!logoId) return { logoId: null, logoUrl: null };

	const logo = await prisma.logo.findFirst({
		where: { id: logoId, OR: [{ userId }, { userId: null }] },
	});
	if (!logo) return { error: "Logo inválido" };

	return { logoId: logo.id, logoUrl: logo.url };
}

export async function createExpense(formData: FormData) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const parsed = expenseSchema.safeParse({
		title: formData.get("title"),
		description: formData.get("description") || undefined,
		logoId: formData.get("logoId") || undefined,
		value: parseCurrencyInput(String(formData.get("value") ?? "")),
		frequency: formData.get("frequency") as ExpenseFrequency,
		dueDate: formData.get("dueDate") || undefined,
	});

	if (!parsed.success) {
		return { error: parsed.error.flatten().fieldErrors as Record<string, string[] | undefined> };
	}

	const logo = await resolveLogo(session.user.id, parsed.data.logoId);
	if ("error" in logo) return { error: logo.error };

	const dueDate = parsed.data.dueDate ? parseDateOnly(parsed.data.dueDate) : null;

	await prisma.expense.create({
		data: {
			userId: session.user.id,
			title: parsed.data.title,
			description: parsed.data.description || null,
			logoId: logo.logoId,
			logoUrl: logo.logoUrl,
			value: parsed.data.value,
			frequency: parsed.data.frequency,
			dueDate,
		},
	});

	revalidatePath("/");
	revalidatePath("/dashboard");
	revalidatePath("/gastos");
	revalidatePath("/relatorios");
	return { success: true };
}

export async function updateExpense(id: string, formData: FormData) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const parsed = updateExpenseSchema.safeParse({
		title: formData.get("title"),
		description: formData.get("description") || undefined,
		logoId: formData.get("logoId") || undefined,
		clearLogo: formData.get("clearLogo") || undefined,
		value: parseCurrencyInput(String(formData.get("value") ?? "")),
		frequency: formData.get("frequency") as ExpenseFrequency,
		dueDate: formData.get("dueDate") || undefined,
	});

	if (!parsed.success) {
		return { error: parsed.error.flatten().fieldErrors as Record<string, string[] | undefined> };
	}

	const current = await prisma.expense.findFirst({
		where: { id, userId: session.user.id },
		select: { logoId: true, logoUrl: true },
	});
	if (!current) return { error: "Gasto não encontrado" };

	let logoId: string | null;
	let logoUrl: string | null;

	if (parsed.data.clearLogo === "1") {
		logoId = null;
		logoUrl = null;
	} else if (parsed.data.logoId) {
		const logo = await resolveLogo(session.user.id, parsed.data.logoId);
		if ("error" in logo) return { error: logo.error };
		logoId = logo.logoId;
		logoUrl = logo.logoUrl;
	} else {
		// Nenhuma alteração de logo enviada: preserva logoId/logoUrl atuais (inclui logoUrl legado sem logoId).
		logoId = current.logoId;
		logoUrl = current.logoUrl;
	}

	const dueDate = parsed.data.dueDate ? parseDateOnly(parsed.data.dueDate) : null;

	await prisma.expense.updateMany({
		where: { id, userId: session.user.id },
		data: {
			title: parsed.data.title,
			description: parsed.data.description || null,
			logoId,
			logoUrl,
			value: parsed.data.value,
			frequency: parsed.data.frequency,
			dueDate,
		},
	});

	revalidatePath("/");
	revalidatePath("/dashboard");
	revalidatePath("/gastos");
	revalidatePath("/relatorios");
	return { success: true };
}

/** Marca o gasto como pago no mês de referência (padrão: mês atual). */
export async function markExpenseAsPaid(
	expenseId: string,
	referenceMonth?: string
): Promise<{ success: true } | { error: string }> {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const expense = await prisma.expense.findFirst({
		where: { id: expenseId, userId: session.user.id },
	});
	if (!expense) return { error: "Gasto não encontrado" };

	const ref = referenceMonth ? new Date(referenceMonth) : new Date();
	const { start: startOfMonth, end: endOfMonth } = getMonthRangeInTimeZone(ref);

	// Evita divergência de fuso em produção: encontra o registro do mês por intervalo.
	const existing = await (prisma as unknown as {
		expensePayment: {
			findFirst: (args: object) => Promise<{ id: string } | null>;
			create: (args: object) => Promise<unknown>;
			update: (args: object) => Promise<unknown>;
		};
	}).expensePayment.findFirst({
		where: {
			expenseId,
			referenceMonth: { gte: startOfMonth, lt: endOfMonth },
		},
		select: { id: true },
	});

	if (existing) {
		await prisma.expensePayment.update({
			where: { id: existing.id },
			data: { paidAt: new Date() },
		});
	} else {
		await prisma.expensePayment.create({
			data: {
				expenseId,
				referenceMonth: startOfMonth,
				paidAt: new Date(),
			},
		});
	}

	revalidatePath("/");
	revalidatePath("/dashboard");
	revalidatePath("/gastos");
	revalidatePath("/relatorios");
	return { success: true };
}

/** Remove o registro de pagamento do gasto no mês de referência. */
export async function unmarkExpenseAsPaid(
	expenseId: string,
	referenceMonth?: string
): Promise<{ success: true } | { error: string }> {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const expense = await prisma.expense.findFirst({
		where: { id: expenseId, userId: session.user.id },
	});
	if (!expense) return { error: "Gasto não encontrado" };

	const ref = referenceMonth ? new Date(referenceMonth) : new Date();
	const { start: startOfMonth, end: endOfMonth } = getMonthRangeInTimeZone(ref);

	await prisma.expensePayment.deleteMany({
		where: {
			expenseId,
			referenceMonth: { gte: startOfMonth, lt: endOfMonth },
		},
	});

	revalidatePath("/");
	revalidatePath("/dashboard");
	revalidatePath("/gastos");
	revalidatePath("/relatorios");
	return { success: true };
}

export async function deleteExpense(id: string) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	await prisma.expense.deleteMany({
		where: { id, userId: session.user.id },
	});

	revalidatePath("/");
	revalidatePath("/dashboard");
	revalidatePath("/gastos");
	revalidatePath("/relatorios");
	return { success: true };
}
