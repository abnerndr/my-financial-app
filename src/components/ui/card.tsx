import { cn } from "@/lib/utils";
import * as React from "react";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("rounded-xl border border-border bg-card text-card-foreground shadow-2xs", className)}
		{...props}
	/>
));
Card.displayName = "Card";

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
	/** Linha divisória abaixo do cabeçalho (cards de seção, estilo Preline). */
	divider?: boolean;
	/** Ações à direita do título (filtros, botões). */
	action?: React.ReactNode;
};

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
	({ className, divider, action, children, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"flex flex-col gap-1 p-5",
				divider && "mb-5 border-b px-5 py-4",
				action && "gap-3 sm:flex-row sm:items-center sm:justify-between",
				className
			)}
			{...props}
		>
			{action ? (
				<>
					<div className="flex min-w-0 flex-col gap-1">{children}</div>
					<div className="flex shrink-0 items-center gap-2">{action}</div>
				</>
			) : (
				children
			)}
		</div>
	)
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
	({ className, ...props }, ref) => (
		<h3 ref={ref} className={cn("text-base font-semibold leading-tight text-foreground", className)} {...props} />
	)
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
	({ className, ...props }, ref) => (
		<p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
	)
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
