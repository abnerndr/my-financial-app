"use server";

import { getSession } from "@/lib/auth";
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
	});

	if (!parsed.success) {
		return { error: parsed.error.flatten().fieldErrors as Record<string, string[] | undefined> };
	}

	await prisma.expense.create({
		data: {
			userId: session.user.id,
			title: parsed.data.title,
			description: parsed.data.description || null,
			logoUrl: parsed.data.logoUrl || null,
			value: parsed.data.value,
			frequency: parsed.data.frequency,
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
	});

	if (!parsed.success) {
		return { error: parsed.error.flatten().fieldErrors as Record<string, string[] | undefined> };
	}

	await prisma.expense.updateMany({
		where: { id, userId: session.user.id },
		data: {
			title: parsed.data.title,
			description: parsed.data.description || null,
			logoUrl: parsed.data.logoUrl || null,
			value: parsed.data.value,
			frequency: parsed.data.frequency,
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
