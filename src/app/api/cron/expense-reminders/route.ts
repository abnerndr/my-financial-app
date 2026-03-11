import { sendWhatsAppText } from "@/lib/evolution-api";
import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import type { ExpenseFrequency } from "@prisma/client";
import { NextResponse } from "next/server";

/** Verifica se a requisição é do cron (segredo em header). */
function isAuthorized(request: Request): boolean {
	const secret = process.env.CRON_SECRET?.trim();
	if (!secret) return false;
	const auth = request.headers.get("authorization");
	if (auth?.startsWith("Bearer ")) return auth.slice(7) === secret;
	return request.headers.get("x-cron-secret") === secret;
}

/** Retorna se a despesa vence exatamente no dia `target` considerando a periodicidade. */
function isDueOnDate(
	dueDate: Date,
	frequency: ExpenseFrequency,
	target: Date
): boolean {
	const d = new Date(dueDate);
	const t = new Date(target);
	if (frequency === "ONE_TIME") {
		return d.getFullYear() === t.getFullYear() &&
			d.getMonth() === t.getMonth() &&
			d.getDate() === t.getDate();
	}
	if (frequency === "MONTHLY") {
		return d.getDate() === t.getDate();
	}
	if (frequency === "ANNUAL") {
		return d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
	}
	return false;
}

/** Formata data para exibição: dd/MM/yyyy */
function formatDueDate(date: Date): string {
	return date.toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

/**
 * GET ou POST /api/cron/expense-reminders
 *
 * Cron diário: envia WhatsApp (Evolution API) para usuários com:
 * - telefone cadastrado e verificado
 * - opção "receber mensagem no WhatsApp" ativa
 * Lembra das contas que vencem no dia seguinte e que ainda não foram marcadas como pagas.
 *
 * Proteção: defina CRON_SECRET no ambiente e envie em toda requisição:
 *   Authorization: Bearer <CRON_SECRET>
 *   ou header: x-cron-secret: <CRON_SECRET>
 *
 * Agendar (ex.: todo dia às 08:00):
 *   - cron-job.org, EasyCron, etc.: GET/POST https://seu-dominio/api/cron/expense-reminders
 *     com header Authorization: Bearer <seu CRON_SECRET>
 */
export async function GET(request: Request) {
	return runReminders(request);
}

export async function POST(request: Request) {
	return runReminders(request);
}

async function runReminders(request: Request) {
	if (!isAuthorized(request)) {
		return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
	}

	const now = new Date();
	const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
	const refMonth = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1);

	const usersToNotify = await prisma.userSettings.findMany({
		where: {
			phone: { not: null },
			phoneVerified: true,
			whatsappNotificationsEnabled: true,
		},
		select: { userId: true, phone: true },
	});

	const results: { userId: string; sent: number; errors: string[] }[] = [];

	for (const settings of usersToNotify) {
		const phone = settings.phone!;
		const sent: string[] = [];
		const errors: string[] = [];

		const expenses = await prisma.expense.findMany({
			where: { userId: settings.userId, dueDate: { not: null } },
			include: {
				payments: {
					where: { referenceMonth: refMonth },
					take: 1,
				},
			},
		});

		for (const expense of expenses) {
			const dueDate = expense.dueDate!;
			const dueTomorrow = isDueOnDate(dueDate, expense.frequency, tomorrow);
			if (!dueTomorrow) continue;

			const alreadyPaid = expense.payments.length > 0;
			if (alreadyPaid) continue;

			const value = Number(expense.value);
			const dueLabel = formatDueDate(tomorrow);
			const message = `*Lembrete – conta a vencer*\n\nA conta *${expense.title}* vence amanhã (${dueLabel}).\nValor: ${formatCurrency(value)}.\nPor favor, pague até no máximo o dia de amanhã.`;

			const ok = await sendWhatsAppText(phone, message);
			if (ok) sent.push(expense.id);
			else errors.push(expense.title);
		}

		results.push({
			userId: settings.userId,
			sent: sent.length,
			errors,
		});
	}

	return NextResponse.json({
		ok: true,
		at: now.toISOString(),
		tomorrow: tomorrow.toISOString().slice(0, 10),
		usersChecked: usersToNotify.length,
		results,
	});
}
