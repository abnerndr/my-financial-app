"use client";

import { markAlertRead, markAllAlertsRead } from "@/app/actions/alerts";
import { AlertDescription, AlertTitle, Alert as AlertUI } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { Alert } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertTriangle, Info } from "lucide-react";
import { useRouter } from "next/navigation";

const typeConfig: Record<
	string,
	{ variant: "default" | "destructive" | "success" | "warning"; icon: React.ReactNode }
> = {
	LIMIT_WARNING: { variant: "warning", icon: <AlertTriangle className="size-4" /> },
	CRITICAL: { variant: "destructive", icon: <AlertTriangle className="size-4" /> },
	INFO: { variant: "default", icon: <Info className="size-4" /> },
};

export function AlertList({ alerts }: { alerts: Alert[] }) {
	const router = useRouter();
	const markRead = useMutation({
		mutationFn: markAlertRead,
		onSuccess: () => router.refresh(),
	});
	const markAllRead = useMutation({
		mutationFn: markAllAlertsRead,
		onSuccess: () => router.refresh(),
	});

	const unreadCount = alerts.filter((a) => !a.read).length;

	if (alerts.length === 0) {
		return <p className="py-8 text-center text-muted-foreground">Nenhum alerta ainda.</p>;
	}

	return (
		<div className="space-y-4">
			{unreadCount > 0 && (
				<Button variant="outline" size="sm" onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending}>
					Marcar todos como lidos
				</Button>
			)}
			<div className="space-y-3">
				{alerts.map((a) => {
					const config = typeConfig[a.type] ?? typeConfig.INFO;
					return (
						<AlertUI key={a.id} variant={config.variant} className={a.read ? "opacity-70" : ""}>
							<div className="flex items-start justify-between gap-2">
								<div className="flex gap-2">
									{config.icon}
									<div>
										<AlertTitle>
											{a.type === "LIMIT_WARNING" ? "Limite de aviso" : a.type === "CRITICAL" ? "Crítico" : "Info"}
										</AlertTitle>
										<AlertDescription>{a.message}</AlertDescription>
										<p className="mt-1 text-xs text-muted-foreground">
											{format(new Date(a.triggeredAt), "PPp", { locale: ptBR })}
										</p>
									</div>
								</div>
								{!a.read && (
									<Button variant="ghost" size="sm" onClick={() => markRead.mutate(a.id)} disabled={markRead.isPending}>
										Marcar lido
									</Button>
								)}
							</div>
						</AlertUI>
					);
				})}
			</div>
		</div>
	);
}
