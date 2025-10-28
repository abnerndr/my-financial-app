import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export interface TableVerticalItem {
	label: string;
	value: string | React.ReactNode;
}

export interface TableVerticalProps {
	data?: TableVerticalItem[];
	title?: string;
	className?: string;
	maxWidth?: string;
	labelClassName?: string;
	valueClassName?: string;
	onRowClick?: (item: TableVerticalItem) => void;
}

export function createTableVerticalData(
	item: Record<string, unknown>,
): TableVerticalItem[] {
	return Object.entries(item).map(([key, value]) => ({
		label: key.charAt(0).toUpperCase() + key.slice(1),
		value: String(value),
	}));
}

export function TableVertical({
	data = [],
	title = 'Vertical table',
	className,
	maxWidth = 'max-w-lg',
	labelClassName = 'bg-muted/50 py-2 font-medium',
	valueClassName = 'py-2',
	onRowClick,
}: TableVerticalProps) {
	return (
		<div className={`mx-auto ${maxWidth} ${className || ''}`}>
			<div className="overflow-hidden rounded-md border bg-background">
				<Table>
					<TableBody>
						{data.map((item, index) => (
							<TableRow
								key={`${item.label}-${index}`}
								className={`*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r ${onRowClick ? 'cursor-pointer' : ''}`}
								onClick={() => onRowClick?.(item)}
							>
								<TableCell className={labelClassName}>{item.label}</TableCell>
								<TableCell className={valueClassName}>{item.value}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{title && <p className="mt-4 text-center text-sm text-muted-foreground">{title}</p>}
		</div>
	);
}
