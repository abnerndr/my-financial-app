import type { Area } from '../types/area';

export function useCroppedImage() {
	const createImage = (url: string): Promise<HTMLImageElement> =>
		new Promise((resolve, reject) => {
			const image = new window.Image();
			image.addEventListener('load', () => resolve(image));
			image.addEventListener('error', (error: Event) => reject(error));
			image.setAttribute('crossOrigin', 'anonymous');
			image.src = url;
		});

	async function getCroppedImg(
		imageSrc: string,
		pixelCrop: Area,
		outputWidth: number = pixelCrop.width,
		outputHeight: number = pixelCrop.height,
		quality: number = 0.92,
	): Promise<Blob | null> {
		try {
			const image = await createImage(imageSrc);
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			if (!ctx) {
				return null;
			}

			canvas.width = outputWidth;
			canvas.height = outputHeight;

			ctx.drawImage(
				image,
				pixelCrop.x,
				pixelCrop.y,
				pixelCrop.width,
				pixelCrop.height,
				0,
				0,
				outputWidth,
				outputHeight,
			);

			return new Promise((resolve) => {
				canvas.toBlob(
					(blob) => {
						resolve(blob);
					},
					'image/jpeg',
					quality,
				);
			});
		} catch (error) {
			console.error('Error in getCroppedImg:', error);
			return null;
		}
	}

	return { getCroppedImg, createImage };
}
