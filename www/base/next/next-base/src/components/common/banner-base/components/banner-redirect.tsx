import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

export interface BannerRedirectProps {
	emoji?: string;
	message: string;
	href: string;
}

export function BannerRedirect({ emoji = '', message, href }: BannerRedirectProps) {
	return (
		<div className="dark bg-muted px-4 py-3 text-foreground w-full">
			<p className="flex justify-center text-sm">
				<Link href={href} className="group">
					<span className="me-1 text-base leading-none">{emoji}</span>
					{message}
					<ArrowRightIcon
						className="ms-2 -mt-0.5 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5"
						size={16}
						aria-hidden="true"
					/>
				</Link>
			</p>
		</div>
	);
}
