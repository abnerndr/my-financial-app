'use client';

import {
	type Column,
	type ColumnDef,
	type ColumnFiltersState,
	type FilterFn,
	type PaginationState,
	type RowData,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedMinMaxValues,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {
	ChevronDownIcon,
	ChevronFirstIcon,
	ChevronLastIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronUpIcon,
	CircleAlertIcon,
	CircleXIcon,
	Columns3Icon,
	FilterIcon,
	PlusIcon,
	SearchIcon,
	TrashIcon,
} from 'lucide-react';
import { type ReactNode, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

declare module '@tanstack/react-table' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		filterVariant?: 'text' | 'range' | 'select';
	}
}

export interface DynamicDataTableProps<TData = unknown> {
	data: TData[];
	columns: ColumnDef<TData>[];
	// Configurações opcionais
	enableFilters?: boolean;
	enablePagination?: boolean;
	enableColumnVisibility?: boolean;
	enableRowSelection?: boolean;
	enableSorting?: boolean;
	enableGlobalFilter?: boolean;
	enableMultiRowSelection?: boolean;
	// Configurações de paginação
	initialPageSize?: number;
	pageSizeOptions?: number[];
	// Configurações de filtros
	searchPlaceholder?: string;
	searchColumns?: string[];
	// Callbacks
	onRowSelectionChange?: (selectedRows: TData[]) => void;
	onDataChange?: (newData: TData[]) => void;
	// Ações customizadas
	customActions?: ReactNode;
	showAddButton?: boolean;
	showDeleteButton?: boolean;
	onAddClick?: () => void;
	onDeleteRows?: (selectedRows: TData[]) => void;
	// Estilo
	className?: string;
	tableClassName?: string;
	// Loading state
	isLoading?: boolean;
	loadingComponent?: ReactNode;
	// Empty state
	emptyMessage?: string;
	// Global filter function
	globalFilterFn?: FilterFn<TData>;
	// Título da tabela
	title?: string;
	description?: string;
}

