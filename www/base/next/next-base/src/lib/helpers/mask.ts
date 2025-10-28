import type { MaskType } from '@/types/mask';

export class MaskHelper {
	static cpf(value: string): string {
		return value
			.replace(/\D/g, '')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
	}

	static cnpj(value: string): string {
		return value
			.replace(/\D/g, '')
			.replace(/(\d{2})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1/$2')
			.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
	}

	static phone(value: string): string {
		if (!value) {
			return '';
		}
		value = value.replace(/\D/g, '');
		if (value.length <= 10) {
			value = value.replace(/^(\d{2})(\d)/, '($1) $2');
			value = value.replace(/(\d{4})(\d)/, '$1-$2');
		} else {
			value = value.replace(/^(\d{2})(\d)/, '($1) $2');
			value = value.replace(/(\d{1})(\d{4})(\d)/, '$1 $2-$3');
		}
		return value;
	}

	static postalCode(value: string): string {
		return value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
	}

	static rg(value: string): string {
		return value
			.replace(/\D/g, '')
			.replace(/(\d{2})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
	}

	static currency(value: string): string {
		return value
			.replace(/\D/g, '')
			.replace(/(\d)(\d{2})$/, '$1,$2')
			.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
	}

	static mask(value: string, type: MaskType): string {
		switch (type) {
			case 'cpf':
				return MaskHelper.cpf(value);
			case 'cnpj':
				return MaskHelper.cnpj(value);
			case 'phone':
				return MaskHelper.phone(value);
			case 'currency':
				return MaskHelper.currency(value);
			default:
				return value;
		}
	}

	static time(value: string): string {
		return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})(\d{2})$/, '$1:$2:$3');
	}

	static onChangeApplyMask(e: React.ChangeEvent<HTMLInputElement>, type: MaskType): void {
		e.target.value = MaskHelper.mask(e.target.value, type);
	}
}
