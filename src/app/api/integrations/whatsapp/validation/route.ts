import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function getApiKey(request: Request): string | null {
	const auth = request.headers.get("authorization");
	if (auth?.startsWith("Bearer ")) return auth.slice(7).trim();
	return request.headers.get("x-api-key")?.trim() ?? null;
}

function getPhone(request: Request): string | null {
	return request.headers.get("x-phone")?.trim() ?? null;
}

/**
 * API pública para o n8n: validar credenciais (API Key ou telefone).
 *
 * GET /api/integrations/expenses
 * Headers:
 *   - X-API-Key: <sua-chave> (ou Authorization: Bearer <sua-chave>)
 *   - ou X-Phone: +5511999999999 (telefone já verificado na plataforma)
 *
 * Retorna:
 *   - 200 { valid: true, userId: string } se encontrado
 *   - 200 { valid: false } se não encontrado
 */
export async function GET(request: Request) {
	try {
		const apiKey = getApiKey(request);
		const phone = getPhone(request);

		let userId: string | null = null;

		if (apiKey) {
			const settings = await prisma.userSettings.findFirst({
				where: { integrationApiKey: apiKey },
				select: { userId: true },
			});
			if (settings) userId = settings.userId;
		}

		if (!userId && phone) {
			const settings = await prisma.userSettings.findFirst({
				where: { phone, phoneVerified: true },
				select: { userId: true },
			});
			if (settings) userId = settings.userId;
		}

		if (!userId) {
			return NextResponse.json({ valid: false }, { status: 200 });
		}

		return NextResponse.json({ valid: true, userId }, { status: 200 });
	} catch (e) {
		console.error("[integrations/expenses][GET validate]", e);
		return NextResponse.json({ error: "Erro interno" }, { status: 500 });
	}
}
