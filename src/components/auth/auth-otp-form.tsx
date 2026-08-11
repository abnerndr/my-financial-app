"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { OtpInput } from "@/components/ui/otp-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Channel = "email" | "whatsapp";
type Step = "identify" | "otp";

export function AuthOtpForm({
	mode,
	callbackUrl,
	googleEnabled,
}: {
	mode: "login" | "register";
	callbackUrl?: string;
	googleEnabled: boolean;
}) {
	const router = useRouter();
	const [channel, setChannel] = useState<Channel>("email");
	const [step, setStep] = useState<Step>("identify");
	const [name, setName] = useState("");
	const [destination, setDestination] = useState("");
	const [code, setCode] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [resendIn, setResendIn] = useState(0);

	const masked = useMemo(() => {
		if (channel === "email") return destination;
		const d = destination.replace(/\D/g, "");
		if (d.length < 4) return destination;
		return `•••${d.slice(-4)}`;
	}, [channel, destination]);

	const requestOtp = async () => {
		setError(null);
		setLoading(true);
		try {
			const res = await fetch("/api/auth/otp/request", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					channel,
					destination,
					intent: mode,
					name: mode === "register" ? name : undefined,
				}),
			});
			const data = (await res.json()) as { error?: string; destination?: string };
			if (!res.ok) {
				setError(data.error ?? "Não foi possível enviar o código");
				return;
			}
			if (data.destination) setDestination(data.destination);
			setStep("otp");
			setCode("");
			setResendIn(60);
			const t = window.setInterval(() => {
				setResendIn((s) => {
					if (s <= 1) {
						window.clearInterval(t);
						return 0;
					}
					return s - 1;
				});
			}, 1000);
		} catch {
			setError("Erro de rede. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	const verifyOtp = async () => {
		setError(null);
		if (code.length !== 4) {
			setError("Digite o código de 4 dígitos");
			return;
		}
		setLoading(true);
		try {
			const result = await signIn("otp", {
				channel,
				destination,
				code,
				redirect: false,
			});
			if (result?.error) {
				setError(result.error);
				return;
			}
			router.push(callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard");
			router.refresh();
		} catch {
			setError("Não foi possível verificar o código");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{step === "identify" ? (
				<>
					{mode === "register" ? (
						<Field
							label="Seu nome"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Como podemos te chamar?"
							autoComplete="name"
							enterKeyHint="next"
						/>
					) : null}

					<div className="flex rounded-[18px] border border-input bg-muted/40 p-1">
						{(["email", "whatsapp"] as const).map((c) => (
							<button
								key={c}
								type="button"
								onClick={() => setChannel(c)}
								className={cn(
									"flex-1 rounded-[14px] py-2.5 text-sm font-medium transition-colors",
									channel === c ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
								)}
							>
								{c === "email" ? "Email" : "WhatsApp"}
							</button>
						))}
					</div>

					{channel === "email" ? (
						<Field
							label="Digite seu email"
							type="email"
							inputMode="email"
							autoComplete="email"
							enterKeyHint="done"
							value={destination}
							onChange={(e) => setDestination(e.target.value)}
							placeholder="seu@email.com"
						/>
					) : (
						<Field label="Digite seu WhatsApp">
							<PhoneInput
								kind="mobile"
								variant="auth"
								value={destination}
								onChange={setDestination}
								enterKeyHint="done"
							/>
						</Field>
					)}

					{error ? <p className="text-sm text-destructive">{error}</p> : null}

					<Button
						type="button"
						className="h-14 w-full rounded-[18px] text-base font-bold"
						disabled={loading || !destination.trim() || (mode === "register" && name.trim().length < 2)}
						onClick={() => void requestOtp()}
					>
						{loading ? <Loader2 className="size-5 animate-spin" /> : "Receber código"}
					</Button>

					<p className="text-center text-sm text-muted-foreground">
						{mode === "login" ? (
							<>
								Não tem uma conta?{" "}
								<Link href="/cadastro" className="font-bold text-foreground hover:underline">
									Cadastre-se
								</Link>
							</>
						) : (
							<>
								Já tem conta?{" "}
								<Link href="/login" className="font-bold text-foreground hover:underline">
									Entrar
								</Link>
							</>
						)}
					</p>

					<div className="relative py-2 text-center text-sm text-muted-foreground">
						<span className="relative z-10 bg-background px-3">ou</span>
						<div className="absolute inset-x-0 top-1/2 -z-0 border-t border-border" />
					</div>

					{googleEnabled ? (
						<Button
							type="button"
							variant="outline"
							className="h-14 w-full rounded-[18px] border-input text-base font-normal"
							onClick={() =>
								void signIn("google", {
									callbackUrl: callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard",
								})
							}
						>
							<span className="relative mr-2 inline-block size-7 overflow-hidden">
								<Image src="/icons/google.svg" alt="" width={28} height={28} className="size-full" />
							</span>
							Continuar com Google
						</Button>
					) : null}
				</>
			) : (
				<>
					<div className="space-y-2 text-center">
						<p className="text-[26px] font-bold tracking-wide text-foreground">Digite o OTP</p>
						<p className="text-sm text-muted-foreground">Um código de 4 dígitos foi enviado para</p>
						<p className="font-bold text-foreground">{masked}</p>
					</div>

					<OtpInput value={code} onChange={setCode} disabled={loading} className="mx-auto max-w-[352px]" />

					{error ? <p className="text-center text-sm text-destructive">{error}</p> : null}

					<Button
						type="button"
						className="h-14 w-full rounded-[18px] text-base font-bold"
						disabled={loading || code.length !== 4}
						onClick={() => void verifyOtp()}
					>
						{loading ? <Loader2 className="size-5 animate-spin" /> : "Verificar"}
					</Button>

					<button
						type="button"
						className="mx-auto block text-sm font-semibold text-muted-foreground disabled:opacity-50"
						disabled={loading || resendIn > 0}
						onClick={() => void requestOtp()}
					>
						{resendIn > 0 ? `Reenviar OTP (${String(resendIn).padStart(2, "0")}s)` : "Reenviar OTP"}
					</button>

					<button
						type="button"
						className="mx-auto block text-sm text-muted-foreground underline"
						onClick={() => {
							setStep("identify");
							setCode("");
							setError(null);
						}}
					>
						Alterar {channel === "email" ? "email" : "telefone"}
					</button>
				</>
			)}
		</div>
	);
}
