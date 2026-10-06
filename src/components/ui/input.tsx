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

/** Visual base de controles de formulário (input, select, textarea) — padrão Preline. */
export const formControlClass = cn(
	"border border-input bg-card text-foreground shadow-2xs transition-[color,box-shadow,border-color]",
	"placeholder:text-muted-foreground",
	"hover:border-foreground/25",
	"focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
	"disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input"
);

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
					"flex w-full",
					formControlClass,
					"file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
					variant === "auth"
						? "h-14 min-h-14 rounded-[18px] px-5 text-base"
						: "h-11 min-h-11 rounded-lg px-3 text-base md:h-10 md:min-h-10 md:text-sm",
					hasAdornment &&
						"h-full min-h-0 border-0 bg-transparent px-0 shadow-none hover:border-0 focus-visible:ring-0",
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
					"flex w-full items-center gap-2 border border-input bg-card shadow-2xs transition-[box-shadow,border-color]",
					"hover:border-foreground/25 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20",
					variant === "auth" ? "h-14 rounded-[18px] px-4" : "h-11 min-h-11 rounded-lg px-3 md:h-10 md:min-h-10"
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
