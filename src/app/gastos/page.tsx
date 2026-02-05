import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { getExpenses } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExpenseForm } from "./expense-form";
import { ExpenseTable } from "./expense-table";

export default async function GastosPage() {
	const session = await getSession();
	if (!session) redirect("/login");

	const expenses = await getExpenses();

	return (
		<div className="container max-w-4xl space-y-8 py-8">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/dashboard">
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold">Gastos</h1>
					<p className="text-muted-foreground">Cadastre gastos com título, descrição, valor e periodicidade</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Novo gasto</CardTitle>
				</CardHeader>
				<CardContent>
					<ExpenseForm />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Lista de gastos</CardTitle>
					<p className="text-sm text-muted-foreground">{expenses.length} registro(s)</p>
				</CardHeader>
				<CardContent>
					<ExpenseTable expenses={expenses} />
				</CardContent>
			</Card>
		</div>
	);
}
