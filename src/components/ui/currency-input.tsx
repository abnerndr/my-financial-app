"use client";

import { Input, type InputProps } from "@/components/ui/input";
import { formatCurrencyInput, maskCurrencyFromDigits, parseCurrencyInput } from "@/lib/money";
import { useEffect, useState } from "react";

type CurrencyInputProps = Omit<InputProps, "value" | "onChange" | "type" | "inputMode"> & {
	value: number;
	onChange: (value: number) => void;
};

/**
 * Input de valor em R$ com máscara pt-BR.
 * Exibe "1.234,56" e devolve número 1234.56 via onChange.
 */
export function CurrencyInput({ value, onChange, onBlur, ...props }: CurrencyInputProps) {
	const [text, setText] = useState(() => formatCurrencyInput(value));

	useEffect(() => {
		setText(formatCurrencyInput(value));
	}, [value]);

	return (
		<Input
			{...props}
			type="text"
			inputMode="numeric"
			autoComplete="off"
			enterKeyHint={props.enterKeyHint ?? "done"}
			startAdornment={<span className="text-sm font-medium text-muted-foreground">R$</span>}
			value={text}
			placeholder={props.placeholder ?? "0,00"}
			onChange={(e) => {
				const masked = maskCurrencyFromDigits(e.target.value);
				setText(masked);
				onChange(parseCurrencyInput(masked));
			}}
			onBlur={(e) => {
				const n = parseCurrencyInput(text);
				setText(formatCurrencyInput(n));
				onChange(n);
				onBlur?.(e);
			}}
		/>
	);
}
