import { TableCard, type TableCardItem } from '../card';

const defaultItems: TableCardItem[] = [
	{
		id: '1',
		name: 'Alex Thompson',
		email: 'alex.t@company.com',
		location: 'San Francisco, US',
		status: 'Active',
		balance: '$1,250.00',
	},
	{
		id: '2',
		name: 'Sarah Chen',
		email: 'sarah.c@company.com',
		location: 'Singapore',
		status: 'Active',
		balance: '$600.00',
	},
	{
		id: '3',
		name: 'James Wilson',
		email: 'j.wilson@company.com',
		location: 'London, UK',
		status: 'Inactive',
		balance: '$650.00',
	},
];

export function ExampleCardTable() {
	const handleRowClick = (item: TableCardItem) => {
		console.log('Clicked on:', item.name);
	};

	return (
		<TableCard items={defaultItems} title="Users Table" onRowClick={handleRowClick} />
	);
}
