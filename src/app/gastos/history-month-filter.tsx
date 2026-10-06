"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const ALL = "todos";

export function HistoryMonthFilter({
	months,
	value,
}: {
	months: { key: string; label: string; count: number }[];
	value: string | null;
}) {
	const router = useRouter();
	const pathname = usePathname();

	const onChange = (next: string) => {
		// Trocar o mês sempre volta para a primeira página.
		router.push(next === ALL ? pathname : `${pathname}?mes=${next}`, { scroll: false });
	};

	return (
		<Select value={value ?? ALL} onValueChange={onChange}>
			<SelectTrigger className="w-full sm:w-56" aria-label="Filtrar por mês">
				<span className="flex items-center gap-2">
					<CalendarDays className="size-4 text-muted-foreground" />
					<SelectValue />
				</span>
			</SelectTrigger>
			<SelectContent align="end">
				<SelectItem value={ALL}>Todos os meses</SelectItem>
				{months.map((m) => (
					<SelectItem key={m.key} value={m.key}>
						<span className="capitalize">{m.label}</span>
						<span className="ml-1.5 text-muted-foreground">({m.count})</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
