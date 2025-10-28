'use client';

import { CheckIcon, CreditCardIcon, XIcon } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { usePaymentInputs } from 'react-payment-inputs';
import images, { type CardImages } from 'react-payment-inputs/images';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ErroredInputs {
	cardNumber: string;
	expiryDate: string;
	cvc: string;
	zipField: string;
}

interface CardDetails {
	cardNumber: string | null;
	expiryDate: string | null;
	cvc: string | null;
	type: string | null;
}

export type InputCardDetailsProps = {
	label?: string;
	error?: string;
	required?: boolean;
	onGetCardDetails?: (details: CardDetails) => void;
};

const TranslateErrorMessage: Record<string, string> = {
	'Card number is invalid': 'O número do cartão é inválido',
	'Enter a card number': 'Insira um número de cartão',
	'Expiry date is invalid': 'A data de expiração é inválida',
	'Enter an expiry date': 'Insira uma data de expiração',
	'CVC is invalid': 'O código CVC é inválido',
	'Enter a CVC': 'Insira um código CVC',
};

const SuccessCardMessage: Record<string, string> = {
	cardNumber: 'Número do cartão válido',
	expiryDate: 'Data de expiração válida',
	cvc: 'CVC válido',
};

export function InputCardDetails({ label = '', error, required, onGetCardDetails }: InputCardDetailsProps) {
	const [cardNumber, setCardNumber] = useState<string | null>(null);
	const [expiryDate, setExpiryDate] = useState<string | null>(null);
	const [cvc, setCvc] = useState<string | null>(null);
	const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps, getCardImageProps } = usePaymentInputs();
	const id = useId();

	useEffect(() => {
		if (onGetCardDetails) {
			onGetCardDetails({ cardNumber, expiryDate, cvc, type: meta.cardType ? meta.cardType.type : null });
		}
	}, [cardNumber, expiryDate, cvc, onGetCardDetails]);

	return (
		<div className="*:not-first:mt-2">
			<legend className="text-sm font-medium text-foreground">
				{label} {required && <span className="text-red-500">*</span>}
			</legend>
			<div className="rounded-md shadow-xs">
				<div className="relative focus-within:z-10">
					<Input
						className={cn(
							'peer rounded-b-none pe-9 shadow-none [direction:inherit]',
							meta?.erroredInputs && 'border-red-500',
						)}
						{...getCardNumberProps({
							onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCardNumber(e.target.value),
						})}
						id={`number-${id}`}
					/>
					<div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
						{meta.cardType ? (
							<svg
								className="overflow-hidden rounded-sm"
								{...getCardImageProps({
									images: images as unknown as CardImages,
								})}
								width={20}
							/>
						) : (
							<CreditCardIcon size={16} aria-hidden="true" />
						)}
					</div>
				</div>
				<div className="-mt-px flex">
					<div className="min-w-0 flex-1 focus-within:z-10">
						<Input
							className={cn(
								'rounded-e-none rounded-t-none shadow-none [direction:inherit]',
								meta?.erroredInputs && 'border-red-500',
							)}
							{...getExpiryDateProps({
								onChange: (e: React.ChangeEvent<HTMLInputElement>) => setExpiryDate(e.target.value),
							})}
							id={`expiry-${id}`}
						/>
					</div>
					<div className="-ms-px min-w-0 flex-1 focus-within:z-10">
						<Input
							className={cn(
								'rounded-s-none rounded-t-none shadow-none [direction:inherit]',
								meta?.erroredInputs && 'border-red-500',
							)}
							{...getCVCProps({ onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCvc(e.target.value) })}
							id={`cvc-${id}`}
						/>
					</div>
				</div>
			</div>
			{meta?.erroredInputs && <ErrorCardMessage erroredInputs={meta.erroredInputs} />}
			{error && (
				<div className="flex flex-row items-center gap-x-2 absolute">
					<XIcon size={16} />
					<p>{error}</p>
				</div>
			)}
		</div>
	);
}

function ErrorCardMessage({ erroredInputs }: { erroredInputs: ErroredInputs }) {
	return (
		<div className="flex flex-col items-start text-sm absolute">
			<div className="text-destructive">
				{erroredInputs.cardNumber && (
					<div className="flex flex-row items-center gap-x-2">
						<XIcon size={16} />
						<p>{TranslateErrorMessage[erroredInputs.cardNumber]}</p>
					</div>
				)}
				{!erroredInputs.cardNumber && (
					<div className="flex flex-row items-center gap-x-2 text-green-600">
						<CheckIcon size={16} />
						<p>{SuccessCardMessage.cardNumber}</p>
					</div>
				)}
			</div>
			<div className="text-destructive">
				{erroredInputs.expiryDate && (
					<div className="flex flex-row items-center gap-x-2">
						<XIcon size={16} />
						<p>{TranslateErrorMessage[erroredInputs.expiryDate]}</p>
					</div>
				)}
				{!erroredInputs.expiryDate && (
					<div className="flex flex-row items-center gap-x-2 text-green-600">
						<CheckIcon size={16} />
						<p>{SuccessCardMessage.expiryDate}</p>
					</div>
				)}
			</div>
			<div className="text-destructive ">
				{erroredInputs.cvc && (
					<div className="flex flex-row items-center gap-x-2">
						<XIcon size={16} />
						<p>{TranslateErrorMessage[erroredInputs.cvc]}</p>
					</div>
				)}
				{!erroredInputs.cvc && (
					<div className="flex flex-row items-center gap-x-2 text-green-600">
						<CheckIcon size={16} />
						<p>{SuccessCardMessage.cvc}</p>
					</div>
				)}
			</div>
		</div>
	);
}
