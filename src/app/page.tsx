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
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b border-border bg-card">
				<div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
					<Link href="/" className="flex items-center gap-2 font-semibold">
						<Wallet className="size-6 text-primary" />
						<span>Controle Financeiro</span>
					</Link>
					<Button asChild variant="ghost" size="sm">
						<Link href={loginHref}>Entrar</Link>
					</Button>
				</div>
			</header>

			{/* Hero */}
			<main className="container mx-auto max-w-5xl px-4 py-12 sm:py-16">
				<div className="mx-auto max-w-2xl space-y-8 text-center">
					<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Controle seus gastos e seu financeiro. Mude de vida já.
					</h1>
					<p className="text-lg text-muted-foreground">
						Gerencie tudo pelo sistema ou pelo nosso agente de IA, o <strong>Chedar</strong> — no app ou pelo
						WhatsApp.
					</p>
					<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
						<Button asChild size="lg" className="gap-2">
							<Link href="/cadastro">
								<Zap className="size-4" /> Testar agora
							</Link>
						</Button>
						<Button asChild size="lg" variant="outline" className="gap-2">
							<a href="https://wa.me/5516997720763" target="_blank" rel="noopener noreferrer">
								<MessageCircle className="size-4" /> Falar com o Chedar
							</a>
						</Button>
					</div>
				</div>

				{/* Cards explicativos */}
				<div className="mt-16 grid gap-4 sm:grid-cols-2">
					<Card className="border-border">
						<CardContent className="pt-6">
							<div className="flex items-center gap-3">
								<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
									<Wallet className="size-5 text-primary" />
								</div>
								<div>
									<h2 className="font-semibold">Pelo sistema</h2>
									<p className="text-sm text-muted-foreground">
										Cadastre gastos, renda e alertas. Acompanhe relatórios e tenha tudo sob controle.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="border-border">
						<CardContent className="pt-6">
							<div className="flex items-center gap-3">
								<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
									<MessageCircle className="size-5 text-primary" />
								</div>
								<div>
									<h2 className="font-semibold">Pelo Chedar (IA)</h2>
									<p className="text-sm text-muted-foreground">
										Converse pelo WhatsApp: cadastre despesas e consulte seu financeiro com o agente de IA.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
