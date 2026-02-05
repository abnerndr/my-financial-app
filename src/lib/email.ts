import sgMail from "@sendgrid/mail";

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM || "noreply@example.com";
const fromName = process.env.SENDGRID_FROM_NAME || "Controle Financeiro";

if (apiKey) {
	sgMail.setApiKey(apiKey);
}

function isConfigured(): boolean {
	return Boolean(apiKey && fromEmail);
}

/**
 * Envia email de verificação para novo cadastro
 */
export async function sendVerificationEmail(to: string, verificationUrl: string, userName?: string): Promise<boolean> {
	if (!isConfigured()) {
		console.warn("[Email] SendGrid não configurado. Link de verificação:", verificationUrl);
		return false;
	}

	const msg = {
		to,
		from: { email: fromEmail, name: fromName },
		subject: "Verifique seu email - Controle Financeiro",
		text: `Olá${userName ? ` ${userName}` : ""}! Clique no link para verificar seu email: ${verificationUrl}`,
		html: `
			<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
				<h2 style="color: #171717;">Verifique seu email</h2>
				<p>Olá${userName ? ` ${userName}` : ""}!</p>
				<p>Clique no botão abaixo para ativar sua conta no Controle Financeiro:</p>
				<p style="margin: 24px 0;">
					<a href="${verificationUrl}" style="background: #171717; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Verificar email</a>
				</p>
				<p style="color: #737373; font-size: 14px;">Ou copie e cole este link no navegador:</p>
				<p style="color: #737373; font-size: 12px; word-break: break-all;">${verificationUrl}</p>
				<p style="color: #737373; font-size: 12px; margin-top: 24px;">Este link expira em 24 horas.</p>
			</div>
		`,
	};

	try {
		await sgMail.send(msg);
		return true;
	} catch (error: unknown) {
		console.error("[Email] Erro ao enviar verificação:", error);
		if (error && typeof error === "object" && "response" in error) {
			const res = (error as { response?: { body?: unknown } }).response;
			if (res?.body) console.error("[Email] Resposta SendGrid:", res.body);
		}
		return false;
	}
}

/**
 * Envia email de notificação (alertas de limite, etc.)
 */
export async function sendNotificationEmail(
	to: string,
	subject: string,
	message: string,
	options?: { type?: "warning" | "critical" | "info" }
): Promise<boolean> {
	if (!isConfigured()) {
		console.warn("[Email] SendGrid não configurado. Notificação:", subject, message);
		return false;
	}

	const type = options?.type ?? "info";
	const borderColor = type === "critical" ? "#dc2626" : type === "warning" ? "#d97706" : "#2563eb";

	const msg = {
		to,
		from: { email: fromEmail, name: fromName },
		subject: `[Controle Financeiro] ${subject}`,
		text: message,
		html: `
			<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
				<h2 style="color: #171717;">${subject}</h2>
				<div style="border-left: 4px solid ${borderColor}; padding: 16px; background: #fafafa; border-radius: 0 8px 8px 0; margin: 16px 0;">
					<p style="margin: 0; color: #404040;">${message.replace(/\n/g, "<br>")}</p>
				</div>
				<p style="color: #737373; font-size: 12px;">Controle Financeiro - Notificação automática</p>
			</div>
		`,
	};

	try {
		await sgMail.send(msg);
		return true;
	} catch (error: unknown) {
		console.error("[Email] Erro ao enviar notificação:", error);
		if (error && typeof error === "object" && "response" in error) {
			const res = (error as { response?: { body?: unknown } }).response;
			if (res?.body) console.error("[Email] Resposta SendGrid:", res.body);
		}
		return false;
	}
}
