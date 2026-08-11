import { AuthOtpForm } from "@/components/auth/auth-otp-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getSession, isGoogleAuthEnabled } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ error?: string; callbackUrl?: string; verified?: string }>;
}) {
	const session = await getSession();
	if (session) redirect("/dashboard");

	const params = await searchParams;

	return (
		<AuthShell title="Login">
			{params.verified === "true" ? (
				<p className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800">
					Email verificado! Entre com o código OTP enviado ao seu email.
				</p>
			) : null}
			{params.error ? (
				<p className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
					{params.error === "OAuthAccountNotLinked"
						? "Este email já está vinculado a outra forma de login."
						: "Não foi possível entrar. Tente novamente."}
				</p>
			) : null}
			<AuthOtpForm mode="login" callbackUrl={params.callbackUrl} googleEnabled={isGoogleAuthEnabled()} />
		</AuthShell>
	);
}
