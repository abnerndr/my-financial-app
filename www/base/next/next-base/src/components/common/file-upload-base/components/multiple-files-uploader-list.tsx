'use client';

import { AlertCircleIcon, FileUpIcon, XIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { formatBytes, useFileUpload } from '@/hooks/use-file-upload';
import { FileUploadUtils } from '@/lib/utils/file-upload';
import type { InitialFileType } from './multiple-image-uploader-grid';

export interface MultipleFilesUploaderListProps {
	maxFiles?: number;
	initialFiles?: InitialFileType[]; // Initial files to display
	onGetFiles?: (files: File[]) => void;
}

export function MultipleFilesUploaderList({
	maxFiles = 10,
	initialFiles,
	onGetFiles,
}: MultipleFilesUploaderListProps) {
	const maxSize = 100 * 1024 * 1024; // 10MB default

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
		multiple: true,
		maxFiles,
		maxSize,
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
				onClick={openFileDialog}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				data-dragging={isDragging || undefined}
				className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-input p-4 transition-colors hover:bg-accent/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
			>
				<input {...getInputProps()} className="sr-only" aria-label="Upload files" />

				<div className="flex flex-col items-center justify-center text-center">
					<div
						className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
						aria-hidden="true"
					>
						<FileUpIcon className="size-4 opacity-60" />
					</div>
					<p className="mb-1.5 text-sm font-medium">Enviar arquivos</p>
					<p className="mb-2 text-xs text-muted-foreground">
						Arraste & solte ou clique para navegar
					</p>
					<div className="flex flex-wrap justify-center gap-1 text-xs text-muted-foreground/70">
						<span>Todos os arquivos</span>
						<span>∙</span>
						<span>Máx {maxFiles} arquivos</span>
						<span>∙</span>
						<span>Até {formatBytes(maxSize)}</span>
					</div>
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
								<div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
									{FileUploadUtils.getFileIcon(file)}
								</div>
								<div className="flex min-w-0 flex-col gap-0.5">
									<p className="truncate text-[13px] font-medium">
										{file.file instanceof File ? file.file.name : file.file.name}
									</p>
									<p className="text-xs text-muted-foreground">
										{formatBytes(
											file.file instanceof File ? file.file.size : file.file.size,
										)}
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
								<XIcon className="size-4" aria-hidden="true" />
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
