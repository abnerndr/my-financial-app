type MonthRange = {
	start: Date;
	end: Date;
};

function getTzOffsetMinutes(date: Date, timeZone: string): number {
	// Uses ICU to format a numeric GMT offset like "GMT-3" / "GMT-03:00".
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone,
		timeZoneName: "shortOffset",
		year: "numeric",
	}).formatToParts(date);

	const tzName = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
	const match = tzName.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
	if (!match) return 0;
	const sign = match[1] === "-" ? -1 : 1;
	const hours = Number(match[2] ?? 0);
	const minutes = Number(match[3] ?? 0);
	return sign * (hours * 60 + minutes);
}

function getYearMonthInTz(baseDate: Date, timeZone: string): { year: number; month0: number } {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone,
		year: "numeric",
		month: "2-digit",
	}).formatToParts(baseDate);

	const year = Number(parts.find((p) => p.type === "year")?.value);
	const month = Number(parts.find((p) => p.type === "month")?.value);
	return { year, month0: month - 1 };
}

/**
 * Returns the UTC instants for the given month boundaries *as observed* in `timeZone`.
 * This avoids production (UTC) vs local timezone drift when deciding what "this month" means.
 */
export function getMonthRangeInTimeZone(
	baseDate: Date = new Date(),
	timeZone: string = "America/Sao_Paulo",
): MonthRange {
	const { year, month0 } = getYearMonthInTz(baseDate, timeZone);

	// Local midnight in TZ, converted to UTC by subtracting the TZ offset.
	const localMidnightApproxUtc = new Date(Date.UTC(year, month0, 1, 0, 0, 0));
	const offsetMin = getTzOffsetMinutes(localMidnightApproxUtc, timeZone);
	const start = new Date(localMidnightApproxUtc.getTime() - offsetMin * 60_000);

	const nextLocalMidnightApproxUtc = new Date(Date.UTC(year, month0 + 1, 1, 0, 0, 0));
	const nextOffsetMin = getTzOffsetMinutes(nextLocalMidnightApproxUtc, timeZone);
	const end = new Date(nextLocalMidnightApproxUtc.getTime() - nextOffsetMin * 60_000);

	return { start, end };
}

