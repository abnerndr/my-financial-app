"use client";

import { updateEmailNotifications } from "@/app/actions/settings";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function NotificationToggle({ defaultEnabled }: { defaultEnabled: boolean }) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleChange = (checked: boolean) => {
		startTransition(async () => {
			await updateEmailNotifications(checked);
			router.refresh();
		});
	};

	return (
		<div className="flex items-center justify-between gap-4">
			<div className="space-y-0.5">
				<Label htmlFor="email-notifications" className="text-base font-medium">
					Receber notificações por email
				</Label>
				<p className="text-sm text-muted-foreground">
					Quando ativo, você recebe por email os alertas de limite e notificações do sistema.
				</p>
			</div>
			<button
				type="button"
				role="switch"
				aria-checked={defaultEnabled}
				id="email-notifications"
				disabled={isPending}
				onClick={() => handleChange(!defaultEnabled)}
				className={cn(
					"relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					defaultEnabled ? "bg-primary" : "bg-input"
				)}
			>
				<span
					className={cn(
						"pointer-events-none block size-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
						defaultEnabled ? "translate-x-5" : "translate-x-0.5"
					)}
				/>
			</button>
		</div>
	);
}
