import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { getLogoLibrary } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogosManager } from "./logos-manager";

export default async function LogosPage() {
	const session = await getSession();
	if (!session) redirect("/");

	const library = await getLogoLibrary();

	return (
		<div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8 py-8">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/dashboard">
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold">Logos</h1>
					<p className="text-muted-foreground">Gerencie categorias e logos usados nos seus gastos.</p>
				</div>
			</div>

			<LogosManager library={library} />
		</div>
	);
}
