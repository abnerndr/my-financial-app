'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DynamicDataTable } from '../dynamic-data-table';

// Exemplo de dados de usuários
interface User {
	id: string;
	name: string;
	email: string;
	status: 'Active' | 'Inactive' | 'Pending';
	role: 'Admin' | 'User' | 'Manager';
	balance: number;
	createdAt: string;
}

const sampleData: User[] = [
	{
		id: '1',
		name: 'João Silva',
		email: 'joao@example.com',
		status: 'Active',
		role: 'Admin',
		balance: 1250.5,
		createdAt: '2024-01-15',
	},
	{
		id: '2',
		name: 'Maria Santos',
		email: 'maria@example.com',
		status: 'Inactive',
		role: 'User',
		balance: 750.25,
		createdAt: '2024-01-20',
	},
	{
		id: '3',
		name: 'Pedro Oliveira',
		email: 'pedro@example.com',
		status: 'Pending',
		role: 'Manager',
		balance: 2100.0,
		createdAt: '2024-02-01',
	},
	{
		id: '4',
		name: 'Ana Costa',
		email: 'ana@example.com',
		status: 'Active',
		role: 'User',
		balance: 450.75,
		createdAt: '2024-02-10',
	},
	{
		id: '5',
		name: 'Carlos Ferreira',
		email: 'carlos@example.com',
		status: 'Active',
		role: 'Manager',
		balance: 3200.0,
		createdAt: '2024-02-15',
	},
];

// Definição das colunas
const columns: ColumnDef<User>[] = [
	{
		header: 'Nome',
		accessorKey: 'name',
		cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
		meta: {
			filterVariant: 'text',
		},
	},
	{
		header: 'Email',
		accessorKey: 'email',
		meta: {
			filterVariant: 'text',
		},
	},
	{
		header: 'Status',
		accessorKey: 'status',
		cell: ({ row }) => {
			const status = row.getValue('status') as string;
			const variant = {
				Active: 'default',
				Inactive: 'secondary',
				Pending: 'outline',
			}[status] as 'default' | 'secondary' | 'outline';

			return <Badge variant={variant}>{status}</Badge>;
		},
		meta: {
			filterVariant: 'select',
		},
	},
	{
		header: 'Função',
		accessorKey: 'role',
		meta: {
			filterVariant: 'select',
		},
	},
	{
		header: 'Saldo',
		accessorKey: 'balance',
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('balance'));
			return new Intl.NumberFormat('pt-BR', {
				style: 'currency',
				currency: 'BRL',
			}).format(amount);
		},
		meta: {
			filterVariant: 'range',
		},
	},
	{
		header: 'Criado em',
		accessorKey: 'createdAt',
		cell: ({ row }) => {
			const date = new Date(row.getValue('createdAt'));
			return date.toLocaleDateString('pt-BR');
		},
	},
];

export function ExampleUsage() {
	const [users, setUsers] = useState<User[]>(sampleData);
	const [isLoading, setIsLoading] = useState(false);

	const handleAddUser = () => {
		const newUser: User = {
			id: Date.now().toString(),
			name: 'Novo Usuário',
			email: 'novo@example.com',
			status: 'Pending',
			role: 'User',
			balance: 0,
			createdAt: new Date().toISOString().split('T')[0],
		};
		setUsers([...users, newUser]);
	};

	const handleDeleteUsers = (selectedUsers: User[]) => {
		const updatedUsers = users.filter((user) => !selectedUsers.some((selected) => selected.id === user.id));
		setUsers(updatedUsers);
	};

	const handleRefresh = async () => {
		setIsLoading(true);
		// Simular loading
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setIsLoading(false);
	};

	const customActions = (
		<div className="flex gap-2">
			<Button variant="outline" size="sm" onClick={handleRefresh}>
				Atualizar
			</Button>
			<Button variant="outline" size="sm">
				Exportar
			</Button>
		</div>
	);

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Exemplo de Uso - DynamicDataTable</h1>
				<p className="text-muted-foreground">Demonstração de todas as funcionalidades da tabela unificada</p>
			</div>

			<DynamicDataTable
				data={users}
				columns={columns}
				title="Gerenciamento de Usuários"
				description="Tabela completa com todas as funcionalidades habilitadas"
				// Estados
				isLoading={isLoading}
				loadingComponent={
					<div className="flex flex-col items-center justify-center h-32 space-y-2">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
						<p className="text-sm text-muted-foreground">Carregando usuários...</p>
					</div>
				}
				emptyMessage="Nenhum usuário encontrado"
				// Funcionalidades (todas habilitadas por padrão)
				enableFilters={true}
				enablePagination={true}
				enableRowSelection={true}
				enableSorting={true}
				enableGlobalFilter={true}
				enableColumnVisibility={true}
				// Paginação
				initialPageSize={3}
				pageSizeOptions={[3, 5, 10, 20]}
				// Busca
				searchPlaceholder="Buscar por nome ou email..."
				searchColumns={['name', 'email']}
				// Ações
				showAddButton={true}
				showDeleteButton={true}
				onAddClick={handleAddUser}
				onDeleteRows={handleDeleteUsers}
				customActions={customActions}
				// Callbacks
				onRowSelectionChange={(selectedRows) => {
					console.log('Usuários selecionados:', selectedRows);
				}}
				onDataChange={(newData) => {
					setUsers(newData);
					console.log('Dados atualizados:', newData);
				}}
			/>

			{/* Exemplos de configurações diferentes */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
				<div>
					<h2 className="text-lg font-semibold mb-4">Tabela Simples (só paginação)</h2>
					<DynamicDataTable
						data={users.slice(0, 3)}
						columns={columns.slice(0, 3)}
						enableFilters={false}
						enableRowSelection={false}
						enableColumnVisibility={false}
						enableGlobalFilter={false}
						initialPageSize={2}
						title="Tabela Básica"
					/>
				</div>

				<div>
					<h2 className="text-lg font-semibold mb-4">Tabela com Filtros (sem paginação)</h2>
					<DynamicDataTable
						data={users.slice(0, 3)}
						columns={columns.slice(0, 4)}
						enablePagination={false}
						enableRowSelection={false}
						title="Apenas Filtros"
					/>
				</div>
			</div>

			{/* Instruções de uso */}
			<div className="mt-8 p-4 bg-muted rounded-lg">
				<h3 className="font-semibold mb-2">Como usar:</h3>
				<ol className="list-decimal list-inside space-y-1 text-sm">
					<li>Teste a busca global digitando no campo de pesquisa</li>
					<li>Use os filtros por coluna (Status, Função, Saldo)</li>
					<li>Selecione linhas e teste o botão &quot;Delete&quot;</li>
					<li>Adicione novos usuários com o botão &quot;Add&quot;</li>
					<li>Altere a visualização das colunas com o botão &quot;View&quot;</li>
					<li>Teste a paginação e mudança do tamanho da página</li>
					<li>Ordene as colunas clicando nos cabeçalhos</li>
				</ol>
			</div>
		</div>
	);
}
