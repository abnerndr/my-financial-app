import { verifyEmail } from "@/app/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function VerifyEmailPage({
	searchParams,
}: {
	searchParams: Promise<{ token?: string; email?: string }>;
}) {
	const params = await searchParams;
	const token = params.token;
	const email = params.email;

	if (!token || !email) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Verificação de Email</CardTitle>
					</CardHeader>
					<CardContent>
						<Alert variant="destructive">
							<AlertCircle className="size-4" />
							<AlertTitle>Link inválido</AlertTitle>
							<AlertDescription>O link de verificação está incompleto ou inválido.</AlertDescription>
						</Alert>
						<Button asChild className="mt-4 w-full">
							<Link href="/login">Voltar para login</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	let result: { success: boolean; error?: string };
	try {
		result = await verifyEmail(token, email);
	} catch (err) {
		console.error("[verify-email page]", err);
		result = { success: false, error: "Ocorreu um erro ao verificar seu email. Tente novamente mais tarde." };
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Verificação de Email</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{result.success ? (
						<>
							<Alert variant="success">
								<CheckCircle2 className="size-4" />
								<AlertTitle>Email verificado!</AlertTitle>
								<AlertDescription>Sua conta foi ativada com sucesso. Você já pode fazer login.</AlertDescription>
							</Alert>
							<Button asChild className="w-full">
								<Link href="/login?verified=true">Ir para login</Link>
							</Button>
						</>
					) : (
						<>
							<Alert variant="destructive">
								<AlertCircle className="size-4" />
								<AlertTitle>Erro na verificação</AlertTitle>
								<AlertDescription>
									{result.error || "Não foi possível verificar seu email. O link pode ter expirado."}
								</AlertDescription>
							</Alert>
							<Button asChild variant="outline" className="w-full">
								<Link href="/login">Voltar para login</Link>
							</Button>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
