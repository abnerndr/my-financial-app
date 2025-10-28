'use client';

import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react';
import { type ComponentProps, useEffect, useId, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface InputPasswordValidationProps extends ComponentProps<typeof Input> {
	label?: string;
	onIsValidPassword?: (isValid: boolean) => void;
}

export function InputPasswordValidation({ label, onIsValidPassword, ...props }: InputPasswordValidationProps) {
	const id = useId();
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [password, setPassword] = useState<string>((props.value as string) || '');

	const toggleVisibility = () => setIsVisible((prevState) => !prevState);

	const checkStrength = (pass: string) => {
		const requirements = [
			{ regex: /.{8,}/, text: 'Pelo menos 8 caracteres' },
			{ regex: /[0-9]/, text: 'Pelo menos 1 número' },
			{ regex: /[a-z]/, text: 'Pelo menos 1 letra minúscula' },
			{ regex: /[A-Z]/, text: 'Pelo menos 1 letra maiúscula' },
		];

		return requirements.map((req) => ({
			met: req.regex.test(pass),
			text: req.text,
		}));
	};

	const strength = checkStrength(password);

	const strengthScore = useMemo(() => {
		return strength.filter((req) => req.met).length;
	}, [strength]);

	useEffect(() => {
		if (onIsValidPassword && strengthScore === 4) {
			onIsValidPassword(true);
		}
	}, [onIsValidPassword, strengthScore]);

	const getStrengthColor = (score: number) => {
		if (score === 0) return 'bg-border';
		if (score <= 1) return 'bg-red-500';
		if (score <= 2) return 'bg-orange-500';
		if (score === 3) return 'bg-amber-500';
		return 'bg-emerald-500';
	};

	const getStrengthText = (score: number) => {
		if (score === 0) return 'Digite uma senha';
		if (score <= 2) return 'Senha fraca';
		if (score === 3) return 'Senha média';
		return 'Senha forte';
	};

	return (
		<div>
			{/* Password input field with toggle visibility button */}
			<div className="*:not-first:mt-2">
				<Label htmlFor={props.id}>
					{label} {props.required && <span className="text-red-500">*</span>}
				</Label>
				<div className="relative">
					<Input
						className={cn('pe-9', props.className)}
						type={isVisible ? 'text' : 'password'}
						aria-describedby={`${props.id}-description`}
						onChange={(e) => {
							props.onChange?.(e);
							setPassword(e.target.value);
						}}
						{...props}
					/>
					<button
						className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
						type="button"
						onClick={toggleVisibility}
						aria-label={isVisible ? 'Hide password' : 'Show password'}
						aria-pressed={isVisible}
						aria-controls="password"
					>
						{isVisible ? <EyeOffIcon size={16} aria-hidden="true" /> : <EyeIcon size={16} aria-hidden="true" />}
					</button>
				</div>
			</div>

			{/* Password strength indicator */}
			<div
				className="mt-3 mb-4 h-1 w-full overflow-hidden rounded-full bg-border"
				role="progressbar"
				aria-valuenow={strengthScore}
				aria-valuemin={0}
				aria-valuemax={4}
				aria-label="Password strength"
			>
				<div
					className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
					style={{ width: `${(strengthScore / 4) * 100}%` }}
				></div>
			</div>

			{/* Password strength description */}
			<p id={`${id}-description`} className="mb-2 text-sm font-medium text-foreground">
				{getStrengthText(strengthScore)}. Deve conter:
			</p>

			{/* Password requirements list */}
			<ul className="space-y-1.5" aria-label="Password requirements">
				{strength.map((req, index) => (
					<li key={index} className="flex items-center gap-2">
						{req.met ? (
							<CheckIcon size={16} className="text-emerald-500" aria-hidden="true" />
						) : (
							<XIcon size={16} className="text-muted-foreground/80" aria-hidden="true" />
						)}
						<span className={`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}>
							{req.text}
							<span className="sr-only">{req.met ? ' - Requirement met' : ' - Requirement not met'}</span>
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
