import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { NotificationToggle } from "./notification-toggle";
import { WarningForm } from "./warning-form";
import { WhatsappIntegrationForm } from "./whatsapp-integration-form";

export default async function ConfiguracoesPage() {
	const session = await getSession();
	if (!session) redirect("/login");

	const settings = await getSettings();
	const defaultPercent = settings?.warningLimitPercent ?? 90;
	const emailNotificationsEnabled = settings?.emailNotificationsEnabled ?? true;

	return (
		<div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8 py-8">
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
					<CardTitle>Notificações por email</CardTitle>
					<CardDescription>
						Escolha se deseja receber alertas e notificações por email (limite de orçamento, situação crítica, etc.).
					</CardDescription>
				</CardHeader>
				<CardContent>
					<NotificationToggle defaultEnabled={emailNotificationsEnabled} />
				</CardContent>
			</Card>

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

			<Card>
				<CardHeader>
					<CardTitle>WhatsApp</CardTitle>
					<CardDescription>
						Cadastre e verifique seu número para receber notificações e enviar gastos via WhatsApp.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<WhatsappIntegrationForm
						defaultPhone={settings?.phone ?? null}
						defaultPhoneVerified={settings?.phoneVerified ?? false}
						defaultWhatsappEnabled={settings?.whatsappNotificationsEnabled ?? false}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
