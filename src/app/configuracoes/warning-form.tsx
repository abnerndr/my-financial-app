"use client";

import { updateWarningLimit } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	warningLimitPercent: z.number().min(1).max(99),
});

type FormData = z.infer<typeof schema>;

export function WarningForm({ defaultPercent }: { defaultPercent: number }) {
	const router = useRouter();
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { warningLimitPercent: defaultPercent },
	});

	const mutation = useMutation({
		mutationFn: async (data: FormData) => {
			const fd = new FormData();
			fd.set("warningLimitPercent", String(data.warningLimitPercent));
			return updateWarningLimit(fd);
		},
		onSuccess: (result) => {
			if (result?.success) {
				router.refresh();
			}
		},
	});

	return (
		<form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="flex flex-wrap items-end gap-4">
			<div className="space-y-2">
				<Label htmlFor="warningLimitPercent">Percentual (%)</Label>
				<Input
					id="warningLimitPercent"
					type="number"
					min={1}
					max={99}
					{...form.register("warningLimitPercent", { valueAsNumber: true })}
					className="w-24"
				/>
				{form.formState.errors.warningLimitPercent && (
					<p className="text-sm text-destructive">{form.formState.errors.warningLimitPercent.message}</p>
				)}
			</div>
			<Button type="submit" disabled={mutation.isPending}>
				{mutation.isPending ? "Salvando..." : "Salvar"}
			</Button>
		</form>
	);
}
