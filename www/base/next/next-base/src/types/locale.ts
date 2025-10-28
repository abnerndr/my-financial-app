const locales: Record<string, Locale> = {
	PT_BR: 'pt-BR',
	EN_US: 'en-US',
	DE_DE: 'de-DE',
	EN_GB: 'en-GB',
	JA_JP: 'ja-JP',
	EN_AU: 'en-AU',
	EN_CA: 'en-CA',
	DE_CH: 'de-CH',
	ZH_CN: 'zh-CN',
	SV_SE: 'sv-SE',
	EN_NZ: 'en-NZ',
};

export type Locale =
	| 'en-US'
	| 'pt-BR'
	| 'es-ES'
	| 'fr-FR'
	| 'en-GB'
	| 'de-DE'
	| 'it-IT'
	| 'ja-JP'
	| 'zh-CN'
	| 'ru-RU'
	| 'en-AU'
	| 'en-CA'
	| 'de-CH'
	| 'sv-SE'
	| 'en-NZ';
export const LocaleEnum = Object.freeze(locales);
