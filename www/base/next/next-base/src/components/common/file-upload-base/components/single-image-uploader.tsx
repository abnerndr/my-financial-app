'use client';

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/use-file-upload';

export interface SingleImageUploaderProps {
	maxSizeMB?: number; // Maximum file size in megabytes
	onGetFile?: (file: File | null) => void;
}

export function SingleImageUploader({
	maxSizeMB = 2,
	onGetFile,
}: SingleImageUploaderProps) {
	const maxSize = maxSizeMB * 1024 * 1024;
	const [currentFile, setCurrentFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
		multiple: false,
	});

	// Use the preview URL from the hook since it's working
	useEffect(() => {
		if (files.length > 0) {
			const fileWithPreview = files[0];
			// Since the file object is empty, try to get it from the input
			const inputElement = document.querySelector(
				'input[type="file"]',
			) as HTMLInputElement;
			const actualFile = inputElement?.files?.[0];

			if (actualFile) {
				setCurrentFile(actualFile);
			}

			// Use the preview URL from the hook
			if (fileWithPreview.preview) {
				setPreviewUrl(fileWithPreview.preview);
			}
		} else {
			setCurrentFile(null);
			setPreviewUrl(null);
		}
	}, [files]);

	useEffect(() => {
		onGetFile?.(currentFile);
	}, [currentFile, onGetFile]);

	const fileName = currentFile?.name;

	return (
		<div className="flex flex-col gap-2 w-full">
			<div className="relative ">
				{/* Drop area */}
				<button
					type="button"
					tabIndex={0}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					onClick={openFileDialog}
					data-dragging={isDragging || undefined}
					className="relative flex min-h-52 w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
					aria-label="Image drop area"
				>
					<input
						{...getInputProps()}
						className="sr-only"
						aria-label="Upload image file"
					/>
					{previewUrl ? (
						<div className="absolute inset-0 flex items-center justify-center p-4">
							<Image
								src={previewUrl}
								alt={fileName || 'Uploaded image'}
								className="mx-auto max-h-full w-auto rounded object-contain"
								onLoad={() => console.log('Image loaded successfully')}
								onError={(e) => {
									console.error('Image failed to load:', e);
									console.error('Preview URL:', previewUrl);
								}}
								style={{ maxWidth: '100%', maxHeight: '100%' }}
								width={256}
								height={256}
							/>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center px-4 py-3 text-center">
							<div
								className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
								aria-hidden="true"
							>
								<ImageIcon className="size-4 opacity-60" />
							</div>
							<p className="mb-1.5 text-sm font-medium">Solte sua imagem aqui</p>
							<p className="text-xs text-muted-foreground">
								SVG, PNG, JPG ou GIF (máx. {maxSizeMB}MB)
							</p>
							<Button variant="outline" className="mt-4" onClick={openFileDialog}>
								<UploadIcon className="-ms-1 size-4 opacity-60" aria-hidden="true" />
								Selecionar imagem
							</Button>
						</div>
					)}
				</button>

				{previewUrl && (
					<div className="absolute top-4 right-4">
						<button
							type="button"
							className="z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
							onClick={(e) => {
								e.stopPropagation();
								// Clear our state
								setCurrentFile(null);
								if (previewUrl) {
									URL.revokeObjectURL(previewUrl);
								}
								setPreviewUrl(null);
								// Also clear the hook's state
								if (files[0]?.id) {
									removeFile(files[0].id);
								}
							}}
							aria-label="Remove image"
						>
							<XIcon className="size-4" aria-hidden="true" />
						</button>
					</div>
				)}
			</div>

			{errors.length > 0 && (
				<div className="flex items-center gap-1 text-xs text-destructive" role="alert">
					<AlertCircleIcon className="size-3 shrink-0" />
					<span>{errors[0]}</span>
				</div>
			)}
		</div>
	);
}
