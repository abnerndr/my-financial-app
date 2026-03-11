import { getEvolutionInfo } from "@/lib/evolution-api";
import { NextResponse } from "next/server";

/**
 * GET /api/integrations/evolution/info
 * Retorna informações da instância Evolution API (health/status).
 * Documentação: https://doc.evolution-api.com/v2/api-reference/get-information
 */
export async function GET() {
	const info = await getEvolutionInfo();
	if (!info) {
		return NextResponse.json(
			{ error: "Evolution API não configurada ou indisponível" },
			{ status: 503 }
		);
	}
	return NextResponse.json(info);
}
