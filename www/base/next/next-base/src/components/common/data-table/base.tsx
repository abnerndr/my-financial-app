'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

// Interface para definir a estrutura dos dados
export interface TableBaseItem {
	id: string;
	name: string;
	username?: string;
	image?: string;
	email: string;
	location: string;
	status: string;
	balance: string;
}

// Interface para as props do componente
export interface TableBaseProps {
	items: TableBaseItem[];
	title?: string;
	className?: string;
	imageSize?: number;
	showUsername?: boolean;
	onRowClick?: (item: TableBaseItem) => void;
	customColumns?: {
		header: string;
		accessor: keyof TableBaseItem | ((item: TableBaseItem) => ReactNode);
		className?: string;
	}[];
}

export function TableBase({
	items,
	title = 'Table with images',
	className,
	imageSize = 40,
	showUsername = true,
	onRowClick,
	customColumns,
}: TableBaseProps) {
	// Se customColumns foi fornecido, usar essas colunas
	if (customColumns) {
		return (
			<div className={className}>
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							{customColumns.map((column) => (
								<TableHead key={column.header} className={column.className}>
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
									<TableCell key={column.header} className={column.className}>
										{typeof column.accessor === 'function'
											? column.accessor(item)
											: item[column.accessor]}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
				{title && (
					<p className="mt-4 text-center text-sm text-muted-foreground">{title}</p>
				)}
			</div>
		);
	}

	// Layout padrão com imagens
	return (
		<div className={className}>
			<Table>
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Location</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Balance</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((item) => (
						<TableRow
							key={item.id}
							className={onRowClick ? 'cursor-pointer' : undefined}
							onClick={() => onRowClick?.(item)}
						>
							<TableCell>
								<div className="flex items-center gap-3">
									{item.image && (
										<Image
											className="rounded-full"
											src={item.image}
											width={imageSize}
											height={imageSize}
											alt={item.name}
										/>
									)}
									<div>
										<div className="font-medium">{item.name}</div>
										{showUsername && item.username && (
											<span className="mt-0.5 text-xs text-muted-foreground">
												{item.username}
											</span>
										)}
									</div>
								</div>
							</TableCell>
							<TableCell>{item.email}</TableCell>
							<TableCell>{item.location}</TableCell>
							<TableCell>{item.status}</TableCell>
							<TableCell className="text-right">{item.balance}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{title && <p className="mt-4 text-center text-sm text-muted-foreground">{title}</p>}
		</div>
	);
}
