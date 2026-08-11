"use client";

import { deleteLogo, deleteLogoCategory } from "@/app/actions/logos";
import { LogoForm } from "@/components/logos/logo-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Logo = {
	id: string;
	name: string;
	url: string;
	source: string;
	isSystem: boolean;
};

type Category = {
	id: string;
	name: string;
	isSystem: boolean;
	logos: Logo[];
};

type Props = {
	library: Category[];
};

export function LogosManager({ library }: Props) {
	const router = useRouter();

	const [deletingLogoId, setDeletingLogoId] = useState<string | null>(null);
	const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
	const [categoryError, setCategoryError] = useState<{ id: string; message: string } | null>(null);

	const formCategories = useMemo(
		() => library.map(({ id, name, isSystem }) => ({ id, name, isSystem })),
		[library]
	);

	async function handleDeleteLogo(id: string) {
		setDeletingLogoId(id);
		const result = await deleteLogo(id);
		setDeletingLogoId(null);

		if (result.error) {
			window.alert(result.error);
			return;
		}

		router.refresh();
	}

	async function handleDeleteCategory(id: string) {
		setDeletingCategoryId(id);
		setCategoryError(null);
		const result = await deleteLogoCategory(id);
		setDeletingCategoryId(null);

		if (result.error) {
			setCategoryError({ id, message: result.error });
			return;
		}

		router.refresh();
	}

	return (
		<div className="space-y-8">
			<Card>
				<CardHeader>
					<CardTitle>Novo logo</CardTitle>
				</CardHeader>
				<CardContent>
					<LogoForm categories={formCategories} onCreated={() => router.refresh()} />
				</CardContent>
			</Card>

			{library.length === 0 ? (
				<p className="py-8 text-center text-muted-foreground">
					Nenhuma categoria cadastrada ainda. Crie uma acima para começar.
				</p>
			) : (
				<div className="space-y-4">
					{library.map((category) => (
						<Card key={category.id}>
							<CardHeader className="flex flex-row items-center justify-between gap-2">
								<div className="flex items-center gap-2">
									<CardTitle className="text-base">{category.name}</CardTitle>
									{category.isSystem && <Badge variant="secondary">Sistema</Badge>}
								</div>
								{!category.isSystem && (
									<Button
										variant="ghost"
										size="sm"
										className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
										onClick={() => handleDeleteCategory(category.id)}
										disabled={deletingCategoryId === category.id}
										aria-label="Excluir categoria"
									>
										<Trash2 className="size-3.5 shrink-0" />
										<span className="hidden sm:inline">Excluir categoria</span>
									</Button>
								)}
							</CardHeader>
							<CardContent className="space-y-3">
								{categoryError?.id === category.id && (
									<p className="text-sm text-destructive">{categoryError.message}</p>
								)}

								{category.logos.length === 0 ? (
									<p className="text-sm text-muted-foreground">Nenhum logo nesta categoria.</p>
								) : (
									<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
										{category.logos.map((logo) => (
											<div
												key={logo.id}
												className="flex flex-col items-center gap-2 rounded-md border p-3 text-center"
											>
												<div className="relative size-12 overflow-hidden rounded-md bg-muted">
													<Image src={logo.url} alt={logo.name} fill unoptimized className="object-contain" />
												</div>
												<span className="line-clamp-1 text-xs">{logo.name}</span>
												{logo.isSystem ? (
													<Badge variant="secondary">Sistema</Badge>
												) : (
													<Button
														variant="ghost"
														size="sm"
														className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
														onClick={() => handleDeleteLogo(logo.id)}
														disabled={deletingLogoId === logo.id}
														aria-label="Excluir logo"
													>
														<Trash2 className="size-3 shrink-0" />
														Excluir
													</Button>
												)}
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
