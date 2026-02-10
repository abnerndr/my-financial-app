import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { getIncomes } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IncomeForm } from "./income-form";
import { IncomeTable } from "./income-table";

export default async function RendaPage() {
	const session = await getSession();
	if (!session) redirect("/");

	const incomes = await getIncomes();

	return (
		<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 py-8">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/dashboard">
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold">Renda e benefícios</h1>
					<p className="text-muted-foreground">Salário, benefícios e dinheiro guardado</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Nova entrada</CardTitle>
				</CardHeader>
				<CardContent>
					<IncomeForm />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Lista de rendas</CardTitle>
					<p className="text-sm text-muted-foreground">{incomes.length} registro(s)</p>
				</CardHeader>
				<CardContent>
					<IncomeTable incomes={incomes} />
				</CardContent>
			</Card>
		</div>
	);
}
