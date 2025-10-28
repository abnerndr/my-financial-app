import type { ColumnDef } from '@tanstack/react-table';
import { EllipsisIcon, ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { DynamicDataTable } from '../dynamic-data-table';

// Exemplo 1: Tabela de usuários (baseada na paginated-table)
interface User {
	id: string;
	name: string;
	email: string;
	location: string;
	flag: string;
	status: 'Active' | 'Inactive' | 'Pending';
	balance: number;
}

const userColumns: ColumnDef<User>[] = [
	{
		header: 'Name',
		accessorKey: 'name',
		cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
		size: 180,
	},
	{
		header: 'Email',
		accessorKey: 'email',
		size: 200,
		meta: {
			filterVariant: 'text',
		},
	},
	{
		header: 'Location',
		accessorKey: 'location',
		cell: ({ row }) => (
			<div>
				<span className="text-lg leading-none">{row.original.flag}</span>{' '}
				{row.getValue('location')}
			</div>
		),
		size: 180,
	},
	{
		header: 'Status',
		accessorKey: 'status',
		cell: ({ row }) => (
			<Badge
				className={cn(
					row.getValue('status') === 'Inactive' &&
						'bg-muted-foreground/60 text-primary-foreground',
				)}
			>
				{row.getValue('status')}
			</Badge>
		),
		size: 120,
		meta: {
			filterVariant: 'select',
		},
	},
	{
		header: 'Balance',
		accessorKey: 'balance',
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('balance'));
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(amount);
			return formatted;
		},
		size: 120,
		meta: {
			filterVariant: 'range',
		},
	},
	{
		id: 'actions',
		header: () => <span className="sr-only">Actions</span>,
		cell: () => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="ghost" className="h-8 w-8">
						<EllipsisIcon size={16} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem>Edit</DropdownMenuItem>
					<DropdownMenuItem>Delete</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
		size: 60,
		enableHiding: false,
	},
];

// Exemplo 2: Tabela de palavras-chave (baseada na filters-table)
interface Keyword {
	id: string;
	keyword: string;
	intents: Array<'Informational' | 'Navigational' | 'Commercial' | 'Transactional'>;
	volume: number;
	cpc: number;
	traffic: number;
	link: string;
}

const keywordColumns: ColumnDef<Keyword>[] = [
	{
		header: 'Keyword',
		accessorKey: 'keyword',
		cell: ({ row }) => <div className="font-medium">{row.getValue('keyword')}</div>,
		meta: {
			filterVariant: 'text',
		},
	},
	{
		header: 'Intents',
		accessorKey: 'intents',
		cell: ({ row }) => {
			const intents = row.getValue('intents') as string[];
			return (
				<div className="flex gap-1">
					{intents.map((intent) => {
						const styles = {
							Informational: 'bg-indigo-400/20 text-indigo-500',
							Navigational: 'bg-emerald-400/20 text-emerald-500',
							Commercial: 'bg-amber-400/20 text-amber-500',
							Transactional: 'bg-rose-400/20 text-rose-500',
						}[intent];

						return (
							<div
								key={intent}
								className={cn(
									'flex size-5 items-center justify-center rounded text-xs font-medium',
									styles,
								)}
							>
								{intent.charAt(0)}
							</div>
						);
					})}
				</div>
			);
		},
		enableSorting: false,
		meta: {
			filterVariant: 'select',
		},
	},
	{
		header: 'Volume',
		accessorKey: 'volume',
		cell: ({ row }) => {
			const volume = Number(row.getValue('volume'));
			return new Intl.NumberFormat('en-US', {
				notation: 'compact',
				maximumFractionDigits: 1,
			}).format(volume);
		},
		meta: {
			filterVariant: 'range',
		},
	},
	{
		header: 'CPC',
		accessorKey: 'cpc',
		cell: ({ row }) => <div>${row.getValue('cpc')}</div>,
		meta: {
			filterVariant: 'range',
		},
	},
	{
		header: 'Traffic',
		accessorKey: 'traffic',
		cell: ({ row }) => {
			const traffic = Number(row.getValue('traffic'));
			return new Intl.NumberFormat('en-US', {
				notation: 'compact',
				maximumFractionDigits: 1,
			}).format(traffic);
		},
		meta: {
			filterVariant: 'range',
		},
	},
	{
		header: 'Link',
		accessorKey: 'link',
		cell: ({ row }) => (
			<Link className="inline-flex items-center gap-1 hover:underline" href="#">
				{row.getValue('link')} <ExternalLinkIcon size={12} aria-hidden="true" />
			</Link>
		),
		enableSorting: false,
	},
];

