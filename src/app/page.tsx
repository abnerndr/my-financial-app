import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { MessageCircle, Wallet, Zap } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage({
	searchParams,
}: {
	searchParams: Promise<{ callbackUrl?: string }>;
}) {
	const session = await getSession();
	if (session) redirect("/dashboard");

	const params = await searchParams;
	const loginHref = params.callbackUrl ? `/login?callbackUrl=${encodeURIComponent(params.callbackUrl)}` : "/login";

	return (
		<div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
			{/* Background Gradients */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute -top-[20%] left-[20%] size-[600px] rounded-full bg-emerald-500/5 blur-[120px] filter" />
				<div className="absolute bottom-[10%] right-[10%] size-[500px] rounded-full bg-teal-500/5 blur-[100px] filter" />
			</div>

			{/* Header */}
			<header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl transition-all">
				<div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
					<Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
						<div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 ring-1 ring-emerald-200">
							<Wallet className="size-4 text-emerald-600" />
						</div>
						<span className="text-xl">Controle Financeiro</span>
					</Link>
					<Button asChild variant="ghost" size="sm" className="hover:bg-slate-100">
						<Link href={loginHref}>Entrar</Link>
					</Button>
				</div>
			</header>

			{/* Hero */}
			<main className="container mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-24 sm:px-6">
				<div className="mx-auto max-w-3xl space-y-8 text-center">
					<div className="animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.1s' }}>
						<span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
							O futuro das suas finanças
						</span>
					</div>
					
					<h1 className="animate-fade-in-up text-4xl font-extrabold tracking-tight text-slate-900 opacity-0 sm:text-6xl md:text-7xl" style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}>
						Controle seus gastos. <br />
						<span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
							Mude sua vida.
						</span>
					</h1>
					
					<p className="animate-fade-in-up mx-auto max-w-2xl text-lg text-slate-600 opacity-0 sm:text-xl" style={{ animationFillMode: 'forwards', animationDelay: '0.3s' }}>
						Gerencie tudo pelo sistema ou pelo nosso agente de IA, o <strong className="font-semibold text-emerald-600">Chedar</strong>. 
						Inteligência artificial para organizar sua vida financeira no app ou WhatsApp.
					</p>

					<div className="animate-fade-in-up flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row sm:gap-6" style={{ animationFillMode: 'forwards', animationDelay: '0.4s' }}>
						<Button asChild size="lg" className="h-12 min-w-[160px] rounded-xl bg-emerald-600 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-500/30">
							<Link href="/cadastro">
								<Zap className="mr-2 size-4" /> Começar Agora
							</Link>
						</Button>
						<Button asChild size="lg" variant="outline" className="h-12 min-w-[160px] rounded-xl border-slate-200 bg-white text-base text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-50 hover:text-slate-900">
							<a href="https://wa.me/5516997720763" target="_blank" rel="noopener noreferrer">
								<MessageCircle className="mr-2 size-4" /> Falar com Chedar
							</a>
						</Button>
					</div>
				</div>

				{/* Cards explicativos */}
				<div className="mt-24 grid gap-6 sm:grid-cols-2 lg:gap-8">
					<Card className="group relative overflow-hidden border-slate-200 bg-white shadow-sm transition-all hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5">
						<div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
						<CardContent className="flex h-full flex-col justify-between p-8">
							<div className="space-y-4">
								<div className="inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-50 shadow-sm ring-1 ring-emerald-100">
									<Wallet className="size-7 text-emerald-600" />
								</div>
								<h2 className="text-2xl font-bold text-slate-900">Sistema Completo</h2>
								<p className="text-slate-600">
									Dashboard intuitivo para cadastrar gastos, renda e definir alertas. 
									Relatórios detalhados para você ter controle total.
								</p>
							</div>
						</CardContent>
					</Card>

					<Card className="group relative overflow-hidden border-slate-200 bg-white shadow-sm transition-all hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5">
						<div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
						<CardContent className="flex h-full flex-col justify-between p-8">
							<div className="space-y-4">
								<div className="inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-50 shadow-sm ring-1 ring-emerald-100">
									<MessageCircle className="size-7 text-emerald-600" />
								</div>
								<h2 className="text-2xl font-bold text-slate-900">Chedar AI</h2>
								<p className="text-slate-600">
									Seu assistente financeiro no WhatsApp. Envie áudios ou textos 
									para cadastrar despesas instantaneamente.
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
