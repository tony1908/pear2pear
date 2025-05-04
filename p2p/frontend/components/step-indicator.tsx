interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex flex-1 items-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-1 items-center">
            <div className={`h-2 w-2 rounded-full ${index + 1 <= currentStep ? "bg-primary" : "bg-gray-300"}`} />
            {index < totalSteps - 1 && (
              <div className={`h-0.5 flex-1 ${index + 1 < currentStep ? "bg-primary" : "bg-gray-300"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="ml-2 text-sm text-gray-500">
        {currentStep}/{totalSteps}
      </div>
    </div>
  )
} 