import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

export type DialogScrollableDescription = {
	title: string;
	description: string;
};

export interface DialogScrollableProps {
	triggerText?: string;
	title: string;
	description?: DialogScrollableDescription[];
	declineText?: string;
	confirmText?: string;
	disabled?: boolean;
	onConfirmAction?: () => void;
	onCancelAction?: () => void;
}

export function DialogScrollable({
	triggerText,
	title,
	description,
	declineText = 'Cancelar',
	confirmText = 'Confirmar',
	onConfirmAction,
	onCancelAction,
	disabled,
}: DialogScrollableProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">{triggerText}</Button>
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:hidden">
				<div className="overflow-y-auto">
					<DialogHeader className="contents space-y-0 text-left">
						<DialogTitle className="px-6 pt-6 text-base">{title}</DialogTitle>
						<DialogDescription asChild>
							<div className="p-6">
								<div className="space-y-4 [&_strong]:font-semibold [&_strong]:text-foreground">
									{description?.map((item) => (
										<div className="space-y-1" key={item.title}>
											<p>
												<strong>{item.title}</strong>
											</p>
											<p>{item.description}</p>
										</div>
									))}
								</div>
							</div>
						</DialogDescription>
					</DialogHeader>
				</div>
				<DialogFooter className="border-t px-6 py-4">
					<DialogClose asChild>
						<Button
							type="button"
							variant="outline"
							onClick={onCancelAction}
							disabled={disabled}
						>
							{declineText}
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button type="button" onClick={onConfirmAction} disabled={disabled}>
							{confirmText}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
