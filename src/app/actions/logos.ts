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

const updateLogoSchema = z.object({
	id: z.string().min(1),
	name: z.string().trim().min(1, "Nome é obrigatório").max(60, "Nome muito longo"),
	categoryId: z.string().min(1, "Categoria é obrigatória"),
	source: z.enum(["UPLOAD", "URL"]).optional(),
	url: z.string().url("URL inválida").optional(),
	r2Key: z.string().optional(),
});

function validateUploadPayload(userId: string, url: string, r2Key: string | undefined): string | null {
	if (!r2Key) return "Upload incompleto (r2Key ausente)";

	const expectedPrefix = `logos/${userId}/`;
	if (!r2Key.startsWith(expectedPrefix)) {
		return "r2Key inválido para este usuário";
	}

	const publicBase = process.env.R2_PUBLIC_URL?.trim().replace(/\/$/, "");
	if (publicBase && url !== `${publicBase}/${r2Key}`) {
		return "URL não corresponde ao arquivo enviado";
	}

	return null;
}

async function assertOwnedCategory(userId: string, categoryId: string): Promise<string | null> {
	const category = await prisma.logoCategory.findUnique({
		where: { id: categoryId },
		select: { userId: true },
	});

	if (!category) return "Categoria não encontrada";
	if (category.userId === null) return "Não é possível adicionar logos a categorias do sistema";
	if (category.userId !== userId) return "Não autorizado";
	return null;
}

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

	if (parsed.data.source === "UPLOAD") {
		const uploadError = validateUploadPayload(session.user.id, parsed.data.url, parsed.data.r2Key);
		if (uploadError) return { error: uploadError };
	}

	const categoryError = await assertOwnedCategory(session.user.id, parsed.data.categoryId);
	if (categoryError) return { error: categoryError };

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

export async function updateLogo(input: {
	id: string;
	name: string;
	categoryId: string;
	source?: LogoSource;
	url?: string;
	r2Key?: string;
}) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const parsed = updateLogoSchema.safeParse(input);
	if (!parsed.success) {
		return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
	}

	const replacingImage = parsed.data.source !== undefined || parsed.data.url !== undefined;
	if (replacingImage) {
		if (!parsed.data.source || !parsed.data.url) {
			return { error: "Informe origem e URL da nova imagem" };
		}
		if (parsed.data.source === "UPLOAD") {
			const uploadError = validateUploadPayload(session.user.id, parsed.data.url, parsed.data.r2Key);
			if (uploadError) return { error: uploadError };
		}
	}

	const logo = await prisma.logo.findFirst({
		where: { id: parsed.data.id, userId: session.user.id },
	});
	if (!logo) return { error: "Logo não encontrado" };

	const categoryError = await assertOwnedCategory(session.user.id, parsed.data.categoryId);
	if (categoryError) return { error: categoryError };

	const nextSource = replacingImage ? parsed.data.source! : logo.source;
	const nextUrl = replacingImage ? parsed.data.url! : logo.url;
	const nextR2Key =
		nextSource === "UPLOAD"
			? replacingImage
				? parsed.data.r2Key ?? null
				: logo.r2Key
			: null;

	const urlChanged = nextUrl !== logo.url;

	try {
		const updated = await prisma.$transaction(async (tx) => {
			const nextLogo = await tx.logo.update({
				where: { id: logo.id },
				data: {
					name: parsed.data.name,
					categoryId: parsed.data.categoryId,
					source: nextSource,
					url: nextUrl,
					r2Key: nextR2Key,
				},
			});

			if (urlChanged) {
				await tx.expense.updateMany({
					where: { logoId: logo.id, userId: session.user.id },
					data: { logoUrl: nextUrl },
				});
			}

			return nextLogo;
		});

		const expectedPrefix = `logos/${session.user.id}/`;
		const oldR2Key = logo.r2Key;
		if (
			oldR2Key &&
			oldR2Key.startsWith(expectedPrefix) &&
			oldR2Key !== nextR2Key
		) {
			try {
				await deleteLogoFromR2(oldR2Key);
			} catch (e) {
				console.error("[logos] erro ao remover arquivo antigo do R2", e);
			}
		}

		revalidateLogoPaths();
		return { success: true as const, logo: updated };
	} catch (e) {
		if (isUniqueConstraintError(e)) {
			return { error: "Você já possui um logo com esse nome nessa categoria" };
		}
		console.error("[logos] erro ao atualizar logo", e);
		return { error: "Erro ao atualizar logo" };
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
		where: { logoId: id, userId: session.user.id },
		data: { logoId: null },
	});

	const expectedPrefix = `logos/${session.user.id}/`;
	if (logo.source === "UPLOAD" && logo.r2Key && logo.r2Key.startsWith(expectedPrefix)) {
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
