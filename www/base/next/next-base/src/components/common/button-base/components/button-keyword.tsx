'use client';

import { PrinterIcon } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { Button } from '@/components/ui/button';

export interface ButtonKeywordProps extends ComponentPropsWithRef<typeof Button> {
	keyword?: string;
}

export function ButtonKeyword({ keyword, ...props }: ButtonKeywordProps) {
	return (
		<Button {...props} variant="outline">
			<PrinterIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
			{props.children}
			{keyword && (
				<kbd className="ms-1 -me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
					{keyword}
				</kbd>
			)}
		</Button>
	);
}
