"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { IncomeType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const incomeSchema = z.object({
	type: z.enum(["SALARY", "BENEFITS", "SAVED", "OTHER"]),
	title: z.string().min(1, "Título é obrigatório"),
	value: z.number().positive("Valor deve ser positivo"),
});

export async function createIncome(formData: FormData) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const parsed = incomeSchema.safeParse({
		type: formData.get("type") as IncomeType,
		title: formData.get("title"),
		value: Number(formData.get("value")),
	});

	if (!parsed.success) {
		return { error: parsed.error.flatten().fieldErrors as Record<string, string[] | undefined> };
	}

	await prisma.income.create({
		data: {
			userId: session.user.id,
			type: parsed.data.type,
			title: parsed.data.title,
			value: parsed.data.value,
		},
	});

	revalidatePath("/");
	revalidatePath("/dashboard");
	revalidatePath("/renda");
	revalidatePath("/relatorios");
	return { success: true };
}

export async function updateIncome(id: string, formData: FormData) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const parsed = incomeSchema.safeParse({
		type: formData.get("type") as IncomeType,
		title: formData.get("title"),
		value: Number(formData.get("value")),
	});

	if (!parsed.success) {
		return { error: parsed.error.flatten().fieldErrors as Record<string, string[] | undefined> };
	}

	await prisma.income.updateMany({
		where: { id, userId: session.user.id },
		data: {
			type: parsed.data.type,
			title: parsed.data.title,
			value: parsed.data.value,
		},
	});

	revalidatePath("/");
	revalidatePath("/dashboard");
	revalidatePath("/renda");
	revalidatePath("/relatorios");
	return { success: true };
}

export async function deleteIncome(id: string) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	await prisma.income.deleteMany({
		where: { id, userId: session.user.id },
	});

	revalidatePath("/");
	revalidatePath("/dashboard");
	revalidatePath("/renda");
	revalidatePath("/relatorios");
	return { success: true };
}
