import type { Currency } from '@/types/currency';
import type { Locale } from '@/types/locale';

export class CurrencyHelper {
	static mask(
		value: number,
		locale: Locale = 'en-US',
		currency: Currency = 'BRL',
	): string {
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency: currency,
		}).format(value);
	}

	static unmask(value: string): number {
		const nonNumeric = value.replace(/[\d]/g, '').replace(/\s/g, '');
		const regex = new RegExp(`[${nonNumeric}]`, 'g');
		const numericString = value.replace(regex, '').replace(',', '.');
		return parseFloat(numericString) || 0;
	}

	static getLocaleByCurrency(currency: Currency): Locale {
		const currencyLocaleMap: Record<Currency, Locale> = {
			BRL: 'pt-BR',
			USD: 'en-US',
			EUR: 'de-DE',
			GBP: 'en-GB',
			JPY: 'ja-JP',
			AUD: 'en-AU',
			CAD: 'en-CA',
			CHF: 'de-CH',
			CNY: 'zh-CN',
			SEK: 'sv-SE',
			NZD: 'en-NZ',
		};
		return currencyLocaleMap[currency] || 'en-US';
	}

	static getSymbol(currency: Currency): string {
		return (0)
			.toLocaleString(CurrencyHelper.getLocaleByCurrency(currency), {
				style: 'currency',
				currency: currency,
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			})
			.replace(/\d/g, '')
			.trim();
	}
}
