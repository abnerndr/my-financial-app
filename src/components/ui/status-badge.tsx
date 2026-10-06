import { Badge } from "@/components/ui/badge";
import { type PaymentStatus, paymentStatusLabel, paymentStatusVariant } from "@/lib/payment-status";

export function StatusBadge({ status }: { status: PaymentStatus }) {
	return (
		<Badge variant={paymentStatusVariant[status]}>
			<span className="size-1.5 rounded-full bg-current" aria-hidden />
			{paymentStatusLabel[status]}
		</Badge>
	);
}
