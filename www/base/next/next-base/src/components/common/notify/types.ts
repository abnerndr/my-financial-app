export type NotifyVariant =
	| 'warning'
	| 'error'
	| 'success'
	| 'info'
	| 'privacy'
	| 'update'
	| 'mention'
	| 'reminder'
	| 'neutral';

export interface NotifyConfig {
	title: string;
	description?: string;
	primaryAction?: {
		label: string;
		onClick: () => void;
	};
	secondaryAction?: {
		label: string;
		onClick: () => void;
	};
	dismissible?: boolean;
	duration?: number;
	position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}
