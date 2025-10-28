'use client';

import { HomeIcon } from 'lucide-react';
import { useState } from 'react';
import { DialogBase } from '@/components/common/dialog-base';
import { CircleLogoIcon } from '@/components/images/circle-logo';

const scrollableDescription = [
	{
		title: 'teste',
		description:
			'lorem ipsum dolor sit amet consectetur adipiscing elit, lorem ipsum dolor sit amet consectetur adipiscing elit. lorem ipsum dolor sit amet consectetur adipiscing elit, lorem ipsum dolor sit amet consectetur adipiscing elit',
	},
	{
		title: 'teste',
		description:
			'lorem ipsum dolor sit amet consectetur adipiscing elit, lorem ipsum dolor sit amet consectetur adipiscing elit. lorem ipsum dolor sit amet consectetur adipiscing elit, lorem ipsum dolor sit amet consectetur adipiscing elit',
	},
	{
		title: 'teste',
		description:
			'lorem ipsum dolor sit amet consectetur adipiscing elit, lorem ipsum dolor sit amet consectetur adipiscing elit. lorem ipsum dolor sit amet consectetur adipiscing elit, lorem ipsum dolor sit amet consectetur adipiscing elit',
	},
	{
		title: 'teste',
		description:
			'lorem ipsum dolor sit amet consectetur adipiscing elit, lorem ipsum dolor sit amet consectetur adipiscing elit. lorem ipsum dolor sit amet consectetur adipiscing elit, lorem ipsum dolor sit amet consectetur adipiscing elit',
	},
	{
		title: 'teste',
		description:
			'lorem ipsum dolor sit amet consectetur adipiscing elit, lorem ipsum dolor sit amet consectetur adipiscing elit. lorem ipsum dolor sit amet consectetur adipiscing elit, lorem ipsum dolor sit amet consectetur adipiscing elit	',
	},
];

export default function DialogPage() {
	const [onDeleteValue, setOnDeleteValue] = useState('');
	const handleConfirm = () => {
		console.log('Confirmed');
	};
	const handleDelete = () => {
		console.log('Deleted');
	};
	return (
		<div className="w-full flex flex-col h-screen justify-center gap-y-4 my-20">
			<div className="w-full max-w-md mx-auto flex justify-center flex-row items-center gap-x-4 ">
				<DialogBase.Simple
					triggerText="Simple Modal"
					icon={HomeIcon}
					title="Teste"
					description="descriptions"
					confirmText="Confirmar"
					declineText="Cancelar"
					onConfirmAction={handleConfirm}
				/>
				<DialogBase.Scrollable
					triggerText="Scrollable Modal"
					description={scrollableDescription}
					title="Teste"
					confirmText="Confirmar"
					declineText="Cancelar"
					onConfirmAction={handleConfirm}
				/>
				<DialogBase.Delete
					onValueChange={setOnDeleteValue}
					value={onDeleteValue}
					projectName="ruperth.com/project-1"
					projectTitle="Projeto 1 Ruperth"
					triggerText="Delete Modal"
					deleteText="Remover"
					declineText="Cancelar"
					onDeleteAction={handleDelete}
				/>
				<DialogBase.Newsletter
					triggerText="Newsletter Modal"
					icon={CircleLogoIcon}
					title="Assine a nossa newsletter"
					description=""
					onGetEmail={(value) => console.log(value)}
				/>
				<DialogBase.CardDetails
					triggerText="Card Details Modal"
					title="Detalhes do Cartão"
					description="Informe os dados que ficarão salvos no sistema"
				/>
			</div>
		</div>
	);
}
