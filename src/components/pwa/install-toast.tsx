"use client";

import { Button } from "@/components/ui/button";
import { isIosDevice, isMobileDevice, isStandaloneDisplay } from "@/hooks/use-is-mobile";
import { Download, Share, X } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "pwa-install-dismissed-at";
const DISMISS_DAYS = 14;

type BeforeInstallPromptEvent = Event & {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function wasDismissedRecently(): boolean {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return false;
		const at = Number(raw);
		if (!Number.isFinite(at)) return false;
		return Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
	} catch {
		return false;
	}
}

function dismiss() {
	try {
		localStorage.setItem(STORAGE_KEY, String(Date.now()));
	} catch {
		/* ignore */
	}
}

/**
 * Toast de instalação do app web — só em mobile e fora do modo standalone.
 * Android: beforeinstallprompt. iOS: instruções "Adicionar à Tela de Início".
 * Desktop: nunca exibe (md:hidden + checagem JS).
 */
export function PwaInstallToast() {
	const [visible, setVisible] = useState(false);
	const [ios, setIos] = useState(false);
	const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
	const [installing, setInstalling] = useState(false);

	useEffect(() => {
		if (!isMobileDevice() || isStandaloneDisplay() || wasDismissedRecently()) {
			return;
		}

		const onIos = isIosDevice();
		setIos(onIos);

		const onBip = (e: Event) => {
			e.preventDefault();
			setDeferred(e as BeforeInstallPromptEvent);
			setVisible(true);
		};
		window.addEventListener("beforeinstallprompt", onBip);

		const delayMs = onIos ? 1800 : 2500;
		const t = window.setTimeout(() => setVisible(true), delayMs);

		return () => {
			window.removeEventListener("beforeinstallprompt", onBip);
			window.clearTimeout(t);
		};
	}, []);

	const close = () => {
		dismiss();
		setVisible(false);
	};

	const install = async () => {
		if (!deferred) return;
		setInstalling(true);
		try {
			await deferred.prompt();
			await deferred.userChoice;
			setDeferred(null);
			close();
		} catch {
			setInstalling(false);
		}
	};

	if (!visible) return null;

	return (
		<div
			role="status"
			aria-live="polite"
			className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[100] mx-auto max-w-md rounded-xl border bg-background p-4 shadow-lg md:hidden"
		>
			<div className="flex items-start gap-3">
				<div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<Download className="size-4" />
				</div>
				<div className="min-w-0 flex-1 space-y-2">
					<p className="text-sm font-semibold leading-snug">Instalar o app</p>
					{ios ? (
						<p className="text-xs leading-relaxed text-muted-foreground">
							No Safari, toque em{" "}
							<span className="inline-flex items-center gap-0.5 font-medium text-foreground">
								<Share className="inline size-3.5" aria-hidden /> Compartilhar
							</span>{" "}
							e depois em <span className="font-medium text-foreground">Adicionar à Tela de Início</span>.
						</p>
					) : deferred ? (
						<p className="text-xs leading-relaxed text-muted-foreground">
							Instale o Controle Financeiro na tela inicial para acesso rápido, como um app.
						</p>
					) : (
						<p className="text-xs leading-relaxed text-muted-foreground">
							No menu do navegador, escolha <span className="font-medium text-foreground">Instalar app</span> ou{" "}
							<span className="font-medium text-foreground">Adicionar à tela inicial</span>.
						</p>
					)}
					<div className="flex flex-wrap gap-2 pt-1">
						{!ios && deferred ? (
							<Button size="sm" className="min-h-10 px-4" onClick={install} disabled={installing}>
								{installing ? "Abrindo..." : "Instalar"}
							</Button>
						) : null}
						<Button size="sm" variant="ghost" className="min-h-10" onClick={close}>
							Agora não
						</Button>
					</div>
				</div>
				<button
					type="button"
					onClick={close}
					className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
					aria-label="Fechar"
				>
					<X className="size-4" />
				</button>
			</div>
		</div>
	);
}
