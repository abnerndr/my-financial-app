import { MailIcon } from 'lucide-react';
import { CircleLogoIcon } from '@/components/images/circle-logo';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { IconProps } from '@/types/icons';

export interface DialogNewsletterProps {
	triggerText: string;
	icon: IconProps;
	title: string;
	description?: string;
	onGetEmail: (email: string) => void;
	email?: string;
}

export function DialogNewsletter({
	triggerText,
	icon: Icon = CircleLogoIcon,
	title,
	description = '',
	onGetEmail,
	email,
}: DialogNewsletterProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">{triggerText}</Button>
			</DialogTrigger>
			<DialogContent>
				<div className="mb-2 flex flex-col items-center gap-2">
					<div
						className="flex size-11 shrink-0 items-center justify-center rounded-full border"
						aria-hidden="true"
					>
						<Icon />
					</div>
					<DialogHeader>
						<DialogTitle className="sm:text-center">{title}</DialogTitle>
						<DialogDescription className="sm:text-center">
							{description}
						</DialogDescription>
					</DialogHeader>
				</div>

				<form className="space-y-5">
					<div className="*:not-first:mt-2">
						<div className="relative">
							<Input
								id="dialog-subscribe"
								className="peer ps-9"
								placeholder="email@domain.com"
								onChange={(e) => onGetEmail(e.target.value)}
								value={email}
								type="email"
								aria-label="Email"
							/>
							<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
								<MailIcon size={16} aria-hidden="true" />
							</div>
						</div>
					</div>
					<Button type="button" className="w-full">
						Inscrever-se
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
