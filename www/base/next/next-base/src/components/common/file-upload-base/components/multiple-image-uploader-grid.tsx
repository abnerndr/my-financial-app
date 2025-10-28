'use client';

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/use-file-upload';
import { FileUploadUtils } from '@/lib/utils/file-upload';

export type InitialFileType = {
	name: string;
	size: number;
	type: string;
	url: string;
	id: string;
};

export interface MultipleImageUploaderGridProps {
	maxSizeMB?: number; // Maximum file size in megabytes
	maxFiles?: number; // Maximum number of files
	onGetFiles?: (files: File[]) => void;
	initialFiles?: InitialFileType[]; // Initial files to display
}

export function MultipleImageUploaderGrid({
	maxSizeMB = 5,
	maxFiles = 6,
	onGetFiles,
	initialFiles,
}: MultipleImageUploaderGridProps) {
	const maxSize = maxSizeMB * 1024 * 1024; // 5MB default

	const [
		{ files, isDragging, errors },
		{
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			removeFile,
			getInputProps,
		},
	] = useFileUpload({
		accept: 'image/svg+xml,image/png,image/jpeg,image/jpg,image/gif',
		maxSize,
		multiple: true,
		maxFiles,
		initialFiles,
	});

	useEffect(() => {
		const currentFiles = files
			.map((f) => f.file)
			.filter((f): f is File => f instanceof File);
		FileUploadUtils.allFilesPromise(currentFiles, initialFiles).then((allFiles) => {
			onGetFiles?.(allFiles);
		});
	}, [files, onGetFiles, initialFiles]);

	return (
		<div className="flex flex-col gap-2 w-full">
			{/* Drop area */}
			<button
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				data-dragging={isDragging || undefined}
				data-files={files.length > 0 || undefined}
				className="relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
			>
				<input {...getInputProps()} className="sr-only" aria-label="Upload image file" />
				{files.length > 0 ? (
					<div className="flex w-full flex-col gap-3">
						<div className="flex items-center justify-between gap-2">
							<h3 className="truncate text-sm font-medium">
								Enviar arquivos ({files.length})
							</h3>
							<Button
								variant="outline"
								size="sm"
								onClick={openFileDialog}
								disabled={files.length >= maxFiles}
							>
								<UploadIcon className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
								Adicionar mais
							</Button>
						</div>

						<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
							{files.map((file) => (
								<div
									key={file.id}
									className="relative aspect-square rounded-md bg-accent"
								>
									<Image
										src={file.preview ?? ''}
										alt={file.file.name}
										className="size-full rounded-[inherit] object-cover"
										width={40}
										height={40}
									/>
									<Button
										onClick={() => removeFile(file.id)}
										size="icon"
										className="absolute -top-2 -right-2 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
										aria-label="Remove image"
									>
										<XIcon className="size-3.5" />
									</Button>
								</div>
							))}
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center px-4 py-3 text-center">
						<div
							className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
							aria-hidden="true"
						>
							<ImageIcon className="size-4 opacity-60" />
						</div>
						<p className="mb-1.5 text-sm font-medium">Solte suas imagens aqui</p>
						<p className="text-xs text-muted-foreground">
							SVG, PNG, JPG ou GIF (máx. {maxSizeMB}MB)
						</p>
						<Button variant="outline" className="mt-4" onClick={openFileDialog}>
							<UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
							Selecionar imagens
						</Button>
					</div>
				)}
			</button>

			{errors.length > 0 && (
				<div className="flex items-center gap-1 text-xs text-destructive" role="alert">
					<AlertCircleIcon className="size-3 shrink-0" />
					<span>{errors[0]}</span>
				</div>
			)}
		</div>
	);
}
