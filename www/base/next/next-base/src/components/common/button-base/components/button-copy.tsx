'use client';

import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface ButtonCopyProps {
	handleCopy(text: string): Promise<void>;
	text: string;
}

export function ButtonCopy({ handleCopy, text }: ButtonCopyProps) {
	const [copied, setCopied] = useState(false);
	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon"
						className="disabled:opacity-100"
						onClick={() =>
							handleCopy(text ?? '').then(() => {
								setCopied(true);
								setTimeout(() => setCopied(false), 2000);
							})
						}
						aria-label={copied ? 'Copied' : 'Copy to clipboard'}
						disabled={copied}
					>
						<div
							className={cn(
								'transition-all',
								copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
							)}
						>
							<CheckIcon className="stroke-emerald-500" size={16} aria-hidden="true" />
						</div>
						<div
							className={cn(
								'absolute transition-all',
								copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
							)}
						>
							<CopyIcon size={16} aria-hidden="true" />
						</div>
					</Button>
				</TooltipTrigger>
				<TooltipContent className="px-2 py-1 text-xs">Clique para copiar</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
