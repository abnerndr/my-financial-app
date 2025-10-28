'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Stepper,
	StepperIndicator,
	StepperItem,
	StepperSeparator,
	StepperTrigger,
} from '@/components/ui/stepper';

export interface StepperBaseProps {
	isLoading?: boolean;
	onGetCurrentStep?: (step: number) => void;
	defaultCurrentStep?: number;
	steps: number[];
}

export function StepperBase({
	isLoading,
	steps = [1, 2, 3, 4],
	onGetCurrentStep,
	defaultCurrentStep,
}: StepperBaseProps) {
	const [currentStep, setCurrentStep] = useState<number>(defaultCurrentStep ?? 1);
	const handleNextStep = () => {
		setCurrentStep(currentStep + 1);
		if (onGetCurrentStep) {
			onGetCurrentStep(currentStep + 1);
		}
	};

	return (
		<div className="mx-auto max-w-xl space-y-8 text-center">
			<Stepper value={currentStep} onValueChange={setCurrentStep}>
				{steps.map((step) => (
					<StepperItem
						key={step}
						step={step}
						className="not-last:flex-1"
						loading={isLoading}
					>
						<StepperTrigger asChild>
							<StepperIndicator />
						</StepperTrigger>
						{step < steps.length && <StepperSeparator />}
					</StepperItem>
				))}
			</Stepper>
			<div className="flex justify-center space-x-4">
				<Button
					variant="outline"
					className="w-32"
					onClick={() =>
						setCurrentStep &&
						typeof currentStep === 'number' &&
						setCurrentStep(currentStep - 1)
					}
					disabled={currentStep === 1}
				>
					Anterior
				</Button>
				<Button
					variant="outline"
					className="w-32"
					onClick={handleNextStep}
					disabled={currentStep > steps.length}
				>
					Próximo
				</Button>
			</div>
		</div>
	);
}
