import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignoutConfirm } from "./signout-confirm";

export const metadata = {
	title: "Sair | Controle Financeiro",
	description: "Encerrar sessão no Controle Financeiro",
};

export default async function SignoutPage() {
	const session = await getSession();

	if (!session) {
		redirect("/login");
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
			<SignoutConfirm />
		</div>
	);
}
