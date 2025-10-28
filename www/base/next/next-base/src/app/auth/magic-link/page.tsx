'use client';

import { MagicLinkForm } from '@/components/auth/magic-link-form';

export default function MagicLinkPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<div className="w-full max-w-md space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Login Mágico</h1>
					<p className="text-muted-foreground mt-2">Acesse sua conta sem senha</p>
				</div>

				<MagicLinkForm />
			</div>
		</div>
	);
}
