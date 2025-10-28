import { TableVertical, type TableVerticalItem } from '../vertical';

const defaultData: TableVerticalItem[] = [
	{ label: 'Name', value: 'David Kim' },
	{ label: 'Email', value: 'd.kim@company.com' },
	{ label: 'Location', value: 'Seoul, KR' },
	{ label: 'Status', value: 'Active' },
	{ label: 'Balance', value: '$1,000.00' },
];

export function ExampleTableVertical() {
	const handleRowClick = (item: TableVerticalItem) => {
		console.log('Clicked on:', item.label);
	};

	return (
		<TableVertical data={defaultData} title="Users Table" onRowClick={handleRowClick} />
	);
}
