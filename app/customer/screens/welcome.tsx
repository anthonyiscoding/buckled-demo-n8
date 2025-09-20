import { Button } from "../../../components/ui/button"
import { useHasExistingData, useNavigation } from "@/lib/hooks"

export function Welcome() {
    const { hasExistingData, lastStep } = useHasExistingData()
    const { setCurrentStep, clearProgress } = useNavigation()

    const handleContinue = () => {
        setCurrentStep(lastStep)
    }

    const handleStartFresh = () => {
        clearProgress()
        setCurrentStep("car-selection")
        // Don't call setCurrentStep here since clearProgress already navigates to welcome
        // The user can then click "Get Started" to begin fresh
    }

    if (hasExistingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f4f1] to-white">
                <div className="text-center max-w-2xl mx-auto px-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome back to Buckled.io</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        We found your previous session. Would you like to continue where you left off or start a new quote?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={handleContinue}
                            className="bg-[#f16c63] hover:bg-[#e55a51] text-white px-8 py-3"
                        >
                            Continue Previous Session
                        </Button>
                        <Button
                            onClick={handleStartFresh}
                            variant="outline"
                            className="border-[#f16c63] text-[#f16c63] hover:bg-[#f16c63] hover:text-white px-8 py-3"
                        >
                            Start New Quote
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f4f1] to-white">
            <div className="text-center max-w-2xl mx-auto px-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Buckled.io</h1>
                <p className="text-xl text-gray-600 mb-8">
                    Get expert car diagnosis and fair quotes from trusted service centers
                </p>
            </div>
        </div>
    )
}
