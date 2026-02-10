"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export function SignoutConfirm() {
	const [isLoading, setIsLoading] = useState(false);

	const handleSignOut = async () => {
		setIsLoading(true);
		await signOut({ callbackUrl: "/login" });
	};

	return (
		<Card className="w-full max-w-md shadow-lg">
			<CardHeader className="space-y-1 text-center">
				<div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-100">
					<LogOut className="size-6 text-red-600" />
				</div>
				<CardTitle className="text-2xl font-bold">Encerrar sessão</CardTitle>
				<CardDescription>
					Tem certeza que deseja sair da sua conta?
				</CardDescription>
			</CardHeader>
			<CardContent className="text-center text-sm text-muted-foreground">
				Você precisará fazer login novamente para acessar seus dados.
			</CardContent>
			<CardFooter className="flex flex-col gap-2 sm:flex-row">
				<Button 
					variant="outline" 
					className="w-full sm:w-1/2" 
					asChild
					disabled={isLoading}
				>
					<Link href="/dashboard">
						<X className="mr-2 size-4" />
						Cancelar
					</Link>
				</Button>
				<Button 
					variant="destructive" 
					className="w-full sm:w-1/2" 
					onClick={handleSignOut}
					disabled={isLoading}
				>
					<LogOut className="mr-2 size-4" />
					{isLoading ? "Saindo..." : "Sair agora"}
				</Button>
			</CardFooter>
		</Card>
	);
}
