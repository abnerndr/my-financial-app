import {
	AvatarUploadButton,
	type AvatarUploadButtonProps,
} from './components/avatar-upload-button';
import {
	AvatarUploadDroppableCropper,
	type AvatarUploadDroppableCropperProps,
} from './components/avatar-upload-droppable-cropper';
import {
	AvatarUploadSimple,
	type AvatarUploadSimpleProps,
} from './components/avatar-uploader-simple';
import {
	MultipleFilesUploaderList,
	type MultipleFilesUploaderListProps,
} from './components/multiple-files-uploader-list';
import {
	MultipleFilesUploaderTable,
	type MultipleFilesUploaderTableProps,
} from './components/multiple-files-uploader-table';
import {
	type InitialFileType,
	MultipleImageUploaderGrid,
	type MultipleImageUploaderGridProps,
} from './components/multiple-image-uploader-grid';
import {
	MultipleImageUploaderList,
	type MultipleImageUploaderListProps,
} from './components/multiple-image-uploader-list';
import {
	SingleImageUploader,
	type SingleImageUploaderProps,
} from './components/single-image-uploader';

export const FileUploadBase = {
	Avatar: {
		Simple: AvatarUploadSimple,
		DroppableCropper: AvatarUploadDroppableCropper,
		Button: AvatarUploadButton,
	},
	Multiple: {
		ImageGrid: MultipleImageUploaderGrid,
		ImageList: MultipleImageUploaderList,
		FileList: MultipleFilesUploaderList,
		FileTable: MultipleFilesUploaderTable,
	},
	Single: SingleImageUploader,
};

export type {
	AvatarUploadButtonProps,
	AvatarUploadDroppableCropperProps,
	AvatarUploadSimpleProps,
	InitialFileType,
	MultipleFilesUploaderListProps,
	MultipleFilesUploaderTableProps,
	MultipleImageUploaderGridProps,
	MultipleImageUploaderListProps,
	SingleImageUploaderProps,
};
