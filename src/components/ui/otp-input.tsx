"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";

type OtpInputProps = {
	length?: number;
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	className?: string;
};

/** 4 caixas OTP no estilo Figma (verify screen). */
export function OtpInput({ length = 4, value, onChange, disabled, className }: OtpInputProps) {
	const refs = useRef<Array<HTMLInputElement | null>>([]);
	const digits = Array.from({ length }, (_, i) => value[i] ?? "");

	const setAt = (index: number, char: string) => {
		const next = digits.map((d, i) => (i === index ? char : d));
		onChange(next.join("").slice(0, length));
	};

	return (
		<div className={cn("flex justify-between gap-3", className)}>
			{digits.map((digit, index) => (
				<input
					key={index}
					ref={(el) => {
						refs.current[index] = el;
					}}
					type="text"
					inputMode="numeric"
					autoComplete={index === 0 ? "one-time-code" : "off"}
					maxLength={1}
					value={digit}
					disabled={disabled}
					aria-label={`Dígito ${index + 1} do código`}
					className={cn(
						"h-[61px] w-[66px] rounded-xl border border-input bg-[#fdfdfd] text-center text-xl font-semibold text-foreground shadow-sm",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
						"disabled:opacity-50"
					)}
					onChange={(e) => {
						const raw = e.target.value.replace(/\D/g, "");
						if (!raw) {
							setAt(index, "");
							return;
						}
						const char = raw.slice(-1);
						setAt(index, char);
						if (index < length - 1) refs.current[index + 1]?.focus();
					}}
					onKeyDown={(e) => {
						if (e.key === "Backspace" && !digits[index] && index > 0) {
							refs.current[index - 1]?.focus();
						}
					}}
					onPaste={(e) => {
						e.preventDefault();
						const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
						if (!pasted) return;
						onChange(pasted.padEnd(length, "").slice(0, length).replace(/ /g, ""));
						const focusIdx = Math.min(pasted.length, length - 1);
						refs.current[focusIdx]?.focus();
					}}
				/>
			))}
		</div>
	);
}
