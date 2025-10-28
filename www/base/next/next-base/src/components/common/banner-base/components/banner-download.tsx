'use client';

import { DownloadIcon, LoaderCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface BannerDownloadProps {
	version: string;
	message: string;
	downloadText?: string;
	updatingText?: string;
	onDownload?: () => void;
	isLoading?: boolean;
}

export function BannerDownload({
	version,
	message,
	downloadText,
	updatingText,
	onDownload,
	isLoading,
}: BannerDownloadProps) {
	return (
		<div className="bg-muted px-4 py-3 md:py-2 w-full">
			<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
				<p className="text-sm">
					<span className="font-medium">{version}</span>
					<span className="mx-2 text-muted-foreground">•</span>
					{message}
				</p>
				<Button
					size="sm"
					variant="outline"
					disabled={isLoading}
					onClick={onDownload}
					className="min-w-24"
				>
					{isLoading ? (
						<>
							<LoaderCircleIcon
								className="-ms-0.5 me-2 animate-spin"
								size={16}
								aria-hidden="true"
							/>
							{updatingText}
						</>
					) : (
						<>
							<DownloadIcon size={16} className="-ms-0.5" aria-hidden="true" />
							{downloadText}
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
