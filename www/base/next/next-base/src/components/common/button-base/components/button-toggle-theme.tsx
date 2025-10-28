'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Toggle } from '@/components/ui/toggle';

export interface ButtonToggleThemeProps {
	defaultTheme?: 'light' | 'dark';
}

export function ButtonToggleTheme({ defaultTheme }: ButtonToggleThemeProps) {
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		if (!defaultTheme) return;
		setTheme(defaultTheme);
	}, [defaultTheme, setTheme]);

	return (
		<div>
			<Toggle
				variant="outline"
				className="group size-9 data-[state=on]:bg-transparent data-[state=on]:hover:bg-muted"
				pressed={theme === 'dark'}
				onPressedChange={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
				aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
			>
				<MoonIcon
					size={16}
					className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
					aria-hidden="true"
				/>
				<SunIcon
					size={16}
					className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
					aria-hidden="true"
				/>
			</Toggle>
		</div>
	);
}
