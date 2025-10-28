// Exportações dos componentes reutilizáveis de data-table
import { TableBase, type TableBaseItem, type TableBaseProps } from './base';
import { TableCard, type TableCardItem, type TableCardProps } from './card';
import { TableDense } from './dense';
import {
	TableVertical,
	type TableVerticalItem,
	type TableVerticalProps,
} from './vertical';

export const DataTable = {
	Base: TableBase,
	Card: TableCard,
	Dense: TableDense,
	Vertical: TableVertical,
};

export type {
	TableBaseItem,
	TableBaseProps,
	TableCardItem,
	TableCardProps,
	TableVerticalItem,
	TableVerticalProps,
};
