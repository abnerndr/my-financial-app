import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import {
	AlertTriangle,
	BarChart3,
	Bell,
	CheckCircle2,
	List,
	LogOut,
	Plus,
	Settings,
	TrendingDown,
	TrendingUp,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const session = await getSession();
	if (!session) redirect("/login");

	const data = await getDashboardData();
	if (!data) {
		return (
			<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
				<p className="text-muted-foreground">Carregando...</p>
			</div>
		);
	}

	const {
		monthlyIncome,
		saved,
		monthlyExpenses,
		balance,
		usedPercent,
		remainingPercent,
		isCritical,
		warningLimitPercent,
	} = data;

	return (
		<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 py-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<p className="text-muted-foreground mt-1">Visão geral da sua situação financeira</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button asChild size="sm" variant="outline">
						<Link href="/gastos">
							<Plus className="mr-1 size-4" /> Gastos
						</Link>
					</Button>
					<Button asChild size="sm" variant="outline">
						<Link href="/renda">
							<Plus className="mr-1 size-4" /> Renda
						</Link>
					</Button>
					<Button asChild size="sm" variant="outline">
						<Link href="/alertas">
							<Bell className="mr-1 size-4" /> Alertas
						</Link>
					</Button>
					<Button asChild size="sm" variant="outline">
						<Link href="/relatorios">
							<BarChart3 className="mr-1 size-4" /> Relatórios
						</Link>
					</Button>
					<Button asChild size="sm" variant="ghost">
						<Link href="/configuracoes">
							<Settings className="mr-1 size-4" /> Configurações
						</Link>
					</Button>
					<Button asChild size="sm" variant="ghost">
						<Link href="/api/auth/signout">
							<LogOut className="mr-1 size-4" /> Sair
						</Link>
					</Button>
				</div>
			</div>

			{/* Status: crítico ou ok */}
			<Card className={isCritical ? "border-red-500/50 bg-red-500/5" : "border-emerald-500/30 bg-emerald-500/5"}>
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2 text-lg">
							{isCritical ? (
								<>
									<AlertTriangle className="size-5 text-red-600" />
									Situação crítica
								</>
							) : (
								<>
									<CheckCircle2 className="size-5 text-emerald-600" />
									Situação estável
								</>
							)}
						</CardTitle>
						<Badge variant={isCritical ? "critical" : "success"}>{remainingPercent.toFixed(0)}% restante</Badge>
					</div>
					<CardDescription>
						Alerta configurado em {warningLimitPercent}% de uso. Quando o valor gasto ultrapassar {warningLimitPercent}%
						do disponível, o status fica crítico.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Progress value={usedPercent} className={isCritical ? "bg-red-200" : ""} />
				</CardContent>
			</Card>

			{/* Cards de resumo */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Renda mensal</CardTitle>
						<TrendingUp className="size-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{formatCurrency(monthlyIncome)}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Guardado</CardTitle>
						<Wallet className="size-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{formatCurrency(saved)}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Gastos (mês)</CardTitle>
						<TrendingDown className="size-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{formatCurrency(monthlyExpenses)}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Saldo restante</CardTitle>
						<Wallet className="size-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<p className={`text-2xl font-bold ${balance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
							{formatCurrency(balance)}
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<Link href="/gastos">
					<Card className="transition-colors hover:bg-muted/50">
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>Gastos</CardTitle>
							<List className="size-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Cadastre e gerencie seus gastos (único, mensal, anual).</p>
						</CardContent>
					</Card>
				</Link>
				<Link href="/renda">
					<Card className="transition-colors hover:bg-muted/50">
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>Renda e benefícios</CardTitle>
							<TrendingUp className="size-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Salário, benefícios e dinheiro guardado.</p>
						</CardContent>
					</Card>
				</Link>
			</div>
		</div>
	);
}
