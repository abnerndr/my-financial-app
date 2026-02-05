"use server";

import { getSession } from "@/lib/auth";
import { sendNotificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import type { AlertType } from "@prisma/client";

export async function createAlert(type: AlertType, message: string, metadata?: Record<string, unknown>) {
	const session = await getSession();
	if (!session?.user?.id) return null;

	const alert = await prisma.alert.create({
		data: {
			userId: session.user.id,
			type,
			message,
			metadata: metadata ? (metadata as object) : undefined,
		},
	});

	// Envia notificação por email apenas se o usuário permitiu
	const [user, settings] = await Promise.all([
		prisma.user.findUnique({
			where: { id: session.user.id },
			select: { email: true },
		}),
		prisma.userSettings.findUnique({
			where: { userId: session.user.id },
			select: { emailNotificationsEnabled: true },
		}),
	]);

	const emailEnabled = settings?.emailNotificationsEnabled !== false;
	if (user?.email && emailEnabled) {
		const subject =
			type === "LIMIT_WARNING"
				? "Atenção: limite de orçamento"
				: type === "CRITICAL"
				? "Alerta crítico"
				: "Notificação";
		await sendNotificationEmail(user.email, subject, message, {
			type: type === "CRITICAL" ? "critical" : type === "LIMIT_WARNING" ? "warning" : "info",
		});
	}

	return alert;
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
