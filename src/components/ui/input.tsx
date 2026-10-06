import { cn } from "@/lib/utils";
import * as React from "react";

export type InputProps = React.ComponentProps<"input"> & {
	/** Conteúdo à esquerda (ícone, prefixo) */
	startAdornment?: React.ReactNode;
	/** Conteúdo à direita (ícone, toggle) */
	endAdornment?: React.ReactNode;
	/** Estilo Figma (altura ~56, radius ~18) — padrão da plataforma */
	variant?: "default" | "auth";
};

/**
 * Input da plataforma — estilo Figma (bordas arredondadas, altura confortável no mobile)
 * com cores do tema (primary/emerald), reutilizável em todos os formulários.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, startAdornment, endAdornment, variant = "default", ...props }, ref) => {
		const hasAdornment = Boolean(startAdornment || endAdornment);

		const field = (
			<input
				type={type}
				className={cn(
					"flex w-full bg-card text-foreground shadow-xs transition-colors",
					"file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
					"placeholder:text-muted-foreground",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
					"disabled:cursor-not-allowed disabled:opacity-50",
					"border border-input",
					variant === "auth"
						? "h-14 min-h-14 rounded-[18px] px-5 text-base"
						: "h-11 min-h-11 rounded-xl px-4 text-base md:h-10 md:min-h-10 md:rounded-lg md:text-sm",
					hasAdornment && "border-0 bg-transparent shadow-none focus-visible:ring-0 h-full min-h-0 px-0",
					startAdornment && "pl-0",
					endAdornment && "pr-0",
					className
				)}
				ref={ref}
				{...props}
			/>
		);

		if (!hasAdornment) return field;

		return (
			<div
				className={cn(
					"flex w-full items-center gap-2 border border-input bg-[#fdfdfd] dark:bg-background",
					"focus-within:ring-2 focus-within:ring-ring",
					variant === "auth" ? "h-14 rounded-[18px] px-4" : "h-11 min-h-11 rounded-xl px-3 md:h-10 md:min-h-10 md:rounded-lg"
				)}
			>
				{startAdornment ? <div className="flex shrink-0 items-center text-muted-foreground">{startAdornment}</div> : null}
				<div className="min-w-0 flex-1">{field}</div>
				{endAdornment ? <div className="flex shrink-0 items-center text-muted-foreground">{endAdornment}</div> : null}
			</div>
		);
	}
);
Input.displayName = "Input";

export { Input };
