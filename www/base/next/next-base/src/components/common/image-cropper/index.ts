// Base Components
// Specific Components
// Legacy examples for compatibility
import {
	AvatarCropper,
	type AvatarCropperProps,
	BannerCropper,
	type BannerCropperProps,
	BaseCropper,
	type BaseCropperProps,
	CustomCropper,
	type CustomCropperProps,
	RectangleCropper,
	type RectangleCropperProps,
	SquareCropper,
	type SquareCropperProps,
} from './base';
import CroppedImagePreview from './components/cropped-image-preview';
import { CropperRoundedImage } from './components/cropper-rounded-image';
import { ProfileCropper } from './components/profile-cropper';
import type { CropperSize, CropperVariant } from './types/cropped';

export const ImageCropper = {
	Base: BaseCropper,
	Avatar: AvatarCropper,
	Banner: BannerCropper,
	Rounded: CropperRoundedImage,
	Custom: CustomCropper,
	Profile: ProfileCropper,
	Rectangle: RectangleCropper,
	Square: SquareCropper,
	Preview: CroppedImagePreview,
};

export type {
	AvatarCropperProps,
	BannerCropperProps,
	BaseCropperProps,
	CropperSize,
	CropperVariant,
	CustomCropperProps,
	RectangleCropperProps,
	SquareCropperProps,
};
