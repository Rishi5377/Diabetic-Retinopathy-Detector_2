interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
}

const StepIndicator = ({ currentStep, totalSteps, stepLabel }: StepIndicatorProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-foreground">{stepLabel}</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-primary h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default StepIndicator;
