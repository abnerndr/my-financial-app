import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function CadastroPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Criar conta</CardTitle>
					<CardDescription>Cadastre-se para começar a controlar suas finanças</CardDescription>
				</CardHeader>
				<CardContent>
					<RegisterForm />
					<div className="mt-4 text-center text-sm text-muted-foreground">
						Já tem uma conta?{" "}
						<Link href="/login" className="text-primary hover:underline">
							Entrar
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
