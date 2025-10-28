import {
	Cropper,
	CropperCropArea,
	CropperDescription,
	CropperImage,
} from '@/components/ui/cropper';

export function CropperRoundedImage() {
	return (
		<div className="flex flex-col items-center gap-2">
			<Cropper
				className="h-80"
				image="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/cropper-06_dduwky.jpg"
			>
				<CropperDescription />
				<CropperImage />
				<CropperCropArea className="rounded-full" />
			</Cropper>
		</div>
	);
}
