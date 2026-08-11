import { AuthOtpForm } from "@/components/auth/auth-otp-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getSession, isGoogleAuthEnabled } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CadastroPage() {
	const session = await getSession();
	if (session) redirect("/dashboard");

	return (
		<AuthShell title="Cadastro" backHref="/login">
			<AuthOtpForm mode="register" googleEnabled={isGoogleAuthEnabled()} />
		</AuthShell>
	);
}
