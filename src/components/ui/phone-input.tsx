"use client";

import { Input, type InputProps } from "@/components/ui/input";
import {
	formatPhoneMask,
	normalizePhoneDigits,
	type PhoneKind,
} from "@/lib/phone";
import { useEffect, useState } from "react";

type PhoneInputProps = Omit<InputProps, "value" | "onChange" | "type" | "inputMode"> & {
	/** Valor canônico (só dígitos, com 55) ou mascarado — aceita os dois. */
	value: string;
	/** Sempre recebe só dígitos normalizados (ex.: 5511999999999). */
	onChange: (digits: string) => void;
	/** Celular, fixo ou auto (detecta pelo tamanho). */
	kind?: PhoneKind;
};

/**
 * Input global de telefone/celular com máscara BR.
 * Exibe `(11) 98765-4321` e devolve dígitos sem símbolos via onChange.
 */
export function PhoneInput({
	value,
	onChange,
	kind = "auto",
	onBlur,
	...props
}: PhoneInputProps) {
	const [text, setText] = useState(() => formatPhoneMask(value, kind));

	useEffect(() => {
		setText(formatPhoneMask(value, kind));
	}, [value, kind]);

	return (
		<Input
			{...props}
			type="tel"
			inputMode="tel"
			autoComplete={props.autoComplete ?? "tel"}
			enterKeyHint={props.enterKeyHint ?? "done"}
			value={text}
			placeholder={
				props.placeholder ??
				(kind === "landline" ? "(11) 3456-7890" : "(11) 98765-4321")
			}
			onChange={(e) => {
				const masked = formatPhoneMask(e.target.value, kind);
				setText(masked);
				onChange(normalizePhoneDigits(masked));
			}}
			onBlur={(e) => {
				const digits = normalizePhoneDigits(text);
				setText(formatPhoneMask(digits, kind));
				onChange(digits);
				onBlur?.(e);
			}}
		/>
	);
}
