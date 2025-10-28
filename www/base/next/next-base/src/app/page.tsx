// "use client";

// import { useAuth } from "@/components/auth/protected-route";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import Link from "next/link";

// export default function Home() {
// 	const { user, isAuthenticated, logout } = useAuth();

// 	if (isAuthenticated && user) {
// 		return (
// 			<div className="min-h-screen flex items-center justify-center bg-background px-4">
// 				<Card className="w-full max-w-md">
// 					<CardHeader>
// 						<CardTitle>Bem-vindo, {user.name}!</CardTitle>
// 						<CardDescription>Você está logado como {user.email}</CardDescription>
// 					</CardHeader>
// 					<CardContent className="space-y-4">
// 						<div className="space-y-2">
// 							<p className="text-sm text-muted-foreground">Roles:</p>
// 							<div className="flex flex-wrap gap-2">
// 								{user.roles.map((role) => (
// 									<span key={role.id} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
// 										{role.name}
// 									</span>
// 								))}
// 							</div>
// 						</div>

// 						<div className="space-y-2">
// 							<Button asChild className="w-full">
// 								<Link href="/dashboard">Ir para Dashboard</Link>
// 							</Button>

// 							<Button variant="outline" onClick={logout} className="w-full">
// 								Sair
// 							</Button>
// 						</div>
// 					</CardContent>
// 				</Card>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className="min-h-screen flex items-center justify-center bg-background px-4">
// 			<div className="w-full max-w-md space-y-6">
// 				<div className="text-center">
// 					<h1 className="text-4xl font-bold mb-2">Next.js Auth Base</h1>
// 					<p className="text-muted-foreground">Sistema completo de autenticação com Next.js e TypeScript</p>
// 				</div>

// 				<Card>
// 					<CardHeader>
// 						<CardTitle>Comece agora</CardTitle>
// 						<CardDescription>Faça login ou crie uma conta para acessar o sistema</CardDescription>
// 					</CardHeader>
// 					<CardContent className="space-y-3">
// 						<Button asChild className="w-full">
// 							<Link href="/auth/login">Fazer Login</Link>
// 						</Button>

// 						<Button asChild variant="outline" className="w-full">
// 							<Link href="/auth/register">Criar Conta</Link>
// 						</Button>

// 						<Button asChild variant="ghost" className="w-full">
// 							<Link href="/auth/magic-link">Login Mágico</Link>
// 						</Button>
// 					</CardContent>
// 				</Card>

// 				<div className="text-center text-sm text-muted-foreground">
// 					<p>Sistema de autenticação completo com:</p>
// 					<ul className="mt-2 space-y-1">
// 						<li>• Login com email/senha</li>
// 						<li>• Login com Google</li>
// 						<li>• Magic Link (sem senha)</li>
// 						<li>• Recuperação de senha</li>
// 						<li>• Sistema de roles e permissões</li>
// 					</ul>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

export default function Home() {
	return <div className="w-full max-w-md mx-auto my-10">asdasddsad</div>;
}
