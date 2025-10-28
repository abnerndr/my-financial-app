import {
	Stepper,
	StepperDescription,
	StepperIndicator,
	StepperItem,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
} from '@/components/ui/stepper';

export type StepOptions = {
	step: number;
	title: string;
	description: string;
};

export interface StepperInlineProps {
	steps: StepOptions[];
	onGetCurrentStep?: (step: number) => void;
	defaultCurrentStep?: number;
}

export function StepperInline({
	steps,
	onGetCurrentStep,
	defaultCurrentStep,
}: StepperInlineProps) {
	return (
		<div className="space-y-8 text-center">
			<Stepper defaultValue={defaultCurrentStep} onValueChange={onGetCurrentStep}>
				{steps.map(({ step, title, description }) => (
					<StepperItem
						key={step}
						step={step}
						className="not-last:flex-1 max-md:items-start"
					>
						<StepperTrigger className="rounded max-md:flex-col">
							<StepperIndicator />
							<div className="text-center md:text-left">
								<StepperTitle>{title}</StepperTitle>
								<StepperDescription className="max-sm:hidden">
									{description}
								</StepperDescription>
							</div>
						</StepperTrigger>
						{step < steps.length && (
							<StepperSeparator className="max-md:mt-3.5 md:mx-4" />
						)}
					</StepperItem>
				))}
			</Stepper>
		</div>
	);
}
