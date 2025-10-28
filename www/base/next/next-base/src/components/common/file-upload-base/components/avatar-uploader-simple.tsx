'use client';

import { CircleUserRoundIcon } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/use-file-upload';

export interface AvatarUploadSimpleProps {
	onGetFile?: (file: File | null) => void;
}

export function AvatarUploadSimple({ onGetFile }: AvatarUploadSimpleProps) {
	const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
		accept: 'image/*',
	});

	useEffect(() => {
		const file = files[0]?.file;
		if (file instanceof File) {
			onGetFile?.(file);
		} else {
			onGetFile?.(null);
		}
	}, [files, onGetFile]);

	const previewUrl = files[0]?.preview || null;
	const fileName = files[0]?.file.name || null;

	return (
		<div className="flex flex-col items-center gap-2">
			<div className="inline-flex items-center gap-2 align-top">
				<div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input">
					{previewUrl ? (
						<Image
							className="size-full object-cover"
							src={previewUrl}
							alt="Preview of uploaded image"
							width={32}
							height={32}
							aria-label="Preview of uploaded image"
						/>
					) : (
						<span>
							<CircleUserRoundIcon
								className="opacity-60"
								size={16}
								aria-label="Default user avatar"
							/>
						</span>
					)}
				</div>
				<div className="relative inline-block">
					<Button onClick={openFileDialog} aria-haspopup="dialog">
						{fileName ? 'Alterar Imagem' : 'Enviar Imagem'}
					</Button>
					<input
						{...getInputProps()}
						className="sr-only"
						aria-label="Upload image file"
						tabIndex={-1}
					/>
				</div>
			</div>
			{fileName && (
				<div className="inline-flex gap-2 text-xs">
					<p className="truncate text-muted-foreground" aria-live="polite">
						{fileName}
					</p>{' '}
					<button
						onClick={() => removeFile(files[0]?.id)}
						className="font-medium text-destructive hover:underline"
						aria-label={`Remove ${fileName}`}
					>
						Remover
					</button>
				</div>
			)}
		</div>
	);
}
