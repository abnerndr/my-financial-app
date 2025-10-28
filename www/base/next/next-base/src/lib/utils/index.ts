import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function handleCopyToClipboard(text: string) {
	if (navigator.clipboard && window.isSecureContext) {
		return navigator.clipboard.writeText(text);
	} else {
		// text area method
		const textArea = document.createElement('textarea');
		textArea.value = text;
		// make the textarea out of viewport
		textArea.style.position = 'absolute';
		textArea.style.left = '-999999px';
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		return new Promise<void>((res, rej) => {
			// here the magic happens
			if (document.execCommand('copy')) {
				res();
			} else {
				rej();
			}
			textArea.remove();
		});
	}
}
