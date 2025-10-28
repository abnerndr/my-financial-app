import {
	CircleAlertIcon,
	CircleCheckIcon,
	InfoIcon,
	TriangleAlertIcon,
} from 'lucide-react';
import { type VariantProps, tv } from 'tailwind-variants';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const alertVariants = tv({
	base: '',
	variants: {
		variant: {
			info: 'bg-blue-50 text-blue-500 border-blue-300',
			success: 'bg-green-50 text-green-500 border-green-300',
			warning: 'bg-yellow-50 text-yellow-500 border-yellow-300',
			error: 'bg-red-50 text-red-500 border-red-300',
		},
	},
	defaultVariants: {
		variant: 'info',
	},
});

export interface AlertBaseProps extends VariantProps<typeof alertVariants> {
	title: string;
	description: string;
}

export function AlertBase({ title, description, variant }: AlertBaseProps) {
	const alertIcon = {
		info: InfoIcon,
		success: CircleCheckIcon,
		warning: TriangleAlertIcon,
		error: CircleAlertIcon,
	};

	const Icon = alertIcon[variant || 'info'];

	return (
		<Alert className={alertVariants({ variant })}>
			{Icon && <Icon />}
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription className="text-zinc-900/40">{description}</AlertDescription>
		</Alert>
	);
}