export function DynamicDataTable<TData = unknown>({
	data,
	columns,
	enableFilters = true,
	enablePagination = true,
	enableColumnVisibility = true,
	enableRowSelection = true,
	enableSorting = true,
	enableGlobalFilter = true,
	enableMultiRowSelection = true,
	initialPageSize = 10,
	pageSizeOptions = [5, 10, 25, 50],
	searchPlaceholder = 'Search...',
	searchColumns = [],
	onRowSelectionChange,
	onDataChange,
	customActions,
	showAddButton = false,
	showDeleteButton = true,
	onAddClick,
	onDeleteRows,
	className,
	tableClassName,
	isLoading = false,
	loadingComponent,
	emptyMessage = 'No results found.',
	globalFilterFn,
	title,
	description,
}: DynamicDataTableProps<TData>) {
	const id = useId();
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: initialPageSize,
	});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState('');
	const [internalData, setInternalData] = useState<TData[]>(data);
	const inputRef = useRef<HTMLInputElement>(null);

	// Atualizar dados internos quando os dados externos mudarem
	useEffect(() => {
		setInternalData(data);
	}, [data]);

	// Custom global filter function
	const defaultGlobalFilterFn: FilterFn<TData> = (row, _columnId, filterValue) => {
		const searchValue = (filterValue ?? '').toLowerCase();

		// Se searchColumns foi especificado, buscar apenas nessas colunas
		if (searchColumns.length > 0) {
			const searchableContent = searchColumns
				.map((col) => {
					const value = (row.original as Record<string, unknown>)[col];
					return String(value ?? '');
				})
				.join(' ')
				.toLowerCase();
			return searchableContent.includes(searchValue);
		}

		// Caso contrário, buscar em todas as colunas visíveis
		try {
			const searchableContent = Object.values(row.original as Record<string, unknown>)
				.map((value) => String(value ?? ''))
				.join(' ')
				.toLowerCase();
			return searchableContent.includes(searchValue);
		} catch {
			// Fallback se não for possível acessar os valores
			return String(row.original).toLowerCase().includes(searchValue);
		}
	};

	const handleDeleteRows = () => {
		const selectedRows = table.getSelectedRowModel().rows;
		const selectedData = selectedRows.map((row) => row.original);

		if (onDeleteRows) {
			onDeleteRows(selectedData);
		} else {
			const updatedData = internalData.filter((item) => !selectedRows.some((row) => row.original === item));
			setInternalData(updatedData);
			onDataChange?.(updatedData);
		}

		table.resetRowSelection();
	};

	// Configurar colunas com seleção se habilitado
	const tableColumns = useMemo(() => {
		const cols = [...columns];

		if (enableRowSelection) {
			const selectColumn: ColumnDef<TData> = {
				id: 'select',
				header: enableMultiRowSelection
					? ({ table }) => (
							<Checkbox
								checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
								onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
								aria-label="Select all"
							/>
						)
					: '',
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Select row"
					/>
				),
				size: 28,
				enableSorting: false,
				enableHiding: false,
			};

			cols.unshift(selectColumn);
		}

		return cols;
	}, [columns, enableRowSelection, enableMultiRowSelection]);

	const table = useReactTable({
		data: internalData,
		columns: tableColumns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
		onSortingChange: enableSorting ? setSorting : undefined,
		enableSortingRemoval: false,
		getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
		onPaginationChange: enablePagination ? setPagination : undefined,
		onColumnFiltersChange: enableFilters ? setColumnFilters : undefined,
		onColumnVisibilityChange: enableColumnVisibility ? setColumnVisibility : undefined,
		getFilteredRowModel: enableFilters ? getFilteredRowModel() : undefined,
		getFacetedRowModel: enableFilters ? getFacetedRowModel() : undefined,
		getFacetedUniqueValues: enableFilters ? getFacetedUniqueValues() : undefined,
		getFacetedMinMaxValues: enableFilters ? getFacetedMinMaxValues() : undefined,
		onGlobalFilterChange: enableGlobalFilter ? setGlobalFilter : undefined,
		globalFilterFn: globalFilterFn || defaultGlobalFilterFn,
		state: {
			...(enableSorting && { sorting }),
			...(enablePagination && { pagination }),
			...(enableFilters && { columnFilters }),
			...(enableColumnVisibility && { columnVisibility }),
			...(enableGlobalFilter && { globalFilter }),
		},
	});

	// Callback para mudanças na seleção
	useEffect(() => {
		if (onRowSelectionChange) {
			const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
			onRowSelectionChange(selectedRows);
		}
	}, [table, onRowSelectionChange]);

	if (isLoading) {
		return loadingComponent || <div className="flex items-center justify-center h-32">Loading...</div>;
	}

	return (
		<div className={cn('space-y-4', className)}>
			{/* Header */}
			{(title || description) && (
				<div className="space-y-1">
					{title && <h2 className="text-lg font-semibold">{title}</h2>}
					{description && <p className="text-sm text-muted-foreground">{description}</p>}
				</div>
			)}

			{/* Filters and Actions */}
			{(enableGlobalFilter ||
				enableFilters ||
				enableColumnVisibility ||
				customActions ||
				showAddButton ||
				showDeleteButton) && (
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="flex items-center gap-3 flex-wrap">
						{/* Global Search */}
						{enableGlobalFilter && (
							<div className="relative">
								<Input
									ref={inputRef}
									className={cn('min-w-60 ps-9', Boolean(globalFilter) && 'pe-9')}
									value={globalFilter}
									onChange={(e) => setGlobalFilter(e.target.value)}
									placeholder={searchPlaceholder}
									type="text"
									aria-label="Global search"
								/>
								<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80">
									<SearchIcon size={16} aria-hidden="true" />
								</div>
								{Boolean(globalFilter) && (
									<button
										className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-colors outline-none hover:text-foreground focus:z-10 focus-visible:ring-2 focus-visible:ring-ring"
										aria-label="Clear search"
										onClick={() => {
											setGlobalFilter('');
											inputRef.current?.focus();
										}}
									>
										<CircleXIcon size={16} aria-hidden="true" />
									</button>
								)}
							</div>
						)}

						{/* Column Filters */}
						{enableFilters && (
							<div className="flex gap-2 flex-wrap">
								{table
									.getAllColumns()
									.filter((column) => column.getCanFilter() && column.columnDef.meta?.filterVariant)
									.map((column) => (
										<FilterComponent key={column.id} column={column} />
									))}
							</div>
						)}

						{/* Column Visibility */}
						{enableColumnVisibility && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline">
										<Columns3Icon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
										View
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
									{table
										.getAllColumns()
										.filter((column) => column.getCanHide())
										.map((column) => (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) => column.toggleVisibility(!!value)}
												onSelect={(event) => event.preventDefault()}
											>
												{column.id}
											</DropdownMenuCheckboxItem>
										))}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>

					<div className="flex items-center gap-3">
						{/* Custom Actions */}
						{customActions}

						{/* Delete button */}
						{enableRowSelection && showDeleteButton && table.getSelectedRowModel().rows.length > 0 && (
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="outline">
										<TrashIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
										Delete
										<span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
											{table.getSelectedRowModel().rows.length}
										</span>
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
										<div
											className="flex size-9 shrink-0 items-center justify-center rounded-full border"
											aria-hidden="true"
										>
											<CircleAlertIcon className="opacity-80" size={16} />
										</div>
										<AlertDialogHeader>
											<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently delete{' '}
												{table.getSelectedRowModel().rows.length} selected{' '}
												{table.getSelectedRowModel().rows.length === 1 ? 'row' : 'rows'}.
											</AlertDialogDescription>
										</AlertDialogHeader>
									</div>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction onClick={handleDeleteRows}>Delete</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						)}

						{/* Add button */}
						{showAddButton && (
							<Button variant="outline" onClick={onAddClick}>
								<PlusIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
								Add
							</Button>
						)}
					</div>
				</div>
			)}

			{/* Table */}
			<div className="overflow-hidden rounded-md border bg-background">
				<Table className={cn('table-fixed', tableClassName)}>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="hover:bg-transparent">
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										style={{
											width: header.getSize() ? `${header.getSize()}px` : undefined,
										}}
										className="h-11"
									>
										{header.isPlaceholder ? null : header.column.getCanSort() ? (
											<button
												className={cn('flex h-full cursor-pointer items-center justify-between gap-2 select-none')}
												onClick={header.column.getToggleSortingHandler()}
												onKeyDown={(e) => {
													if (header.column.getCanSort() && (e.key === 'Enter' || e.key === ' ')) {
														e.preventDefault();
														header.column.getToggleSortingHandler()?.(e);
													}
												}}
												tabIndex={header.column.getCanSort() ? 0 : undefined}
											>
												{flexRender(header.column.columnDef.header, header.getContext())}
												{{
													asc: <ChevronUpIcon className="shrink-0 opacity-60" size={16} aria-hidden="true" />,
													desc: <ChevronDownIcon className="shrink-0 opacity-60" size={16} aria-hidden="true" />,
												}[header.column.getIsSorted() as string] ?? null}
											</button>
										) : (
											flexRender(header.column.columnDef.header, header.getContext())
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={tableColumns.length} className="h-24 text-center">
									{emptyMessage}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{enablePagination && (
				<div className="flex items-center justify-between gap-8">
					{/* Results per page */}
					<div className="flex items-center gap-3">
						<Label htmlFor={`${id}-page-size`} className="max-sm:sr-only">
							Rows per page
						</Label>
						<Select
							value={table.getState().pagination.pageSize.toString()}
							onValueChange={(value) => table.setPageSize(Number(value))}
						>
							<SelectTrigger id={`${id}-page-size`} className="w-fit whitespace-nowrap">
								<SelectValue placeholder="Select number of results" />
							</SelectTrigger>
							<SelectContent>
								{pageSizeOptions.map((pageSize) => (
									<SelectItem key={pageSize} value={pageSize.toString()}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Page information */}
					<div className="flex grow justify-end text-sm whitespace-nowrap text-muted-foreground">
						<p aria-live="polite">
							<span className="text-foreground">
								{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
								{Math.min(
									(table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
									table.getFilteredRowModel().rows.length,
								)}
							</span>{' '}
							of <span className="text-foreground">{table.getFilteredRowModel().rows.length}</span>
						</p>
					</div>

					{/* Pagination controls */}
					<div>
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<Button
										size="icon"
										variant="outline"
										onClick={() => table.firstPage()}
										disabled={!table.getCanPreviousPage()}
										aria-label="Go to first page"
									>
										<ChevronFirstIcon size={16} aria-hidden="true" />
									</Button>
								</PaginationItem>
								<PaginationItem>
									<Button
										size="icon"
										variant="outline"
										onClick={() => table.previousPage()}
										disabled={!table.getCanPreviousPage()}
										aria-label="Go to previous page"
									>
										<ChevronLeftIcon size={16} aria-hidden="true" />
									</Button>
								</PaginationItem>
								<PaginationItem>
									<Button
										size="icon"
										variant="outline"
										onClick={() => table.nextPage()}
										disabled={!table.getCanNextPage()}
										aria-label="Go to next page"
									>
										<ChevronRightIcon size={16} aria-hidden="true" />
									</Button>
								</PaginationItem>
								<PaginationItem>
									<Button
										size="icon"
										variant="outline"
										onClick={() => table.lastPage()}
										disabled={!table.getCanNextPage()}
										aria-label="Go to last page"
									>
										<ChevronLastIcon size={16} aria-hidden="true" />
									</Button>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				</div>
			)}
		</div>
	);
}

// Componente de filtro reutilizável
function FilterComponent<TData>({ column }: { column: Column<TData, unknown> }) {
	const columnFilterValue = column.getFilterValue();
	const { filterVariant } = column.columnDef.meta ?? {};
	const columnHeader = typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id;

	const sortedUniqueValues = useMemo(() => {
		if (filterVariant === 'range') return [];

		const facetedValues = column.getFacetedUniqueValues();
		const values = Array.from(facetedValues.keys());
		const flattenedValues = values.reduce((acc: string[], curr) => {
			if (Array.isArray(curr)) {
				acc.push(...curr);
				return acc;
			}
			acc.push(String(curr));
			return acc;
		}, []);

		return Array.from(new Set(flattenedValues)).sort();
	}, [column, filterVariant]);

	if (filterVariant === 'range') {
		return (
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline" size="sm">
						<FilterIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
						{columnHeader}
						{(columnFilterValue as [number, number])?.some(Boolean) && (
							<span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
								1
							</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-3" align="start">
					<div className="space-y-3">
						<div className="text-xs font-medium text-muted-foreground">{columnHeader} Range</div>
						<div className="flex gap-2">
							<Input
								className="w-20"
								value={(columnFilterValue as [number, number])?.[0] ?? ''}
								onChange={(e) =>
									column.setFilterValue((old: [number, number]) => [
										e.target.value ? Number(e.target.value) : undefined,
										old?.[1],
									])
								}
								placeholder="Min"
								type="number"
							/>
							<Input
								className="w-20"
								value={(columnFilterValue as [number, number])?.[1] ?? ''}
								onChange={(e) =>
									column.setFilterValue((old: [number, number]) => [
										old?.[0],
										e.target.value ? Number(e.target.value) : undefined,
									])
								}
								placeholder="Max"
								type="number"
							/>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		);
	}

	if (filterVariant === 'select') {
		return (
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline" size="sm">
						<FilterIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
						{columnHeader}
						{columnFilterValue !== undefined && columnFilterValue !== null && (
							<span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
								{String(columnFilterValue)}
							</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto min-w-36 p-3" align="start">
					<div className="space-y-3">
						<div className="text-xs font-medium text-muted-foreground">{columnHeader}</div>
						<Select
							value={columnFilterValue?.toString() ?? 'all'}
							onValueChange={(value) => {
								column.setFilterValue(value === 'all' ? undefined : value);
							}}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								{sortedUniqueValues.map((value) => (
									<SelectItem key={String(value)} value={String(value)}>
										{String(value)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<div className="relative w-44">
			<Input
				className="peer ps-9"
				value={(columnFilterValue ?? '') as string}
				onChange={(e) => column.setFilterValue(e.target.value)}
				placeholder={`Filter ${columnHeader.toLowerCase()}`}
				type="text"
			/>
			<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
				<SearchIcon size={16} />
			</div>
		</div>
	);
}
