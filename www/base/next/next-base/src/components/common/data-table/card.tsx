import { useId, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

export interface TableCardItem {
	id: string;
	name: string;
	email: string;
	location: string;
	status: string;
	balance: string;
}

export interface TableCardProps {
	items?: TableCardItem[];
	title?: string;
	className?: string;
	showCheckboxes?: boolean;
	showFooter?: boolean;
	footerTotal?: string;
	onRowClick?: (item: TableCardItem) => void;
	onSelectionChange?: (selectedItems: TableCardItem[]) => void;
}

export function TableCard({
	items = [],
	title = 'Card Table',
	className,
	showCheckboxes = true,
	showFooter = true,
	footerTotal = '$2,500.00',
	onRowClick,
	onSelectionChange,
}: TableCardProps) {
	const id = useId();
	const [selectedItems, setSelectedItems] = useState<string[]>([]);

	const handleSelectAll = () => {
		if (selectedItems.length === items.length) {
			setSelectedItems([]);
			onSelectionChange?.([]);
		} else {
			const allIds = items.map((item) => item.id);
			setSelectedItems(allIds);
			onSelectionChange?.(items);
		}
	};

	const handleSelectItem = (itemId: string) => {
		const newSelected = selectedItems.includes(itemId)
			? selectedItems.filter((id: string) => id !== itemId)
			: [...selectedItems, itemId];

		setSelectedItems(newSelected);

		const selectedItemsData = items.filter((item) => newSelected.includes(item.id));
		onSelectionChange?.(selectedItemsData);
	};

	const isAllSelected = selectedItems.length === items.length && items.length > 0;

	return (
		<div className={className}>
			<div className="overflow-hidden rounded-md border bg-background">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							{showCheckboxes && (
								<TableHead className="h-11">
									<Checkbox
										id={`${id}-select-all`}
										checked={isAllSelected}
										onCheckedChange={handleSelectAll}
									/>
								</TableHead>
							)}
							<TableHead className="h-11">Name</TableHead>
							<TableHead className="h-11">Email</TableHead>
							<TableHead className="h-11">Location</TableHead>
							<TableHead className="h-11">Status</TableHead>
							<TableHead className="h-11 text-right">Balance</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.map((item) => (
							<TableRow
								key={item.id}
								className={onRowClick ? 'cursor-pointer' : undefined}
								onClick={() => onRowClick?.(item)}
							>
								{showCheckboxes && (
									<TableCell>
										<Checkbox
											id={`${id}-${item.id}`}
											checked={selectedItems.includes(item.id)}
											onCheckedChange={() => handleSelectItem(item.id)}
											onClick={(e) => e.stopPropagation()}
										/>
									</TableCell>
								)}
								<TableCell className="font-medium">{item.name}</TableCell>
								<TableCell>{item.email}</TableCell>
								<TableCell>{item.location}</TableCell>
								<TableCell>{item.status}</TableCell>
								<TableCell className="text-right">{item.balance}</TableCell>
							</TableRow>
						))}
					</TableBody>
					{showFooter && (
						<TableFooter className="bg-transparent">
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={showCheckboxes ? 5 : 4}>Total</TableCell>
								<TableCell className="text-right">{footerTotal}</TableCell>
							</TableRow>
						</TableFooter>
					)}
				</Table>
			</div>
			{title && <p className="mt-4 text-center text-sm text-muted-foreground">{title}</p>}
		</div>
	);
}
