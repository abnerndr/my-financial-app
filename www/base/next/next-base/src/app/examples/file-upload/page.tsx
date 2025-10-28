'use client';

import { FileUploadBase } from '@/components/common/file-upload-base';

const initialFiles = [
	{
		name: 'image-01.jpg',
		size: 1528737,
		type: 'image/jpeg',
		url: 'https://picsum.photos/1000/800?grayscale&random=1',
		id: 'image-01-123456789',
	},
	{
		name: 'image-02.jpg',
		size: 1528737,
		type: 'image/jpeg',
		url: 'https://picsum.photos/1000/800?grayscale&random=2',
		id: 'image-02-123456789',
	},
];

export default function FileUploadPage() {
	return (
		<div className="w-full h-screen px-[340px] flex justify-center flex-col items-center gap-y-4 my-24 mb-32">
			<h2>Avatar</h2>
			<div className="w-full  flex justify-center flex-row items-center gap-x-6 mt-20">
				<FileUploadBase.Avatar.Simple
					onGetFile={(file) => console.log('simple avatar', file)}
				/>
				<FileUploadBase.Avatar.Button
					onGetFile={(file) => console.log('button avatar', file)}
				/>
				<FileUploadBase.Avatar.DroppableCropper
					onGetCroppedImage={(file) => console.log('droppable cropper avatar', file)}
				/>
			</div>
			<h2>Single</h2>
			<div className="w-full  flex justify-center flex-row items-center gap-x-6">
				<FileUploadBase.Single onGetFile={(file) => console.log('single image', file)} />
			</div>
			<h2>Multiples Images</h2>
			<div className="w-full flex justify-center flex-row items-center gap-x-6">
				<FileUploadBase.Multiple.ImageGrid
					initialFiles={initialFiles}
					maxSizeMB={6}
					maxFiles={4}
					onGetFiles={(files) => console.log('multiple images grid', files)}
				/>
				<FileUploadBase.Multiple.ImageList
					initialFiles={initialFiles}
					maxSizeMB={6}
					maxFiles={4}
					onGetFiles={(files) => console.log('multiple images list', files)}
				/>
			</div>
			<h2>Multiples Files</h2>
			<div className="w-full flex justify-center flex-row items-center gap-x-6 ">
				<FileUploadBase.Multiple.FileList
					initialFiles={initialFiles}
					maxFiles={10}
					onGetFiles={(files) => console.log('multiple files list', files)}
				/>
				<FileUploadBase.Multiple.FileTable
					initialFiles={initialFiles}
					maxFiles={10}
					onGetFiles={(files) => console.log('multiple files table', files)}
				/>
			</div>
		</div>
	);
}
