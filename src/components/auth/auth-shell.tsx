import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({
	title,
	children,
	backHref,
	className,
}: {
	title: string;
	children: ReactNode;
	backHref?: string;
	className?: string;
}) {
	return (
		<div className={cn("flex min-h-dvh flex-col bg-background px-6 pb-10 pt-14 md:items-center md:justify-center md:px-4", className)}>
			<div className="mx-auto w-full max-w-[400px]">
				<div className="relative mb-10 flex items-center justify-center">
					{backHref ? (
						<Link
							href={backHref}
							className="absolute left-0 inline-flex size-10 items-center justify-center rounded-full text-foreground hover:bg-muted"
							aria-label="Voltar"
						>
							<span className="text-2xl leading-none">‹</span>
						</Link>
					) : null}
					<h1 className="text-center text-[30px] font-bold tracking-wide text-foreground">{title}</h1>
				</div>
				{children}
			</div>
		</div>
	);
}
