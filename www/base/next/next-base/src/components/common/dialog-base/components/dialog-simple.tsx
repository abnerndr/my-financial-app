import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { IconProps } from '@/types/icons';

export interface DialogSimpleProps {
	triggerText?: string;
	title: string;
	description?: string;
	icon?: IconProps;
	declineText?: string;
	confirmText?: string;
	onConfirmAction?: () => void;
	onCancelAction?: () => void;
}

export function DialogSimple({
	triggerText = 'Trigger Dialog',
	title,
	description = '',
	icon: Icon,
	declineText = 'Cancel',
	confirmText = 'Confirm',
	onConfirmAction,
	onCancelAction,
}: DialogSimpleProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">{triggerText}</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
					{Icon && (
						<div
							className="flex size-9 shrink-0 items-center justify-center rounded-full border"
							aria-hidden="true"
						>
							<Icon className="opacity-80" size={16} />
						</div>
					)}
					<AlertDialogHeader>
						<AlertDialogTitle>{title}</AlertDialogTitle>
						<AlertDialogDescription>{description}</AlertDialogDescription>
					</AlertDialogHeader>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onCancelAction}>{declineText}</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirmAction}>{confirmText}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
