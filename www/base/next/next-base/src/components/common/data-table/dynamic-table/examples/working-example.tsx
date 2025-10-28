'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DynamicDataTable } from '../dynamic-data-table';

// Exemplo simples e funcional
interface SimpleUser {
	id: string;
	name: string;
	email: string;
	status: 'Active' | 'Inactive';
}

const simpleColumns: ColumnDef<SimpleUser>[] = [
	{
		header: 'Nome',
		accessorKey: 'name',
		meta: { filterVariant: 'text' },
	},
	{
		header: 'Email',
		accessorKey: 'email',
		meta: { filterVariant: 'text' },
	},
	{
		header: 'Status',
		accessorKey: 'status',
		cell: ({ row }) => (
			<Badge variant={row.getValue('status') === 'Active' ? 'default' : 'secondary'}>
				{row.getValue('status') as string}
			</Badge>
		),
		meta: { filterVariant: 'select' },
	},
];

const sampleData: SimpleUser[] = [
	{ id: '1', name: 'João Silva', email: 'joao@test.com', status: 'Active' },
	{ id: '2', name: 'Maria Santos', email: 'maria@test.com', status: 'Inactive' },
	{ id: '3', name: 'Pedro Costa', email: 'pedro@test.com', status: 'Active' },
];

export function WorkingExample() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Tabela Dinâmica - Exemplo Funcional</h1>

			<DynamicDataTable
				data={sampleData}
				columns={simpleColumns}
				title="Usuários"
				description="Exemplo simples da tabela unificada"
				enableFilters={true}
				enablePagination={true}
				enableRowSelection={true}
				initialPageSize={2}
				searchPlaceholder="Buscar usuários..."
			/>
		</div>
	);
}
