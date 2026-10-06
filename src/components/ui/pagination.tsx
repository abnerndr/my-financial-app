import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

/** Páginas visíveis: primeira, última e vizinhas da atual, com "…" nos saltos. */
function visiblePages(current: number, total: number): (number | "gap")[] {
	const pages: (number | "gap")[] = [];
	for (let p = 1; p <= total; p++) {
		if (p === 1 || p === total || Math.abs(p - current) <= 1) pages.push(p);
		else if (pages.at(-1) !== "gap") pages.push("gap");
	}
	return pages;
}

export function Pagination({
	page,
	pageSize,
	total,
	hrefFor,
}: {
	page: number;
	pageSize: number;
	total: number;
	hrefFor: (page: number) => string;
}) {
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
	const to = Math.min(page * pageSize, total);

	const navClass = (disabled: boolean) =>
		cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1 px-2.5", disabled && "pointer-events-none opacity-50");

	return (
		<nav aria-label="Paginação" className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
			<p className="text-sm text-muted-foreground">
				Mostrando <span className="font-medium text-foreground">{from}–{to}</span> de{" "}
				<span className="font-medium text-foreground">{total}</span>
			</p>
			{totalPages > 1 && (
				<div className="flex items-center gap-1">
					<Link href={hrefFor(page - 1)} scroll={false} aria-disabled={page <= 1} className={navClass(page <= 1)}>
						<ChevronLeft />
						<span className="hidden sm:inline">Anterior</span>
					</Link>
					{visiblePages(page, totalPages).map((p, i) =>
						p === "gap" ? (
							<span key={`gap-${i}`} className="px-1.5 text-sm text-muted-foreground">
								…
							</span>
						) : (
							<Link
								key={p}
								href={hrefFor(p)}
								scroll={false}
								aria-current={p === page ? "page" : undefined}
								className={cn(
									buttonVariants({ variant: p === page ? "secondary" : "ghost", size: "sm" }),
									"min-w-8 px-2 tabular-nums",
									p === page && "pointer-events-none"
								)}
							>
								{p}
							</Link>
						)
					)}
					<Link
						href={hrefFor(page + 1)}
						scroll={false}
						aria-disabled={page >= totalPages}
						className={navClass(page >= totalPages)}
					>
						<span className="hidden sm:inline">Próxima</span>
						<ChevronRight />
					</Link>
				</div>
			)}
		</nav>
	);
}