// Exemplo de dados de usuários
const sampleUsers: User[] = [
	{
		id: '1',
		name: 'John Doe',
		email: 'john@example.com',
		location: 'New York',
		flag: '🇺🇸',
		status: 'Active',
		balance: 1250.5,
	},
	{
		id: '2',
		name: 'Jane Smith',
		email: 'jane@example.com',
		location: 'London',
		flag: '🇬🇧',
		status: 'Inactive',
		balance: 750.25,
	},
	// ... mais dados
];

// Exemplo de dados de palavras-chave
const sampleKeywords: Keyword[] = [
	{
		id: '1',
		keyword: 'react components',
		intents: ['Informational', 'Navigational'],
		volume: 2507,
		cpc: 2.5,
		traffic: 88,
		link: 'https://example.com',
	},
	{
		id: '2',
		keyword: 'buy react templates',
		intents: ['Commercial', 'Transactional'],
		volume: 1850,
		cpc: 4.75,
		traffic: 65,
		link: 'https://example.com/templates',
	},
	// ... mais dados
];

// Exemplos de uso da tabela dinâmica

// 1. Tabela simples com paginação apenas
export function SimpleTable() {
	return (
		<DynamicDataTable
			data={sampleUsers}
			columns={userColumns}
			enableFilters={false}
			enableColumnVisibility={false}
			enableRowSelection={false}
			title="Simple User Table"
			description="A basic table with only pagination"
		/>
	);
}

// 2. Tabela completa com todas as funcionalidades
export function FullFeaturedTable() {
	return (
		<DynamicDataTable
			data={sampleUsers}
			columns={userColumns}
			title="Complete User Management"
			description="Table with all features enabled"
			searchPlaceholder="Search users by name or email..."
			searchColumns={['name', 'email']}
			showAddButton={true}
			showDeleteButton={true}
			onAddClick={() => alert('Add user clicked')}
			onDeleteRows={(rows) => alert(`Delete ${rows.length} users`)}
			onRowSelectionChange={(rows) => console.log('Selected:', rows)}
		/>
	);
}

// 3. Tabela de palavras-chave com filtros personalizados
export function KeywordTable() {
	return (
		<DynamicDataTable
			data={sampleKeywords}
			columns={keywordColumns}
			title="Keyword Analysis"
			description="SEO keyword performance tracking"
			enableRowSelection={false}
			searchPlaceholder="Search keywords..."
			searchColumns={['keyword']}
			initialPageSize={5}
			pageSizeOptions={[5, 10, 20]}
		/>
	);
}

// 4. Tabela customizada com ações personalizadas
export function CustomActionsTable() {
	const customActions = (
		<div className="flex gap-2">
			<Button variant="outline" size="sm">
				Export
			</Button>
			<Button variant="outline" size="sm">
				Import
			</Button>
		</div>
	);

	return (
		<DynamicDataTable
			data={sampleUsers}
			columns={userColumns}
			title="Users with Custom Actions"
			customActions={customActions}
			enableGlobalFilter={true}
			enableFilters={true}
			searchPlaceholder="Global search..."
		/>
	);
}

// 5. Tabela com estado de loading
export function LoadingTable() {
	return (
		<DynamicDataTable
			data={[]}
			columns={userColumns}
			isLoading={true}
			loadingComponent={<div className="text-center py-8">Loading users...</div>}
		/>
	);
}
