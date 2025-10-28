const currencies: Record<Currency, Currency> = {
	BRL: 'BRL',
	USD: 'USD',
	EUR: 'EUR',
	GBP: 'GBP',
	JPY: 'JPY',
	AUD: 'AUD',
	CAD: 'CAD',
	CHF: 'CHF',
	CNY: 'CNY',
	SEK: 'SEK',
	NZD: 'NZD',
};
export type Currency =
	| 'BRL'
	| 'USD'
	| 'EUR'
	| 'GBP'
	| 'JPY'
	| 'AUD'
	| 'CAD'
	| 'CHF'
	| 'CNY'
	| 'SEK'
	| 'NZD';
export const CurrencyEnum = Object.freeze(currencies);
