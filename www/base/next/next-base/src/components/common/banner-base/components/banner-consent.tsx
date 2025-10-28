import { Button } from '@/components/ui/button';

export interface BannerConsentProps {
	message: string;
	acceptText?: string;
	declineText?: string;
	onAccept: () => void;
	onDecline: () => void;
}

export function BannerConsent({
	message,
	acceptText,
	declineText,
	onAccept,
	onDecline,
}: BannerConsentProps) {
	return (
		<div className="z-50 rounded-md border bg-background px-4 py-3 shadow-lg w-full">
			<div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
				<p className="text-sm">{message}</p>
				<div className="flex gap-2 max-md:flex-wrap">
					<Button size="sm" type="button" onClick={onAccept}>
						{acceptText}
					</Button>
					<Button variant="outline" type="button" size="sm" onClick={onDecline}>
						{declineText}
					</Button>
				</div>
			</div>
		</div>
	);
}
