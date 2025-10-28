export class StringHelper {
	static truncate(str: string, maxLength: number): string {
		if (str.length <= maxLength) return str;
		return `${str.slice(0, maxLength)}...`;
	}

	static capitalize(str: string): string {
		if (str.length === 0) return str;
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	static initials(name: string): string {
		const names = name.split(' ');
		const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
		return initials.slice(0, 2);
	}

	static uppercase(str: string): string {
		if (str.length === 0) return str;
		return str.toUpperCase();
	}

	static lowercase(str: string): string {
		if (str.length === 0) return str;
		return str.toLowerCase();
	}

	static capitalizeWords(str: string): string {
		if (str.length === 0) return str;
		return str
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}
}
