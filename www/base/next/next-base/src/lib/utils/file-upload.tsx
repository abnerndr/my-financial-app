import {
	FileArchiveIcon,
	FileIcon,
	FileSpreadsheetIcon,
	FileTextIcon,
	HeadphonesIcon,
	ImageIcon,
	VideoIcon,
} from 'lucide-react';
import type { InitialFileType } from '@/components/common/file-upload-base';

export class FileUploadUtils {
	static getFileIcon(file: { file: File | { type: string; name: string } }) {
		const fileType =
			(file.file as File).type ||
			(file.file as { type: string; name: string }).type ||
			'';
		const fileName =
			(file.file as File).name ||
			(file.file as { type: string; name: string }).name ||
			'';
		if (
			fileType.includes('pdf') ||
			fileType.endsWith('.pdf') ||
			fileType.includes('word') ||
			fileType.endsWith('.doc') ||
			fileType.endsWith('.docx')
		) {
			return <FileTextIcon className="size-4 opacity-60" />;
		} else if (
			fileType.includes('zip') ||
			fileType.includes('archive') ||
			fileName.endsWith('.zip') ||
			fileName.endsWith('.rar')
		) {
			return <FileArchiveIcon className="size-4 opacity-60" />;
		} else if (
			fileType.includes('excel') ||
			fileName.endsWith('.xls') ||
			fileName.endsWith('.xlsx')
		) {
			return <FileSpreadsheetIcon className="size-4 opacity-60" />;
		} else if (fileType.includes('video/')) {
			return <VideoIcon className="size-4 opacity-60" />;
		} else if (fileType.includes('audio/')) {
			return <HeadphonesIcon className="size-4 opacity-60" />;
		} else if (fileType.startsWith('image/')) {
			return <ImageIcon className="size-4 opacity-60" />;
		}
		return <FileIcon className="size-4 opacity-60" />;
	}

	static async allFilesPromise(
		currentFiles: File[],
		initialFiles: InitialFileType[] | undefined,
	): Promise<File[]> {
		const initialFileObjects: File[] = [];
		if (initialFiles && initialFiles.length > 0) {
			for (const initialFile of initialFiles) {
				try {
					if (initialFile.url && initialFile.name) {
						// Faz fetch do arquivo inicial e converte para File
						const response = await fetch(initialFile.url);
						const blob = await response.blob();
						const file = new File([blob], initialFile.name, {
							type: initialFile.type || blob.type,
						});
						initialFileObjects.push(file);
					}
				} catch (error) {
					console.warn(`Erro ao processar arquivo inicial ${initialFile.name}:`, error);
				}
			}
		}
		const allFiles = [...initialFileObjects, ...currentFiles];
		const uniqueFiles = allFiles.filter(
			(file, index, array) =>
				array.findIndex((f) => f.name === file.name && f.size === file.size) === index,
		);
		return uniqueFiles;
	}
}
