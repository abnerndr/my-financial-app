import {
	DateFieldRangePicker,
	type DateFieldRangePickerProps,
} from './components/date-field-range-picker';
import {
	DateFieldSimple,
	type DateFieldSimpleProps,
} from './components/date-field-simple';

export const DateFieldBase = {
	Simple: DateFieldSimple,
	Range: DateFieldRangePicker,
};

export type { DateFieldRangePickerProps, DateFieldSimpleProps };
