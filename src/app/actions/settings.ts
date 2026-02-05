"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const settingsSchema = z.object({
	warningLimitPercent: z.number().min(1).max(99),
});

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
