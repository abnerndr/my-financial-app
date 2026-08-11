"use client";

import { LogoForm } from "@/components/logos/logo-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useMemo, useState } from "react";

export type LogoLibrary = {
	id: string;
	name: string;
	isSystem: boolean;
	logos: { id: string; name: string; url: string; source: string; isSystem: boolean }[];
}[];

type Props = {
	library: LogoLibrary;
	value: { logoId: string | null; logoUrl: string | null };
	onChange: (next: { logoId: string | null; logoUrl: string | null }) => void;
};

const ALL_CATEGORIES = "all";

export function LogoPicker({ library, value, onChange }: Props) {
	const [open, setOpen] = useState(false);
	const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES);
	const [creating, setCreating] = useState(false);

	const userCategories = useMemo(
		() =>
			library
				.filter((category) => !category.isSystem)
				.map(({ id, name, isSystem }) => ({ id, name, isSystem })),
		[library]
	);

	const filteredCategories = useMemo(() => {
		if (categoryFilter === ALL_CATEGORIES) return library;
		return library.filter((category) => category.id === categoryFilter);
	}, [library, categoryFilter]);

	const hasAnyLogo = filteredCategories.some((category) => category.logos.length > 0);

	function handleSelect(logo: { id: string; url: string }) {
		onChange({ logoId: logo.id, logoUrl: logo.url });
		setOpen(false);
		setCreating(false);
	}

	function handleRemove() {
		onChange({ logoId: null, logoUrl: null });
	}

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen);
		if (!nextOpen) {
			setCreating(false);
			setCategoryFilter(ALL_CATEGORIES);
		}
	}

	return (
		<div className="space-y-2">
			{value.logoUrl && (
				<div className="relative size-12 overflow-hidden rounded-md border bg-muted">
					<Image src={value.logoUrl} alt="Logo selecionado" fill unoptimized className="object-contain" />
				</div>
			)}

			<div className="flex gap-2">
				<Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
					{value.logoUrl ? "Trocar" : "Escolher logo"}
				</Button>
				{value.logoUrl && (
					<Button type="button" variant="ghost" size="sm" onClick={handleRemove}>
						Remover
					</Button>
				)}
			</div>

			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{creating ? "Novo logo" : "Escolher logo"}</DialogTitle>
					</DialogHeader>

					{creating ? (
						<LogoForm categories={userCategories} onCreated={handleSelect} />
					) : (
						<div className="space-y-4">
							<Select value={categoryFilter} onValueChange={setCategoryFilter}>
								<SelectTrigger>
									<SelectValue placeholder="Todas as categorias" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={ALL_CATEGORIES}>Todas as categorias</SelectItem>
									{library.map((category) => (
										<SelectItem key={category.id} value={category.id}>
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<div className="max-h-80 space-y-4 overflow-y-auto">
								{filteredCategories.map((category) => (
									<div key={category.id} className="space-y-2">
										<p className="text-sm font-medium text-muted-foreground">{category.name}</p>
										{category.logos.length === 0 ? (
											<p className="text-sm text-muted-foreground">Nenhum logo nesta categoria.</p>
										) : (
											<div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
												{category.logos.map((logo) => (
													<button
														key={logo.id}
														type="button"
														onClick={() => handleSelect(logo)}
														className="flex flex-col items-center gap-1 rounded-md border p-2 text-center hover:bg-accent"
													>
														<div className="relative size-12 overflow-hidden rounded-md bg-muted">
															<Image src={logo.url} alt={logo.name} fill unoptimized className="object-contain" />
														</div>
														<span className="line-clamp-1 text-xs">{logo.name}</span>
													</button>
												))}
											</div>
										)}
									</div>
								))}
								{!hasAnyLogo && <p className="text-sm text-muted-foreground">Nenhum logo cadastrado ainda.</p>}
							</div>

							<Button type="button" variant="outline" onClick={() => setCreating(true)}>
								Adicionar novo
							</Button>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
