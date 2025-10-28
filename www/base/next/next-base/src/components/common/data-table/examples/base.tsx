'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { TableBase, type TableBaseItem } from '../base';

// Dados de exemplo para demonstração
const sampleUsers: TableBaseItem[] = [
	{
		id: '1',
		name: 'Alex Thompson',
		username: '@alexthompson',
		image:
			'https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-02_upqrxi.jpg',
		email: 'alex.t@company.com',
		location: 'San Francisco, US',
		status: 'Active',
		balance: '$1,250.00',
	},
	{
		id: '2',
		name: 'Sarah Chen',
		username: '@sarahchen',
		image:
			'https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-01_ij9v7j.jpg',
		email: 'sarah.c@company.com',
		location: 'Singapore',
		status: 'Active',
		balance: '$600.00',
	},
	{
		id: '3',
		name: 'Maria Garcia',
		username: '@mariagarcia',
		image:
			'https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-03_dkeufx.jpg',
		email: 'm.garcia@company.com',
		location: 'Madrid, Spain',
		status: 'Inactive',
		balance: '$0.00',
	},
	{
		id: '4',
		name: 'David Kim',
		username: '@davidkim',
		image:
			'https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-05_cmz0mg.jpg',
		email: 'd.kim@company.com',
		location: 'Seoul, KR',
		status: 'Active',
		balance: '-$1,000.00',
	},
	{
		id: '5',
		name: 'Ana Silva',
		username: '@ana_silva',
		email: 'ana@company.com',
		location: 'São Paulo, BR',
		status: 'Pending',
		balance: '$2,500.00',
	},
];

// Exemplo básico - Tabela com imagens padrão
export function ExampleBasicTableWithImages() {
	const handleRowClick = (item: TableBaseItem) => {
		console.log('User clicked:', item.name);
		alert(`Clicked on ${item.name}`);
	};

	return (
		<div className="space-y-4">
			<div>
				<h3 className="text-lg font-semibold">Exemplo Básico</h3>
				<p className="text-sm text-muted-foreground">
					Tabela com avatares e informações de usuários
				</p>
			</div>
			<TableBase
				items={sampleUsers}
				title="Team Members"
				imageSize={48}
				onRowClick={handleRowClick}
			/>
		</div>
	);
}

// Exemplo sem imagens
export function ExampleTableWithoutImages() {
	const usersWithoutImages = sampleUsers.map((user) => ({ ...user, image: undefined }));

	return (
		<div className="space-y-4">
			<div>
				<h3 className="text-lg font-semibold">Sem Imagens</h3>
				<p className="text-sm text-muted-foreground">Tabela de usuários sem avatares</p>
			</div>
			<TableBase
				items={usersWithoutImages}
				title="Users List (No Avatars)"
				showUsername={false}
			/>
		</div>
	);
}

// Exemplo com colunas customizadas
export function ExampleCustomColumns() {
	const customColumns = [
		{
			header: 'User Profile',
			accessor: ((item: TableBaseItem) => (
				<div className="flex items-center gap-3">
					{item.image && (
						<Image
							className="rounded-full border-2 border-primary/20"
							src={item.image}
							width={40}
							height={40}
							alt={item.name}
						/>
					)}
					<div>
						<div className="font-medium">{item.name}</div>
						<div className="text-xs text-muted-foreground">{item.email}</div>
						{item.username && (
							<div className="text-xs text-blue-600">{item.username}</div>
						)}
					</div>
				</div>
			)) as (item: TableBaseItem) => ReactNode,
		},
		{
			header: 'Location',
			accessor: 'location' as keyof TableBaseItem,
		},
		{
			header: 'Status',
			accessor: ((item: TableBaseItem) => {
				const variant =
					item.status === 'Active'
						? 'default'
						: item.status === 'Inactive'
							? 'destructive'
							: 'secondary';
				return <Badge variant={variant}>{item.status}</Badge>;
			}) as (item: TableBaseItem) => ReactNode,
		},
		{
			header: 'Balance',
			accessor: ((item: TableBaseItem) => {
				const amount = parseFloat(item.balance.replace('$', '').replace(',', ''));
				const color = amount >= 0 ? 'text-green-600' : 'text-red-600';
				return <span className={`font-mono ${color}`}>{item.balance}</span>;
			}) as (item: TableBaseItem) => ReactNode,
			className: 'text-right',
		},
	];

	return (
		<div className="space-y-4">
			<div>
				<h3 className="text-lg font-semibold">Colunas Customizadas</h3>
				<p className="text-sm text-muted-foreground">
					Layout personalizado com badges e formatação
				</p>
			</div>
			<TableBase
				items={sampleUsers}
				customColumns={customColumns}
				title="Enhanced User Table"
			/>
		</div>
	);
}

// Exemplo compacto
export function ExampleCompactTable() {
	const compactUsers = sampleUsers.slice(0, 3);

	return (
		<div className="space-y-4">
			<div>
				<h3 className="text-lg font-semibold">Versão Compacta</h3>
				<p className="text-sm text-muted-foreground">
					Tabela menor com avatares pequenos
				</p>
			</div>
			<TableBase
				items={compactUsers}
				title="Top 3 Users"
				imageSize={32}
				className="max-w-2xl"
			/>
		</div>
	);
}

// Showcase completo
export function TableBaseShowcase() {
	return (
		<div className="space-y-12 p-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold">TableBase Component Examples</h2>
				<p className="text-muted-foreground">
					Diferentes variações da tabela com imagens
				</p>
			</div>

			<ExampleBasicTableWithImages />
			<ExampleTableWithoutImages />
			<ExampleCustomColumns />
			<ExampleCompactTable />
		</div>
	);
}
