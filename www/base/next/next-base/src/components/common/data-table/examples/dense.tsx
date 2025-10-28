import { TableDense, type TableDenseItem } from '../dense';

// Dados de exemplo
const defaultItems: TableDenseItem[] = [
	{
		id: '1',
		name: 'JavaScript',
		releaseYear: '1995',
		developer: 'Brendan Eich',
		typing: 'Dynamic',
		paradigm: 'Multi-paradigm',
		extension: '.js',
		latestVersion: 'ES2021',
		popularity: 'High',
	},
	{
		id: '2',
		name: 'Python',
		releaseYear: '1991',
		developer: 'Guido van Rossum',
		typing: 'Dynamic',
		paradigm: 'Multi-paradigm',
		extension: '.py',
		latestVersion: '3.10',
		popularity: 'High',
	},
	{
		id: '3',
		name: 'Java',
		releaseYear: '1995',
		developer: 'James Gosling',
		typing: 'Static',
		paradigm: 'Object-oriented',
		extension: '.java',
		latestVersion: '17',
		popularity: 'High',
	},
	{
		id: '4',
		name: 'C++',
		releaseYear: '1985',
		developer: 'Bjarne Stroustrup',
		typing: 'Static',
		paradigm: 'Multi-paradigm',
		extension: '.cpp',
		latestVersion: 'C++20',
		popularity: 'High',
	},
	{
		id: '5',
		name: 'Ruby',
		releaseYear: '1995',
		developer: 'Yukihiro Matsumoto',
		typing: 'Dynamic',
		paradigm: 'Multi-paradigm',
		extension: '.rb',
		latestVersion: '3.0',
		popularity: 'Low',
	},
];

// Exemplo de uso básico
export function ExampleTableDense() {
	const handleRowClick = (item: TableDenseItem) => {
		console.log('Clicked on:', item.name);
	};

	return (
		<TableDense
			items={defaultItems}
			title="Programming Languages"
			onRowClick={handleRowClick}
		/>
	);
}

// Exemplo com colunas customizadas
export function ExampleCustomTableDense() {
	const customColumns = [
		{
			header: 'Language',
			accessor: ((item: TableDenseItem) => (
				<div>
					<div className="font-medium">{item.name}</div>
					<div className="text-xs text-muted-foreground">
						Released in {item.releaseYear}
					</div>
				</div>
			)) as (item: TableDenseItem) => React.ReactNode,
		},
		{
			header: 'Creator',
			accessor: 'developer' as keyof TableDenseItem,
		},
		{
			header: 'Type System',
			accessor: 'typing' as keyof TableDenseItem,
		},
		{
			header: 'Latest',
			accessor: 'latestVersion' as keyof TableDenseItem,
			className: 'font-mono text-xs',
		},
	];

	return (
		<TableDense
			items={defaultItems}
			customColumns={customColumns}
			title="Custom Dense Layout"
			headerClassName="bg-slate-100 dark:bg-slate-800"
			cellClassName="py-1"
		/>
	);
}

// Exemplo compacto
export function ExampleCompactTable() {
	return (
		<TableDense
			items={defaultItems.slice(0, 3)}
			title="Compact View"
			cellClassName="py-1 text-sm"
			headerClassName="bg-muted/30"
		/>
	);
}
