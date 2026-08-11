"use server";

import { getSession } from "@/lib/auth";
import { deleteLogoFromR2 } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { LogoSource } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

function revalidateLogoPaths() {
	revalidatePath("/logos");
	revalidatePath("/gastos");
	revalidatePath("/dashboard");
}

function isUniqueConstraintError(e: unknown): boolean {
	return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
}

const categoryNameSchema = z.string().trim().min(1, "Nome é obrigatório").max(60, "Nome muito longo");

export async function createLogoCategory(name: string) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const parsed = categoryNameSchema.safeParse(name);
	if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Nome inválido" };

	try {
		const category = await prisma.logoCategory.create({
			data: {
				name: parsed.data,
				userId: session.user.id,
			},
		});
		revalidateLogoPaths();
		return { success: true, category };
	} catch (e) {
		if (isUniqueConstraintError(e)) {
			return { error: "Você já possui uma categoria com esse nome" };
		}
		console.error("[logos] erro ao criar categoria", e);
		return { error: "Erro ao criar categoria" };
	}
}

const createLogoSchema = z.object({
	name: z.string().trim().min(1, "Nome é obrigatório").max(60, "Nome muito longo"),
	categoryId: z.string().min(1, "Categoria é obrigatória"),
	source: z.enum(["UPLOAD", "URL"]),
	url: z.string().url("URL inválida"),
	r2Key: z.string().optional(),
});

export async function createLogo(input: {
	name: string;
	categoryId: string;
	source: LogoSource;
	url: string;
	r2Key?: string;
}) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const parsed = createLogoSchema.safeParse(input);
	if (!parsed.success) {
		return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
	}

	if (parsed.data.source === "UPLOAD" && !parsed.data.r2Key) {
		return { error: "Upload incompleto (r2Key ausente)" };
	}

	const category = await prisma.logoCategory.findUnique({
		where: { id: parsed.data.categoryId },
		select: { userId: true },
	});

	if (!category) return { error: "Categoria não encontrada" };
	if (category.userId === null) {
		return { error: "Não é possível adicionar logos a categorias do sistema" };
	}
	if (category.userId !== session.user.id) {
		return { error: "Não autorizado" };
	}

	try {
		const logo = await prisma.logo.create({
			data: {
				name: parsed.data.name,
				categoryId: parsed.data.categoryId,
				userId: session.user.id,
				source: parsed.data.source,
				url: parsed.data.url,
				r2Key: parsed.data.source === "UPLOAD" ? parsed.data.r2Key ?? null : null,
			},
		});
		revalidateLogoPaths();
		return { success: true, logo };
	} catch (e) {
		if (isUniqueConstraintError(e)) {
			return { error: "Você já possui um logo com esse nome nessa categoria" };
		}
		console.error("[logos] erro ao criar logo", e);
		return { error: "Erro ao criar logo" };
	}
}

export async function deleteLogo(id: string) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const logo = await prisma.logo.findFirst({
		where: { id, userId: session.user.id },
	});
	if (!logo) return { error: "Logo não encontrado" };

	// Desvincula dos gastos sem apagar a URL exibida (evita quebrar UI existente).
	await prisma.expense.updateMany({
		where: { logoId: id },
		data: { logoId: null },
	});

	if (logo.source === "UPLOAD" && logo.r2Key) {
		try {
			await deleteLogoFromR2(logo.r2Key);
		} catch (e) {
			console.error("[logos] erro ao remover arquivo do R2", e);
		}
	}

	await prisma.logo.delete({ where: { id } });

	revalidateLogoPaths();
	return { success: true };
}

export async function deleteLogoCategory(id: string) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const category = await prisma.logoCategory.findFirst({
		where: { id, userId: session.user.id },
		include: { _count: { select: { logos: true } } },
	});
	if (!category) return { error: "Categoria não encontrada" };

	if (category._count.logos > 0) {
		return { error: "Remova os logos da categoria antes de excluí-la" };
	}

	await prisma.logoCategory.delete({ where: { id } });

	revalidateLogoPaths();
	return { success: true };
}
