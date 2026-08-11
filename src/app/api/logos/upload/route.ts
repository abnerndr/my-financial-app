import { getSession } from "@/lib/auth";
import { isAllowedLogoMime, MAX_LOGO_BYTES, uploadLogoToR2 } from "@/lib/r2";
import { NextResponse } from "next/server";

/**
 * POST /api/logos/upload
 * FormData: { file: File }
 * Retorna { url, r2Key } ou { error } em caso de falha.
 */
export async function POST(request: Request) {
	try {
		const session = await getSession();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
		}

		const formData = await request.formData();
		const file = formData.get("file");

		if (!(file instanceof File)) {
			return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
		}

		if (!isAllowedLogoMime(file.type)) {
			return NextResponse.json(
				{ error: "Tipo de arquivo não permitido. Use PNG, JPG, WebP ou SVG." },
				{ status: 400 },
			);
		}

		if (file.size > MAX_LOGO_BYTES) {
			return NextResponse.json({ error: "Arquivo maior que 2MB." }, { status: 400 });
		}

		const bytes = Buffer.from(await file.arrayBuffer());
		const { url, r2Key } = await uploadLogoToR2({
			userId: session.user.id,
			bytes,
			contentType: file.type,
		});

		return NextResponse.json({ url, r2Key }, { status: 201 });
	} catch (e) {
		console.error("[logos/upload]", e);
		const message = e instanceof Error ? e.message : "Erro ao enviar arquivo";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
