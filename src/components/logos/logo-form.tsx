"use client";

import { createLogo, createLogoCategory } from "@/app/actions/logos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";

type Category = { id: string; name: string; isSystem: boolean };

type CreatedLogo = { id: string; name: string; url: string };

type Props = {
	categories: Category[];
	onCreated?: (logo: CreatedLogo) => void;
	defaultCategoryId?: string;
};

type Mode = "URL" | "UPLOAD";

const ACCEPTED_MIME = "image/png,image/jpeg,image/webp,image/svg+xml";

export function LogoForm({ categories, onCreated, defaultCategoryId }: Props) {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [localCategories, setLocalCategories] = useState<Category[]>(categories);
	const userCategories = useMemo(() => localCategories.filter((c) => !c.isSystem), [localCategories]);

	const [categoryId, setCategoryId] = useState<string>(defaultCategoryId ?? userCategories[0]?.id ?? "");
	const [newCategoryName, setNewCategoryName] = useState("");
	const [creatingCategory, setCreatingCategory] = useState(false);
	const [categoryError, setCategoryError] = useState<string | null>(null);

	const [name, setName] = useState("");
	const [mode, setMode] = useState<Mode>("URL");
	const [url, setUrl] = useState("");
	const [uploaded, setUploaded] = useState<{ url: string; r2Key: string } | null>(null);
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const previewUrl = mode === "UPLOAD" ? uploaded?.url ?? null : url.trim() || null;

	function resetForm() {
		setName("");
		setUrl("");
		setUploaded(null);
		setUploadError(null);
		setSubmitError(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	async function handleCreateCategory() {
		const trimmed = newCategoryName.trim();
		if (!trimmed) return;

		setCreatingCategory(true);
		setCategoryError(null);
		const result = await createLogoCategory(trimmed);
		setCreatingCategory(false);

		if (result.error || !result.category) {
			setCategoryError(result.error ?? "Erro ao criar categoria");
			return;
		}

		const created: Category = { id: result.category.id, name: result.category.name, isSystem: false };
		setLocalCategories((prev) => [...prev, created]);
		setCategoryId(created.id);
		setNewCategoryName("");
		router.refresh();
	}

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploadError(null);
		setUploading(true);
		setUploaded(null);

		try {
			const fd = new FormData();
			fd.set("file", file);
			const res = await fetch("/api/logos/upload", { method: "POST", body: fd });
			const data = await res.json();

			if (!res.ok || data.error) {
				setUploadError(data.error ?? "Erro ao enviar arquivo");
				return;
			}

			setUploaded({ url: data.url, r2Key: data.r2Key });
		} catch {
			setUploadError("Erro ao enviar arquivo");
		} finally {
			setUploading(false);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitError(null);

		if (!categoryId) {
			setSubmitError("Selecione ou crie uma categoria");
			return;
		}
		if (!name.trim()) {
			setSubmitError("Nome é obrigatório");
			return;
		}

		const finalUrl = mode === "UPLOAD" ? uploaded?.url : url.trim();
		if (!finalUrl) {
			setSubmitError(mode === "UPLOAD" ? "Envie um arquivo" : "Informe a URL do logo");
			return;
		}

		setSubmitting(true);
		const result = await createLogo({
			name: name.trim(),
			categoryId,
			source: mode,
			url: finalUrl,
			r2Key: mode === "UPLOAD" ? uploaded?.r2Key : undefined,
		});
		setSubmitting(false);

		if (result.error || !result.logo) {
			setSubmitError(result.error ?? "Erro ao criar logo");
			return;
		}

		onCreated?.({ id: result.logo.id, name: result.logo.name, url: result.logo.url });
		resetForm();
		router.refresh();
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label>Categoria</Label>
				{userCategories.length > 0 ? (
					<Select value={categoryId} onValueChange={setCategoryId}>
						<SelectTrigger>
							<SelectValue placeholder="Selecione a categoria" />
						</SelectTrigger>
						<SelectContent>
							{userCategories.map((category) => (
								<SelectItem key={category.id} value={category.id}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				) : (
					<p className="text-sm text-muted-foreground">
						Você ainda não tem categorias. Crie uma abaixo para continuar.
					</p>
				)}
				<div className="flex gap-2">
					<Input
						value={newCategoryName}
						onChange={(e) => setNewCategoryName(e.target.value)}
						placeholder="Nova categoria"
					/>
					<Button
						type="button"
						variant="outline"
						onClick={handleCreateCategory}
						disabled={creatingCategory || !newCategoryName.trim()}
					>
						{creatingCategory ? "Criando..." : "Criar categoria"}
					</Button>
				</div>
				{categoryError && <p className="text-sm text-destructive">{categoryError}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="logo-name">Nome</Label>
				<Input id="logo-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Netflix" />
			</div>

			<div className="space-y-2">
				<Label>Origem da imagem</Label>
				<div className="flex gap-2">
					<Button
						type="button"
						size="sm"
						variant={mode === "URL" ? "default" : "outline"}
						onClick={() => setMode("URL")}
					>
						URL
					</Button>
					<Button
						type="button"
						size="sm"
						variant={mode === "UPLOAD" ? "default" : "outline"}
						onClick={() => setMode("UPLOAD")}
					>
						Upload
					</Button>
				</div>

				{mode === "URL" ? (
					<Input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
				) : (
					<div className="space-y-2">
						<input
							ref={fileInputRef}
							type="file"
							accept={ACCEPTED_MIME}
							onChange={handleFileChange}
							disabled={uploading}
							className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary-foreground"
						/>
						{uploading && <p className="text-sm text-muted-foreground">Enviando...</p>}
						{uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
					</div>
				)}

				{previewUrl && (
					<div className="flex items-center gap-2 pt-1">
						<div className="relative size-12 overflow-hidden rounded-md border bg-muted">
							<Image src={previewUrl} alt="Pré-visualização" fill unoptimized className="object-contain" />
						</div>
						<span className="text-sm text-muted-foreground">Pré-visualização</span>
					</div>
				)}
			</div>

			{submitError && <p className="text-sm text-destructive">{submitError}</p>}

			<Button type="submit" disabled={submitting || uploading}>
				{submitting ? "Salvando..." : "Adicionar logo"}
			</Button>
		</form>
	);
}
