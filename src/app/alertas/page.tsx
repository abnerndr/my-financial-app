import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { getAlerts } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertList } from "./alert-list";

export default async function AlertasPage() {
	const session = await getSession();
	if (!session) redirect("/login");

	const alerts = await getAlerts();

	return (
		<div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8 py-8">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/dashboard">
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold">Alertas</h1>
					<p className="text-muted-foreground">
						Histórico de alertas (limite, crítico). Futuramente vinculável a plataformas de mensagem.
					</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Notificações</CardTitle>
					<p className="text-sm text-muted-foreground">{alerts.length} alerta(s)</p>
				</CardHeader>
				<CardContent>
					<AlertList alerts={alerts} />
				</CardContent>
			</Card>
		</div>
	);
}
