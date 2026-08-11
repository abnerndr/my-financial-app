"use client";

import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import * as React from "react";

type FieldProps = {
	label?: string;
	htmlFor?: string;
	error?: string;
	hint?: string;
	className?: string;
	children?: React.ReactNode;
} & Omit<InputProps, "children">;

/**
 * Campo com label acima (padrão Figma login) + input da plataforma.
 * Use `children` para substituir o input (ex.: Select).
 */
export const Field = React.forwardRef<HTMLInputElement, FieldProps>(
	({ label, htmlFor, error, hint, className, children, id, variant = "auth", ...inputProps }, ref) => {
		const fieldId = htmlFor ?? id;
		return (
			<div className={cn("space-y-2", className)}>
				{label ? (
					<Label htmlFor={fieldId} className="text-[15px] font-normal tracking-wide text-foreground">
						{label}
					</Label>
				) : null}
				{children ?? <Input id={fieldId} ref={ref} variant={variant} {...inputProps} />}
				{hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
				{error ? <p className="text-sm text-destructive">{error}</p> : null}
			</div>
		);
	}
);
Field.displayName = "Field";
