"use server";

import { getSession } from "@/lib/auth";
import { getMonthRangeInTimeZone } from "@/lib/month";
import { prisma } from "@/lib/prisma";
import type { ExpenseFrequency } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const expenseSchema = z.object({
	title: z.string().min(1, "Título é obrigatório"),
	description: z.string().optional(),
	logoUrl: z.string().url().optional().or(z.literal("")),
	value: z.number().positive("Valor deve ser positivo"),
	frequency: z.enum(["ONE_TIME", "MONTHLY", "ANNUAL"]),
	dueDate: z.string().optional(), // ISO date; opcional no servidor, obrigatório no front
});

export async function createExpense(formData: FormData) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const parsed = expenseSchema.safeParse({
		title: formData.get("title"),
		description: formData.get("description") || undefined,
		logoUrl: formData.get("logoUrl") || undefined,
		value: Number(formData.get("value")),
		frequency: formData.get("frequency") as ExpenseFrequency,
		dueDate: formData.get("dueDate") || undefined,
	});

	if (!parsed.success) {
		return { error: parsed.error.flatten().fieldErrors as Record<string, string[] | undefined> };
	}

	const dueDate = parsed.data.dueDate ? new Date(parsed.data.dueDate) : null;

	await prisma.expense.create({
		data: {
			userId: session.user.id,
			title: parsed.data.title,
			description: parsed.data.description || null,
			logoUrl: parsed.data.logoUrl || null,
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

	const parsed = expenseSchema.safeParse({
		title: formData.get("title"),
		description: formData.get("description") || undefined,
		logoUrl: formData.get("logoUrl") || undefined,
		value: Number(formData.get("value")),
		frequency: formData.get("frequency") as ExpenseFrequency,
		dueDate: formData.get("dueDate") || undefined,
	});

	if (!parsed.success) {
		return { error: parsed.error.flatten().fieldErrors as Record<string, string[] | undefined> };
	}

	const dueDate = parsed.data.dueDate ? new Date(parsed.data.dueDate) : null;

	await prisma.expense.updateMany({
		where: { id, userId: session.user.id },
		data: {
			title: parsed.data.title,
			description: parsed.data.description || null,
			logoUrl: parsed.data.logoUrl || null,
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
