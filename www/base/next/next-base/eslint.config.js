import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	// Global ignores
	{
		ignores: [
			'.next/**',
			'node_modules/**',
			'dist/**',
			'build/**',
			'coverage/**',
			'*.d.ts',
			'*.min.js',
			'**/*.config.js',
			'**/*.config.ts',
			'**/tailwind.config.*',
			'**/postcss.config.*',
		],
	},
	// Configuration for source files only
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	{
		files: ['src/**/*.{js,jsx,ts,tsx}'],
		rules: {
			// Complexity rules (similar to Biome)
			'no-unused-vars': 'off', // Disabled like in Biome
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
				},
			],
			'prefer-const': 'warn',
			'no-useless-return': 'warn',

			// A11y rules (similar to Biome)
			'jsx-a11y/click-events-have-key-events': 'warn',
			'jsx-a11y/interactive-supports-focus': 'warn',
			'jsx-a11y/aria-props': 'warn',

			// Correctness rules
			'react-hooks/exhaustive-deps': 'warn',

			// Suspicious rules (similar to Biome)
			'react/no-array-index-key': 'off', // Disabled like in Biome

			// Additional rules to match Biome behavior
			'no-console': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-empty-function': 'off',
			'react/react-in-jsx-scope': 'off', // Not needed in Next.js
			'react/prop-types': 'off', // Using TypeScript
		},
	},
];

export default eslintConfig;
