import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ error?: string; callbackUrl?: string; verified?: string }>;
}) {
	const session = await getSession();
	if (session) redirect("/dashboard");

	const params = await searchParams;

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Controle Financeiro</CardTitle>
					<CardDescription>Entre com sua conta para acessar a plataforma</CardDescription>
				</CardHeader>
				<CardContent>
					<LoginForm error={params.error} verified={params.verified} />
					<div className="mt-4 text-center text-sm text-muted-foreground">
						Não tem uma conta?{" "}
						<Link href="/cadastro" className="text-primary hover:underline">
							Cadastre-se
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
