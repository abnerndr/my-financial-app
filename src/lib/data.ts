import { createAlert } from "@/app/actions/alerts";
import { getSession } from "@/lib/auth";
import {
	remainingBalance,
	totalMonthlyExpenses,
	totalMonthlyIncome,
	totalSaved,
	usagePercent,
} from "@/lib/calculations";
import { sendWhatsAppText } from "@/lib/evolution-api";
import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { getMonthRangeInTimeZone } from "@/lib/month";

export async function getDashboardData() {
	const session = await getSession();
	if (!session?.user?.id) return null;

	const { start: startOfMonth, end: endOfMonth } = getMonthRangeInTimeZone();

	const [expenses, incomes, settings, paymentsThisMonth] = await Promise.all([
		prisma.expense.findMany({ where: { userId: session.user.id } }),
		prisma.income.findMany({ where: { userId: session.user.id } }),
		prisma.userSettings.findUnique({
			where: { userId: session.user.id },
		}),
		(prisma as unknown as { expensePayment: { findMany: (args: object) => Promise<Array<{ expense: { value: unknown } }>> } }).expensePayment.findMany({
			where: {
				expense: { userId: session.user.id },
				referenceMonth: { gte: startOfMonth, lt: endOfMonth },
			},
			include: { expense: { select: { value: true } } },
		}),
	]);

	const warningPercent = settings?.warningLimitPercent ?? 0;
	const monthlyIncome = totalMonthlyIncome(incomes);
	const saved = totalSaved(incomes);
	const monthlyExpenses = totalMonthlyExpenses(expenses);
	const totalPaidThisMonth = paymentsThisMonth.reduce(
		(acc: number, p: (typeof paymentsThisMonth)[number]) => acc + Number(p.expense.value),
		0
	);
	const balance = remainingBalance(incomes, expenses);
	const { usedPercent, remainingPercent, isCritical } = usagePercent(incomes, expenses, warningPercent);

	if (isCritical && (incomes.length > 0 || expenses.length > 0)) {
		const recentAlert = await prisma.alert.findFirst({
			where: {
				userId: session.user.id,
				type: "LIMIT_WARNING",
				read: false,
				triggeredAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
			},
		});
		if (!recentAlert) {
			await createAlert(
				"LIMIT_WARNING",
				`Atenção: você atingiu ${warningPercent}% do limite. Restam ${remainingPercent.toFixed(0)}% do orçamento.`,
				{ usedPercent, remainingPercent, warningPercent },
			);

			// Envia também uma notificação via WhatsApp, se o usuário tiver habilitado
			if (settings?.phone && settings.phoneVerified && settings.whatsappNotificationsEnabled) {
				const remainingMoney = Math.max(0, balance);
				const message = [
					"*Alerta de limite de gastos*",
					"",
					`Você atingiu o limite de *${warningPercent.toFixed(0)}%* do seu orçamento.`,
					`Valor ainda disponível para gastar: *${formatCurrency(remainingMoney)}*.`,
					"",
					"Reveja seus gastos para não ultrapassar o limite configurado.",
				].join("\n");

				// Não deixa falha de envio quebrar o dashboard
				try {
					await sendWhatsAppText(settings.phone, message);
				} catch (e) {
					console.error("[dashboard] erro ao enviar alerta de limite via WhatsApp", e);
				}
			}
		}
	}

	return {
		expenses,
		incomes,
		settings,
		monthlyIncome,
		saved,
		monthlyExpenses,
		totalPaidThisMonth,
		balance,
		usedPercent,
		remainingPercent,
		isCritical,
		warningLimitPercent: warningPercent,
	};
}

export async function getExpenses() {
	const session = await getSession();
	if (!session?.user?.id) return [];
	return prisma.expense.findMany({
		where: { userId: session.user.id },
		orderBy: { createdAt: "desc" },
	});
}

/** Retorna gastos com flag indicando se foram pagos no mês/ano informado. */
export async function getExpensesWithPaymentStatus(year?: number, month?: number) {
	const session = await getSession();
	if (!session?.user?.id) return [];
	const baseDate = year != null && month != null ? new Date(year, month, 1) : new Date();
	const { start: startOfMonth, end: endOfMonth } = getMonthRangeInTimeZone(baseDate);

	const [expenses, paidIds] = await Promise.all([
		prisma.expense.findMany({
			where: { userId: session.user.id },
			orderBy: { createdAt: "desc" },
		}),
		(prisma as unknown as { expensePayment: { findMany: (args: object) => Promise<Array<{ expenseId: string }>> } }).expensePayment
			.findMany({
				where: { referenceMonth: { gte: startOfMonth, lt: endOfMonth }, expense: { userId: session.user.id } },
				select: { expenseId: true },
			})
			.then((list: Array<{ expenseId: string }>) => new Set(list.map((p) => p.expenseId))),
	]);

	return expenses.map((e: (typeof expenses)[number]) => ({
		id: e.id,
		userId: e.userId,
		title: e.title,
		description: e.description,
		logoUrl: e.logoUrl,
		value: Number(e.value),
		frequency: e.frequency,
		dueDate: (e as { dueDate?: Date | null }).dueDate?.toISOString() ?? null,
		createdAt: e.createdAt.toISOString(),
		updatedAt: e.updatedAt.toISOString(),
		paidThisMonth: paidIds.has(e.id),
	}));
}

/** Histórico de pagamentos concluídos (por mês). */
export async function getPaymentsHistory(year?: number, month?: number) {
	const session = await getSession();
	if (!session?.user?.id) return [];
	const baseDate = year != null && month != null ? new Date(year, month, 1) : new Date();
	const { start: startOfMonth, end: endOfMonth } = getMonthRangeInTimeZone(baseDate);

	const payments = await (prisma as unknown as { expensePayment: { findMany: (args: object) => Promise<Array<{ id: string; expenseId: string; referenceMonth: Date; paidAt: Date; expense: { title: string; value: unknown } }>> } }).expensePayment.findMany({
		where: {
			expense: { userId: session.user.id },
			referenceMonth: { gte: startOfMonth, lt: endOfMonth },
		},
		include: { expense: true },
		orderBy: { paidAt: "desc" },
	});

	return payments.map((p) => ({
		id: p.id,
		expenseId: p.expenseId,
		expenseTitle: p.expense.title,
		expenseValue: Number(p.expense.value),
		referenceMonth: p.referenceMonth,
		paidAt: p.paidAt,
	}));
}

export async function getIncomes() {
	const session = await getSession();
	if (!session?.user?.id) return [];
	return prisma.income.findMany({
		where: { userId: session.user.id },
		orderBy: { createdAt: "desc" },
	});
}

export async function getAlerts() {
	const session = await getSession();
	if (!session?.user?.id) return [];
	return prisma.alert.findMany({
		where: { userId: session.user.id },
		orderBy: { triggeredAt: "desc" },
		take: 50,
	});
}

export async function getSettings() {
	const session = await getSession();
	if (!session?.user?.id) return null;
	return prisma.userSettings.findUnique({
		where: { userId: session.user.id },
	});
}
