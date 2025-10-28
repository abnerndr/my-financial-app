import {
	AlertTriangleIcon,
	BellIcon,
	CheckCircleIcon,
	ClockIcon,
	CookieIcon,
	DownloadIcon,
	InfoIcon,
	UserIcon,
	XCircleIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { NotifyConfig, NotifyVariant } from '../types';

// Types for notification variants

// Base notification function
export function showNotification(variant: NotifyVariant, config: NotifyConfig) {
	const { title, description, primaryAction, secondaryAction, dismissible = true } = config;

	// Get icon and styling based on variant
	const getVariantConfig = (variant: NotifyVariant) => {
		switch (variant) {
			case 'neutral':
				return {
					icon: BellIcon,
					iconColor: 'text-zinc-500',
					className: 'border-l-4 border-l-zinc-500 bg-zinc-50 text-zinc-900',
				};
			case 'warning':
				return {
					icon: AlertTriangleIcon,
					iconColor: 'text-amber-500',
					className: 'border-l-4 border-l-amber-300 bg-zinc-50 text-zinc-900',
				};
			case 'error':
				return {
					icon: XCircleIcon,
					iconColor: 'text-rose-500',
					className: 'border-l-4 border-l-rose-300 bg-zinc-50 text-zinc-900',
				};
			case 'success':
				return {
					icon: CheckCircleIcon,
					iconColor: 'text-emerald-500',
					className: 'border-l-4 border-l-emerald-500 bg-zinc-50 text-zinc-900',
				};
			case 'info':
				return {
					icon: InfoIcon,
					iconColor: 'text-blue-500',
					className: 'border-l-4 border-l-blue-300 bg-zinc-50 text-zinc-900',
				};
			case 'privacy':
				return {
					icon: CookieIcon,
					iconColor: 'text-purple-500',
					className: 'border-l-4 border-l-purple-300 bg-zinc-50 text-zinc-900',
				};
			case 'update':
				return {
					icon: DownloadIcon,
					iconColor: 'text-indigo-500',
					className: 'border-l-4 border-l-indigo-300 bg-zinc-50 text-zinc-900',
				};
			case 'mention':
				return {
					icon: UserIcon,
					iconColor: 'text-pink-500',
					className: 'border-l-4 border-l-pink-300 bg-zinc-50 text-zinc-900',
				};
			case 'reminder':
				return {
					icon: ClockIcon,
					iconColor: 'text-amber-500',
					className: 'border-l-4 border-l-amber-300 bg-zinc-50 text-zinc-900',
				};
			default:
				return {
					icon: InfoIcon,
					iconColor: 'text-gray-500',
					className: 'border-l-4 border-l-gray-500 bg-zinc-50 text-zinc-900',
				};
		}
	};

	const variantConfig = getVariantConfig(variant);
	const Icon = variantConfig.icon;

	// Create custom toast with icon and actions
	toast.custom(
		(t) => (
			<div className={`flex items-start gap-3 p-4 rounded-lg shadow-lg max-w-md ${variantConfig.className}`}>
				<Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', variantConfig.iconColor)} />
				<div className="flex-1 min-w-0">
					<div className="font-medium text-sm">{title}</div>
					{description && <div className="text-sm opacity-80 mt-1">{description}</div>}
					{(primaryAction || secondaryAction) && (
						<div className="flex gap-2 mt-3">
							{primaryAction && (
								<Button
									onClick={() => {
										primaryAction.onClick();
										toast.dismiss(t);
									}}
									variant="default"
								>
									{primaryAction.label}
								</Button>
							)}
							{secondaryAction && (
								<Button
									onClick={() => {
										secondaryAction.onClick();
										toast.dismiss(t);
									}}
									variant="secondary"
								>
									{secondaryAction.label}
								</Button>
							)}
						</div>
					)}
				</div>
				{dismissible && (
					<button
						onClick={() => toast.dismiss(t)}
						className="text-current opacity-60 hover:opacity-100 transition-opacity"
					>
						<XCircleIcon className="w-4 h-4" />
					</button>
				)}
			</div>
		),
		{
			duration: config.duration || 5000,
			position: config.position || 'top-right',
		},
	);
}

// Specific notification functions based on the image
export function showNeutralNotification(config: Omit<NotifyConfig, 'title'> & { title?: string }) {
	showNotification('neutral', {
		title: config.title || 'neutral notification',
		...config,
	});
}

export function showWarningNotification(config: Omit<NotifyConfig, 'title'> & { title?: string }) {
	showNotification('warning', {
		title: config.title || 'warning notification',
		...config,
	});
}

export function showErrorNotification(config: Omit<NotifyConfig, 'title'> & { title?: string }) {
	showNotification('error', {
		title: config.title || 'error notification',
		...config,
	});
}

export function showSuccessNotification(config: Omit<NotifyConfig, 'title'> & { title?: string }) {
	showNotification('success', {
		title: config.title || 'success notification',
		...config,
	});
}

export function showInfoNotification(config: Omit<NotifyConfig, 'title'> & { title?: string }) {
	showNotification('info', {
		title: config.title || 'info notification',
		...config,
	});
}

export function showPrivacyNotification(config: Omit<NotifyConfig, 'title'> & { title?: string }) {
	showNotification('privacy', {
		title: config.title || 'privacy notification',
		...config,
	});
}

export function showUpdateNotification(config: Omit<NotifyConfig, 'title'> & { title?: string }) {
	showNotification('update', {
		title: config.title || 'update notification',
		...config,
	});
}

export function showMentionNotification(
	config: Omit<NotifyConfig, 'title'> & {
		title?: string;
		user?: string;
		project?: string;
		time?: string;
	},
) {
	showNotification('mention', {
		title: config.title || 'mentioned you',
		...config,
	});
}

export function showReminderNotification(
	config: Omit<NotifyConfig, 'title'> & {
		title?: string;
		time?: string;
		date?: string;
	},
) {
	showNotification('reminder', {
		title: config.title || 'reminder notification',
		...config,
	});
}
