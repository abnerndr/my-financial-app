'use client';

import { notify } from '@/components/common/notify';
import { Button } from '@/components/ui/button';

const mention = {
	user: 'John Doe',
	project: 'project-campaign-02',
	time: '2 min ago',
};

const reminder = {
	time: '27 hours',
	date: 'November 20 at 8:00 P.M.',
};

export default function NotificationPage() {
	return (
		<div className="space-y-8 p-8">
			<div>
				<h2 className="text-xl font-semibold mb-4">Notification Examples</h2>
				<p className="text-muted-foreground mb-6">
					Dynamic notification components based on different use cases and scenarios.
				</p>
			</div>

			{/* Status Notifications */}
			<section className="space-y-4">
				<h3 className="text-lg font-medium">Status Notifications</h3>
				<div className="flex flex-wrap gap-4">
					<Button variant="outline" onClick={() => notify.neutral({})}>
						Show Neutral
					</Button>
					<Button variant="outline" onClick={() => notify.warning({})}>
						Show Warning
					</Button>
					<Button variant="outline" onClick={() => notify.error({})}>
						Show Error
					</Button>
					<Button variant="outline" onClick={() => notify.success({})}>
						Show Success
					</Button>
					<Button variant="outline" onClick={() => notify.info({})}>
						Show Info
					</Button>
				</div>
			</section>

			{/* Interactive Notifications */}
			<section className="space-y-4">
				<h3 className="text-lg font-medium">Interactive Notifications</h3>
				<div className="flex flex-wrap gap-4">
					<Button
						variant="outline"
						onClick={() =>
							notify.privacy({
								title: 'We Value Your Privacy 🍪',
								primaryAction: {
									label: 'Accept',
									onClick: () => console.log('Privacy accepted'),
								},
								secondaryAction: {
									label: 'Decline',
									onClick: () => console.log('Privacy declined'),
								},
							})
						}
					>
						Privacy Notice
					</Button>
					<Button
						variant="outline"
						onClick={() =>
							notify.update({
								primaryAction: {
									label: 'Install',
									onClick: () => console.log('Update installed'),
								},
								secondaryAction: {
									label: 'Later',
									onClick: () => console.log('Update postponed'),
								},
							})
						}
					>
						Update Available
					</Button>
					<Button
						variant="outline"
						onClick={() =>
							notify.mention({
								title: `${mention.user} mentioned you in ${mention.project}`,
								description: mention.time,
								primaryAction: {
									label: 'Accept',
									onClick: () => console.log('Mention accepted'),
								},
								secondaryAction: {
									label: 'Decline',
									onClick: () => console.log('Mention declined'),
								},
							})
						}
					>
						User Mention
					</Button>
					<Button
						variant="outline"
						onClick={() =>
							notify.reminder({
								title: `Live in ${reminder.time}`,
								description: reminder.date,
								primaryAction: {
									label: 'Notify me',
									onClick: () => console.log('Reminder set'),
								},
							})
						}
					>
						Event Reminder
					</Button>
				</div>
			</section>

			{/* Position Examples */}
			<section className="space-y-4">
				<h3 className="text-lg font-medium">Position Examples</h3>
				<div className="flex flex-wrap gap-4">
					<Button
						variant="outline"
						onClick={() =>
							notify.success({
								title: 'Top Left',
								description: 'This notification appears in the top left',
								position: 'top-left',
							})
						}
					>
						Top Left
					</Button>
					<Button
						variant="outline"
						onClick={() =>
							notify.info({
								title: 'Bottom Right',
								description: 'This notification appears in the bottom right',
								position: 'bottom-right',
							})
						}
					>
						Bottom Right
					</Button>
					<Button
						variant="outline"
						onClick={() =>
							notify.warning({
								title: 'Top Center',
								description: 'This notification appears in the top center',
								position: 'top-center',
							})
						}
					>
						Top Center
					</Button>
				</div>
			</section>

			{/* Real-world Examples */}
			<section className="space-y-4">
				<h3 className="text-lg font-medium">Real-world Examples</h3>
				<div className="flex flex-wrap gap-4">
					<Button
						variant="outline"
						onClick={() =>
							notify.success({
								title: 'File uploaded successfully!',
								description: 'document.pdf has been uploaded to your workspace',
								primaryAction: {
									label: 'View File',
									onClick: () => console.log('Opening file...'),
								},
							})
						}
					>
						File Upload Success
					</Button>
					<Button
						variant="outline"
						onClick={() =>
							notify.error({
								title: 'Payment failed',
								description: 'Your card was declined. Please try a different payment method.',
								primaryAction: {
									label: 'Retry Payment',
									onClick: () => console.log('Retrying payment...'),
								},
								secondaryAction: {
									label: 'Update Card',
									onClick: () => console.log('Updating card...'),
								},
							})
						}
					>
						Payment Error
					</Button>
					<Button
						variant="outline"
						onClick={() =>
							notify.warning({
								title: 'Storage almost full',
								description: "You're using 95% of your storage. Upgrade to continue.",
								primaryAction: {
									label: 'Upgrade Now',
									onClick: () => console.log('Upgrading...'),
								},
								secondaryAction: {
									label: 'Manage Files',
									onClick: () => console.log('Managing files...'),
								},
							})
						}
					>
						Storage Warning
					</Button>
				</div>
			</section>
		</div>
	);
}
