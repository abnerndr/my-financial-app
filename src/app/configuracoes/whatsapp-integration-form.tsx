"use client";

import { updatePhone, updateWhatsappNotifications } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
	defaultPhone: string | null;
	defaultPhoneVerified: boolean;
	defaultWhatsappEnabled: boolean;
};

export function WhatsappIntegrationForm({ defaultPhone, defaultPhoneVerified, defaultWhatsappEnabled }: Props) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [phone, setPhone] = useState(defaultPhone ?? "");
	const [codeInput, setCodeInput] = useState("");
	const [codeSent, setCodeSent] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSavePhone = () => {
		setError(null);
		setCodeSent(false);
		setCodeInput("");
		startTransition(async () => {
			const result = await updatePhone(phone.trim() || null);
			if (result && "error" in result) {
				setError(result.error ?? "Erro ao salvar");
				return;
			}
			router.refresh();
		});
	};

	const handleRequestCode = () => {
		setError(null);
		if (phone.trim() !== (defaultPhone ?? "")) {
			setError("Salve o número antes de solicitar o código.");
			return;
		}
		startTransition(async () => {
			try {
				const res = await fetch("/api/integrations/whatsapp/request-code", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ phone: phone.trim() }),
				});
				const data = await res.json();
				if (!res.ok) {
					setError(data.error ?? "Erro ao solicitar código");
					return;
				}
				setCodeSent(true);
				router.refresh();
			} catch {
				setError("Erro ao solicitar código");
			}
		});
	};

	const handleVerifyCode = () => {
		setError(null);
		if (!codeInput.trim() || codeInput.length !== 6) {
			setError("Digite o código de 6 dígitos recebido no WhatsApp");
			return;
		}
		startTransition(async () => {
			try {
				const res = await fetch("/api/integrations/whatsapp/verify", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ phone: phone.trim(), code: codeInput.trim() }),
				});
				const data = await res.json();
				if (!res.ok) {
					setError(data.error ?? "Código inválido ou expirado");
					return;
				}
				setCodeInput("");
				setCodeSent(false);
				router.refresh();
			} catch {
				setError("Erro ao verificar");
			}
		});
	};

	const handleWhatsappToggle = (checked: boolean) => {
		startTransition(async () => {
			await updateWhatsappNotifications(checked);
			router.refresh();
		});
	};

	return (
		<div className="space-y-6">
			{error && <p className="text-sm text-destructive rounded-md bg-destructive/10 p-2">{error}</p>}

			<div className="space-y-2">
				<Label htmlFor="phone">Número de telefone (WhatsApp)</Label>
				<p className="text-sm text-muted-foreground">
					Formato internacional: +5511999999999. Usado para enviar notificações e identificar você ao enviar gastos via
					WhatsApp.
				</p>
				<div className="flex gap-2">
					<Input
						id="phone"
						type="tel"
						placeholder="+5511999999999"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						disabled={isPending}
					/>
					<Button type="button" onClick={handleSavePhone} disabled={isPending}>
						Salvar
					</Button>
				</div>
			</div>

			{phone.trim() && (
				<>
					{defaultPhoneVerified ? (
						<div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
							<p className="font-medium text-green-700 dark:text-green-400">Número verificado com sucesso.</p>
							<p className="text-sm text-muted-foreground mt-1">
								Seu WhatsApp está vinculado e pronto para receber notificações e enviar gastos.
							</p>
						</div>
					) : (
						<>
							<div className="flex items-center justify-between gap-4 rounded-lg border p-4">
								<div>
									<p className="font-medium">Status do telefone</p>
									<p className="text-sm text-muted-foreground">
										Não verificado. O código será enviado para o seu WhatsApp.
									</p>
								</div>
								<Button type="button" variant="outline" onClick={handleRequestCode} disabled={isPending}>
									Solicitar código
								</Button>
							</div>

							{codeSent && (
								<div className="rounded-lg border border-primary/50 bg-primary/5 p-4 space-y-3">
									<p className="font-medium">Digite o código recebido no WhatsApp</p>
									<div className="flex gap-2">
										<Input
											type="text"
											inputMode="numeric"
											maxLength={6}
											placeholder="123456"
											value={codeInput}
											onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, ""))}
											disabled={isPending}
											className="font-mono text-lg tracking-widest max-w-32"
										/>
										<Button type="button" onClick={handleVerifyCode} disabled={isPending || codeInput.length !== 6}>
											Verificar
										</Button>
									</div>
									<p className="text-sm text-muted-foreground">
										Verifique as mensagens do WhatsApp. O código expira em 10 minutos.
									</p>
								</div>
							)}
						</>
					)}

					<div className="flex items-center justify-between gap-4">
						<div className="space-y-0.5">
							<Label className="text-base font-medium">Permitir mensagens no meu WhatsApp</Label>
							<p className="text-sm text-muted-foreground">
								Quando ativo, a plataforma pode enviar notificações para este número via WhatsApp.
							</p>
						</div>
						<button
							type="button"
							role="switch"
							aria-checked={defaultWhatsappEnabled}
							disabled={isPending}
							onClick={() => handleWhatsappToggle(!defaultWhatsappEnabled)}
							className={cn(
								"relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
								defaultWhatsappEnabled ? "bg-primary" : "bg-input"
							)}
						>
							<span
								className={cn(
									"pointer-events-none block size-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
									defaultWhatsappEnabled ? "translate-x-5" : "translate-x-0.5"
								)}
							/>
						</button>
					</div>
				</>
			)}
		</div>
	);
}
