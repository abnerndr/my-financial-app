import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

// Interface para definir a estrutura dos dados
export interface TableDenseItem {
	id: string;
	name: string;
	releaseYear: string;
	developer: string;
	typing: string;
	paradigm: string;
	extension: string;
	latestVersion: string;
	popularity: string;
}

// Interface para as props do componente
export interface TableDenseProps {
	items?: TableDenseItem[];
	title?: string;
	className?: string;
	headerClassName?: string;
	cellClassName?: string;
	onRowClick?: (item: TableDenseItem) => void;
	customColumns?: Array<{
		header: string;
		accessor: keyof TableDenseItem | ((item: TableDenseItem) => React.ReactNode);
		className?: string;
	}>;
}

export function TableDense({
	items = [],
	title = 'Dense table',
	className,
	headerClassName = 'bg-muted/50',
	cellClassName = 'py-2',
	onRowClick,
	customColumns,
}: TableDenseProps) {
	// Se customColumns foi fornecido, usar layout customizado
	if (customColumns) {
		return (
			<div className={className}>
				<div className="overflow-hidden rounded-md border bg-background">
					<Table>
						<TableHeader>
							<TableRow className={headerClassName}>
								{customColumns.map((column) => (
									<TableHead
										key={column.header}
										className={`h-9 py-2 ${column.className || ''}`}
									>
										{column.header}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{items.map((item) => (
								<TableRow
									key={item.id}
									className={onRowClick ? 'cursor-pointer' : undefined}
									onClick={() => onRowClick?.(item)}
								>
									{customColumns.map((column) => (
										<TableCell
											key={column.header}
											className={`${cellClassName} ${column.className || ''}`}
										>
											{typeof column.accessor === 'function'
												? column.accessor(item)
												: item[column.accessor]}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				{title && (
					<p className="mt-4 text-center text-sm text-muted-foreground">{title}</p>
				)}
			</div>
		);
	}

	// Layout padrão
	return (
		<div className={className}>
			<div className="overflow-hidden rounded-md border bg-background">
				<Table>
					<TableHeader>
						<TableRow className={headerClassName}>
							<TableHead className={`h-9 ${cellClassName}`}>Name</TableHead>
							<TableHead className={`h-9 ${cellClassName}`}>Release Year</TableHead>
							<TableHead className={`h-9 ${cellClassName}`}>Developer</TableHead>
							<TableHead className={`h-9 ${cellClassName}`}>Typing</TableHead>
							<TableHead className={`h-9 ${cellClassName}`}>Paradigm</TableHead>
							<TableHead className={`h-9 ${cellClassName}`}>Extension</TableHead>
							<TableHead className={`h-9 ${cellClassName}`}>Latest Version</TableHead>
							<TableHead className={`h-9 ${cellClassName}`}>Popularity</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.map((item) => (
							<TableRow
								key={item.id}
								className={onRowClick ? 'cursor-pointer' : undefined}
								onClick={() => onRowClick?.(item)}
							>
								<TableCell className={`${cellClassName} font-medium`}>
									{item.name}
								</TableCell>
								<TableCell className={cellClassName}>{item.releaseYear}</TableCell>
								<TableCell className={cellClassName}>{item.developer}</TableCell>
								<TableCell className={cellClassName}>{item.typing}</TableCell>
								<TableCell className={cellClassName}>{item.paradigm}</TableCell>
								<TableCell className={cellClassName}>{item.extension}</TableCell>
								<TableCell className={cellClassName}>{item.latestVersion}</TableCell>
								<TableCell className={cellClassName}>{item.popularity}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{title && <p className="mt-4 text-center text-sm text-muted-foreground">{title}</p>}
		</div>
	);
}
