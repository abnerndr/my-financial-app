'use client';

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { formatBytes, useFileUpload } from '@/hooks/use-file-upload';
import { FileUploadUtils } from '@/lib/utils/file-upload';
import type { InitialFileType } from './multiple-image-uploader-grid';

export interface MultipleImageUploaderListProps {
	maxSizeMB?: number; // Maximum file size in megabytes
	maxFiles?: number; // Maximum number of files
	onGetFiles?: (files: File[]) => void;
	initialFiles?: InitialFileType[]; // Initial files to display
}

export function MultipleImageUploaderList({
	maxFiles = 6,
	maxSizeMB = 5,
	initialFiles,
	onGetFiles,
}: MultipleImageUploaderListProps) {
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
			clearFiles,
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
			</button>

			{errors.length > 0 && (
				<div className="flex items-center gap-1 text-xs text-destructive" role="alert">
					<AlertCircleIcon className="size-3 shrink-0" />
					<span>{errors[0]}</span>
				</div>
			)}

			{/* File list */}
			{files.length > 0 && (
				<div className="space-y-2">
					{files.map((file) => (
						<div
							key={file.id}
							className="flex items-center justify-between gap-2 rounded-lg border bg-background p-2 pe-3"
						>
							<div className="flex items-center gap-3 overflow-hidden">
								<div className="aspect-square shrink-0 rounded bg-accent">
									<Image
										src={file.preview ?? ''}
										alt={file.file.name}
										className="size-10 rounded-[inherit] object-cover"
										width={40}
										height={40}
									/>
								</div>
								<div className="flex min-w-0 flex-col gap-0.5">
									<p className="truncate text-[13px] font-medium">{file.file.name}</p>
									<p className="text-xs text-muted-foreground">
										{formatBytes(file.file.size)}
									</p>
								</div>
							</div>

							<Button
								size="icon"
								variant="ghost"
								className="-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
								onClick={() => removeFile(file.id)}
								aria-label="Remove file"
							>
								<XIcon aria-hidden="true" />
							</Button>
						</div>
					))}

					{/* Remove all files button */}
					{files.length > 1 && (
						<div>
							<Button size="sm" variant="outline" onClick={clearFiles}>
								Remover todos
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
