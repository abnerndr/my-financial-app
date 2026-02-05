import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { WarningForm } from "./warning-form";

export default async function ConfiguracoesPage() {
	const session = await getSession();
	if (!session) redirect("/login");

	const settings = await getSettings();
	const defaultPercent = settings?.warningLimitPercent ?? 90;

	return (
		<div className="container max-w-2xl space-y-8 py-8">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/dashboard">
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold">Configurações</h1>
					<p className="text-muted-foreground">Percentual de aviso de limite</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Alerta de limite</CardTitle>
					<CardDescription>
						Quando seu uso (gastos em relação à renda + guardado) atingir este percentual, o status no dashboard ficará
						crítico e as cores de alerta serão exibidas. Ex: 90% = alerta quando faltar 10% para “acabar” o dinheiro.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<WarningForm defaultPercent={defaultPercent} />
				</CardContent>
			</Card>
		</div>
	);
}
