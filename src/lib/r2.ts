// Variáveis de ambiente necessárias: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const ALLOWED_TYPES: Record<string, string> = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/webp": "webp",
	"image/svg+xml": "svg",
};

export const MAX_LOGO_BYTES = 2 * 1024 * 1024;

function requireEnv(name: string): string {
	const v = process.env[name]?.trim();
	if (!v) throw new Error(`Configuração R2 incompleta: falta ${name}`);
	return v;
}

function getClient(): S3Client {
	const accountId = requireEnv("R2_ACCOUNT_ID");
	return new S3Client({
		region: "auto",
		endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
			secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
		},
	});
}

export function isAllowedLogoMime(mime: string): boolean {
	return mime in ALLOWED_TYPES;
}

export async function uploadLogoToR2(params: {
	userId: string;
	bytes: Buffer;
	contentType: string;
}): Promise<{ url: string; r2Key: string }> {
	if (!isAllowedLogoMime(params.contentType)) {
		throw new Error("Tipo de arquivo não permitido. Use PNG, JPG, WebP ou SVG.");
	}
	if (params.bytes.byteLength > MAX_LOGO_BYTES) {
		throw new Error("Arquivo maior que 2MB.");
	}

	const ext = ALLOWED_TYPES[params.contentType];
	const r2Key = `logos/${params.userId}/${randomUUID()}.${ext}`;
	const bucket = requireEnv("R2_BUCKET_NAME");
	const publicBase = requireEnv("R2_PUBLIC_URL").replace(/\/$/, "");

	await getClient().send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: r2Key,
			Body: params.bytes,
			ContentType: params.contentType,
		}),
	);

	return { url: `${publicBase}/${r2Key}`, r2Key };
}

export async function deleteLogoFromR2(r2Key: string): Promise<void> {
	const bucket = requireEnv("R2_BUCKET_NAME");
	await getClient().send(
		new DeleteObjectCommand({
			Bucket: bucket,
			Key: r2Key,
		}),
	);
}
