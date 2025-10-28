'use client';

import { ArrowLeftIcon, CircleUserRoundIcon, ImageIcon, XIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from '@/components/ui/cropper';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { useFileUpload } from '@/hooks/use-file-upload';
import { cn } from '@/lib/utils';
import { useCroppedImage } from './hooks/use-cropped-image';
import type { Area } from './types/area';
import type { CropperSize, CropperVariant } from './types/cropped';

// Define type for pixel crop area

// Helper function to create a cropped image blob

export interface BaseCropperProps {
	// Core props
	variant?: CropperVariant;
	size?: CropperSize;

	// Content
	placeholder?: ReactNode;
	ariaLabel?: string;

	// Cropper behavior
	aspectRatio?: number;
	cropShape?: 'rect' | 'round';
	quality?: number;
	minZoom?: number;
	maxZoom?: number;
	initialZoom?: number;

	// File upload
	accept?: string;
	maxFileSize?: number;

	// Styling
	className?: string;
	cropperClassName?: string;
	dialogClassName?: string;

	// Callbacks
	onCrop?: (blob: Blob | null, url: string | null) => void;
	onFileSelect?: (file: File) => void;
	onError?: (error: string) => void;

	// Dialog props
	dialogTitle?: string;
	dialogDescription?: string;
	applyButtonText?: string;
	cancelButtonText?: string;

	// Preview
	previewImage?: string | null;
	showPreview?: boolean;

	// States
	disabled?: boolean;
	loading?: boolean;
}

const sizeClasses = {
	sm: 'size-12',
	md: 'size-16',
	lg: 'size-24',
	xl: 'size-32',
};

const cropperHeightClasses = {
	sm: 'h-64',
	md: 'h-80',
	lg: 'h-96',
	xl: 'h-120',
};

export function BaseCropper({
	variant = 'avatar',
	size = 'md',
	placeholder,
	ariaLabel,
	cropShape = 'rect',
	quality = 0.92,
	minZoom = 1,
	maxZoom = 3,
	initialZoom = 1,
	accept = 'image/*',
	className,
	cropperClassName,
	dialogClassName,
	onCrop,
	onFileSelect,
	onError,
	dialogTitle = 'Crop image',
	dialogDescription = 'Adjust the crop area and zoom to get the perfect image',
	applyButtonText = 'Apply',
	cancelButtonText = 'Cancel',
	previewImage,
	disabled = false,
	loading = false,
}: BaseCropperProps) {
	const [
		{ files, isDragging },
		{ handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, removeFile, getInputProps },
	] = useFileUpload({
		accept,
	});
	const { getCroppedImg } = useCroppedImage();
	const previewUrl = files[0]?.preview || previewImage || null;
	const fileId = files[0]?.id;

	const [finalImageUrl, setFinalImageUrl] = useState<string | null>(previewImage || null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [zoom, setZoom] = useState(initialZoom);

	const previousFileIdRef = useRef<string | undefined | null>(null);

	// Get crop shape based on variant
	const currentCropShape = variant === 'avatar' ? 'round' : cropShape;

	const handleCropChange = useCallback((pixels: Area | null) => {
		setCroppedAreaPixels(pixels);
	}, []);

	const handleApply = async () => {
		if (!previewUrl || !croppedAreaPixels) {
			onError?.('Missing data for crop operation');
			if (fileId) {
				removeFile(fileId);
				setCroppedAreaPixels(null);
			}
			return;
		}

		try {
			const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels, undefined, undefined, quality);

			if (!croppedBlob) {
				throw new Error('Failed to generate cropped image blob');
			}

			const newFinalUrl = URL.createObjectURL(croppedBlob);

			if (finalImageUrl?.startsWith('blob:')) {
				URL.revokeObjectURL(finalImageUrl);
			}

			setFinalImageUrl(newFinalUrl);
			setIsDialogOpen(false);

			onCrop?.(croppedBlob, newFinalUrl);
		} catch (error) {
			console.error('Error during apply:', error);
			onError?.(error instanceof Error ? error.message : 'Crop operation failed');
			setIsDialogOpen(false);
		}
	};

	const handleRemoveFinalImage = () => {
		if (finalImageUrl?.startsWith('blob:')) {
			URL.revokeObjectURL(finalImageUrl);
		}
		setFinalImageUrl(null);
		onCrop?.(null, null);
	};

	// Cleanup effect
	useEffect(() => {
		const currentFinalUrl = finalImageUrl;
		return () => {
			if (currentFinalUrl?.startsWith('blob:')) {
				URL.revokeObjectURL(currentFinalUrl);
			}
		};
	}, [finalImageUrl]);

	// Effect to open dialog when a new file is ready
	useEffect(() => {
		if (fileId && fileId !== previousFileIdRef.current) {
			setIsDialogOpen(true);
			setCroppedAreaPixels(null);
			setZoom(initialZoom);

			const currentFile = files[0];
			if (currentFile && 'file' in currentFile) {
				onFileSelect?.(currentFile.file as File);
			}
		}
		previousFileIdRef.current = fileId;
	}, [fileId, initialZoom, files, onFileSelect]);

	// Render placeholder based on variant
	const renderPlaceholder = () => {
		if (placeholder) return placeholder;

		switch (variant) {
			case 'avatar':
				return <CircleUserRoundIcon className="size-4 opacity-60" />;
			case 'banner':
				return <ImageIcon className="size-4 opacity-60" />;
			case 'square':
				return <ImageIcon className="size-4 opacity-60" />;
			case 'rectangle':
				return <ImageIcon className="size-4 opacity-60" />;
			case 'custom':
				return <ImageIcon className="size-4 opacity-60" />;
			default:
				return <ImageIcon className="size-4 opacity-60" />;
		}
	};

	const containerClasses = cn(
		'relative inline-flex',
		variant === 'avatar' && 'rounded-full',
		variant === 'banner' && 'rounded-lg aspect-video',
		variant === 'square' && 'rounded-lg aspect-square',
		variant === 'rectangle' && 'rounded-lg aspect-[4/3]',
		className,
	);

	const buttonClasses = cn(
		'border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex items-center justify-center overflow-hidden border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none',
		variant === 'avatar' && cn('rounded-full', sizeClasses[size]),
		variant === 'banner' && 'rounded-lg aspect-video w-full min-w-48',
		variant === 'square' && cn('rounded-lg aspect-square', sizeClasses[size]),
		variant === 'rectangle' && 'rounded-lg aspect-[4/3] w-32',
		disabled && 'pointer-events-none opacity-50',
	);

	return (
		<div className={containerClasses}>
			<button
				className={buttonClasses}
				onClick={openFileDialog}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				data-dragging={isDragging || undefined}
				aria-label={ariaLabel || (finalImageUrl ? 'Change image' : 'Upload image')}
				disabled={disabled || loading}
			>
				{finalImageUrl ? (
					<Image
						className="size-full object-cover"
						src={finalImageUrl}
						alt="Uploaded content"
						style={{ objectFit: 'cover' }}
						width={128}
						height={128}
					/>
				) : (
					<div aria-hidden="true">{renderPlaceholder()}</div>
				)}
			</button>

			{finalImageUrl && !disabled && (
				<Button
					onClick={handleRemoveFinalImage}
					size="icon"
					className="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
					aria-label="Remove image"
				>
					<XIcon className="size-3.5" />
				</Button>
			)}

			<input {...getInputProps()} className="sr-only" aria-label="Upload image file" tabIndex={-1} />

			{/* Cropper Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className={cn('gap-0 p-0 sm:max-w-140 *:[button]:hidden', dialogClassName)}>
					<DialogDescription className="sr-only">{dialogDescription}</DialogDescription>
					<DialogHeader className="contents space-y-0 text-left">
						<DialogTitle className="flex items-center justify-between border-b p-4 text-base">
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="-my-1 opacity-60"
									onClick={() => setIsDialogOpen(false)}
									aria-label={cancelButtonText}
								>
									<ArrowLeftIcon aria-hidden="true" />
								</Button>
								<span>{dialogTitle}</span>
							</div>
							<Button className="-my-1" onClick={handleApply} disabled={!previewUrl || !croppedAreaPixels} autoFocus>
								{applyButtonText}
							</Button>
						</DialogTitle>
					</DialogHeader>

					{previewUrl && (
						<Cropper
							className={cn(cropperHeightClasses[size], cropperClassName)}
							image={previewUrl}
							zoom={zoom}
							onCropChange={handleCropChange}
							onZoomChange={setZoom}
						>
							<CropperDescription />
							<CropperImage />
							<CropperCropArea className={currentCropShape === 'round' ? 'rounded-full' : undefined} />
						</Cropper>
					)}

					<DialogFooter className="border-t px-4 py-6">
						<div className="mx-auto flex w-full max-w-80 items-center gap-4">
							<ZoomOutIcon className="shrink-0 opacity-60" size={16} aria-hidden="true" />
							<Slider
								defaultValue={[initialZoom]}
								value={[zoom]}
								min={minZoom}
								max={maxZoom}
								step={0.1}
								onValueChange={(value) => setZoom(value[0])}
								aria-label="Zoom slider"
							/>
							<ZoomInIcon className="shrink-0 opacity-60" size={16} aria-hidden="true" />
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

// Specific cropper components
export type AvatarCropperProps = Omit<BaseCropperProps, 'variant'>;

export function AvatarCropper(props: AvatarCropperProps) {
	return <BaseCropper variant="avatar" {...props} />;
}

export type BannerCropperProps = Omit<BaseCropperProps, 'variant'>;

export function BannerCropper(props: BannerCropperProps) {
	return <BaseCropper variant="banner" {...props} />;
}

export type SquareCropperProps = Omit<BaseCropperProps, 'variant'>;

export function SquareCropper(props: SquareCropperProps) {
	return <BaseCropper variant="square" {...props} />;
}

export type RectangleCropperProps = Omit<BaseCropperProps, 'variant'>;

export function RectangleCropper(props: RectangleCropperProps) {
	return <BaseCropper variant="rectangle" {...props} />;
}

export type CustomCropperProps = Omit<BaseCropperProps, 'variant'>;

export function CustomCropper(props: CustomCropperProps) {
	return <BaseCropper variant="custom" {...props} />;
}
