'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
	Cropper,
	CropperCropArea,
	CropperDescription,
	CropperImage,
} from '@/components/ui/cropper';
import { useCroppedImage } from '../hooks/use-cropped-image';
import type { Area } from '../types/area';

const ORIGINAL_IMAGE_URL =
	'https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/cropper-10_k24zxk.jpg';

export default function CroppedImagePreview() {
	const { getCroppedImg } = useCroppedImage();
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

	// Callback to update crop area state
	const handleCropChange = useCallback((pixels: Area | null) => {
		setCroppedAreaPixels(pixels);
	}, []);

	// Function to handle the crop button click
	const handleCrop = async () => {
		if (!croppedAreaPixels) {
			console.error('No crop area selected.');
			return;
		}

		try {
			const croppedBlob = await getCroppedImg(ORIGINAL_IMAGE_URL, croppedAreaPixels);
			if (!croppedBlob) {
				throw new Error('Failed to generate cropped image blob.');
			}

			// Create a new object URL
			const newCroppedUrl = URL.createObjectURL(croppedBlob);

			// Revoke the old URL if it exists
			if (croppedImageUrl) {
				URL.revokeObjectURL(croppedImageUrl);
			}

			// Set the new URL
			setCroppedImageUrl(newCroppedUrl);
		} catch (error) {
			console.error('Error during cropping:', error);
			// Optionally: Clear the old image URL on error
			if (croppedImageUrl) {
				URL.revokeObjectURL(croppedImageUrl);
			}
			setCroppedImageUrl(null);
		}
	};

	// Effect for cleaning up the object URL
	useEffect(() => {
		// This is the cleanup function that runs when the component unmounts
		// or when croppedImageUrl changes before the next effect runs.
		const currentUrl = croppedImageUrl;
		return () => {
			if (currentUrl?.startsWith('blob:')) {
				URL.revokeObjectURL(currentUrl);
				console.log('Revoked URL:', currentUrl); // Optional: for debugging
			}
		};
	}, [croppedImageUrl]); // Dependency array ensures cleanup runs when URL changes

	return (
		<div className="flex flex-col items-center gap-2">
			<div className="flex w-full flex-col gap-4 md:flex-row">
				<Cropper
					className="h-64 md:flex-1"
					image={ORIGINAL_IMAGE_URL}
					onCropChange={handleCropChange}
				>
					<CropperDescription />
					<CropperImage />
					<CropperCropArea />
				</Cropper>
				<div className="flex w-26 flex-col gap-4">
					<Button onClick={handleCrop} disabled={!croppedAreaPixels}>
						Crop preview
					</Button>
					{/* Display Area */}
					<div className="aspect-square w-full shrink-0 overflow-hidden rounded-lg border">
						{croppedImageUrl ? (
							<Image
								src={croppedImageUrl}
								alt="Cropped result"
								className="h-full w-full object-cover"
								width={100}
								height={100}
							/>
						) : (
							<div className="bg-muted text-muted-foreground/80 flex h-full w-full items-center justify-center p-2 text-center text-xs">
								Image preview
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
