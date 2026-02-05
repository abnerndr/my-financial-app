"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { AlertType } from "@prisma/client";

export async function createAlert(type: AlertType, message: string, metadata?: Record<string, unknown>) {
	const session = await getSession();
	if (!session?.user?.id) return null;

	return prisma.alert.create({
		data: {
			userId: session.user.id,
			type,
			message,
			metadata: metadata ? (metadata as object) : undefined,
		},
	});
}

export async function markAlertRead(id: string) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	await prisma.alert.updateMany({
		where: { id, userId: session.user.id },
		data: { read: true },
	});
	return { success: true };
}

export async function markAllAlertsRead() {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	await prisma.alert.updateMany({
		where: { userId: session.user.id },
		data: { read: true },
	});
	return { success: true };
}
