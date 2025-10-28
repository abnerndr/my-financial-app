'use client';

import { CircleAlertIcon } from 'lucide-react';
import { type ComponentPropsWithRef, useId } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface DialogDeleteProps extends ComponentPropsWithRef<typeof Dialog> {
	triggerText?: string;
	projectName: string;
	projectTitle?: string;
	declineText?: string;
	deleteText?: string;
	onDeleteAction?: () => void;
	onCancelAction?: () => void;
	onValueChange: (value: string) => void;
	value?: string;
}

export function DialogDelete({
	triggerText = 'Delete',
	projectName,
	projectTitle,
	declineText = 'Cancelar',
	deleteText = 'Remover',
	onDeleteAction,
	onCancelAction,
	onValueChange,
	value,
}: DialogDeleteProps) {
	const id = useId();

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">{triggerText}</Button>
			</DialogTrigger>
			<DialogContent>
				<div className="flex flex-col items-center gap-2">
					<div
						className="flex size-9 shrink-0 items-center justify-center rounded-full border"
						aria-hidden="true"
					>
						<CircleAlertIcon className="opacity-80 text-red-500" size={16} />
					</div>
					<DialogHeader>
						<DialogTitle className="sm:text-center">Confirmação final</DialogTitle>
						<DialogDescription className="sm:text-center">
							Essa ação não pode ser desfeita. Para confirmar, digite o nome do projeto{' '}
							<span className="text-foreground">{projectName}</span>.
						</DialogDescription>
					</DialogHeader>
				</div>

				<form className="space-y-5">
					<div className="*:not-first:mt-2">
						<Label htmlFor={id}>{projectTitle ?? projectName}</Label>
						<Input
							id={id}
							type="text"
							placeholder={`Digite ${projectName} para confirmar`}
							value={value}
							onChange={(e) => onValueChange?.(e.target.value)}
						/>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button
								type="button"
								variant="outline"
								className="flex-1"
								onClick={onCancelAction}
							>
								{declineText}
							</Button>
						</DialogClose>
						<Button
							type="button"
							variant="destructive"
							className="flex-1"
							disabled={value !== projectName}
							onClick={onDeleteAction}
						>
							{deleteText}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
