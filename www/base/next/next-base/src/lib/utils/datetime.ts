import type { Locale } from '@/types/locale';

export class DateTimeUtils {
	static timezones() {
		return Intl.supportedValuesOf('timeZone');
	}

	static formatterToTimezone(timezone: string, locales: Locale = 'en-US') {
		return new Intl.DateTimeFormat(locales, {
			timeZone: timezone,
			timeZoneName: 'shortOffset',
		});
	}
}
