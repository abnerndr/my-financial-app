// Import functions for the helper object
import {
	showErrorNotification,
	showInfoNotification,
	showMentionNotification,
	showNeutralNotification,
	showPrivacyNotification,
	showReminderNotification,
	showSuccessNotification,
	showUpdateNotification,
	showWarningNotification,
} from './components/base';

export type { NotifyConfig, NotifyVariant } from './types';

// Quick notification helpers
export const notify = {
	neutral: showNeutralNotification,
	warning: showWarningNotification,
	error: showErrorNotification,
	success: showSuccessNotification,
	info: showInfoNotification,
	privacy: showPrivacyNotification,
	update: showUpdateNotification,
	mention: showMentionNotification,
	reminder: showReminderNotification,
};
