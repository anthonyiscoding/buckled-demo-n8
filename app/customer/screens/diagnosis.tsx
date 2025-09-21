import { Label } from "@radix-ui/react-label";
import { Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { Button } from "../../../components/ui/button";
import Image from "next/image";
import { useOtherState, useNavigation, useSocketState, useSocketMessages } from "@/lib/hooks";
import { useEffect } from "react";

export function Diagnosis() {
    const { diagnosisProgress, showDiagnosisResults, diagnosisResponse, showInvalidRequestMessage } = useOtherState()
    const { setCurrentStep } = useNavigation()
    const { showContinueButton, setShouldOpenChat, setShowContinueButton, setContinueButtonText } = useSocketState()
    const { addSocketMessage } = useSocketMessages()

    // Trigger socket message when invalid request is detected and results are shown
    useEffect(() => {
        if (showInvalidRequestMessage && diagnosisResponse && !diagnosisResponse.isRealRequest && showDiagnosisResults) {
            // Show socket message about invalid request
            addSocketMessage({
                text: "I'm having trouble understanding your car problem description. Could you provide more specific details about the symptoms, sounds, or issues you're experiencing? Click 'Retry' to update your description.",
                sender: 'socket'
            }, true) // Clear previous messages

            setShouldOpenChat(true)
            setShowContinueButton(true)
            setContinueButtonText("Retry")
        }
    }, [showInvalidRequestMessage, diagnosisResponse, showDiagnosisResults, addSocketMessage, setShouldOpenChat, setShowContinueButton, setContinueButtonText])

    // If showing invalid request message, disable all buttons except the retry button
    const isDisabled = showInvalidRequestMessage && !showContinueButton

    const handleRetry = () => {
        setCurrentStep("problem-description")
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            <div className="text-center mb-8">
                <div className="w-32 h-32 flex items-center justify-center mx-auto mb-4">
                    <Image
                        src="/images/socket-thinking.png"
                        alt="Socket character"
                        className="w-full h-full object-contain animate-socket-appear max-h-[300px]"
                        width={120}
                        height={300}
                    />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Analyzing your issue...</h2>
                <Progress value={diagnosisProgress} className="w-full max-w-md mx-auto" />
            </div>

            {showDiagnosisResults && diagnosisResponse && diagnosisResponse.isRealRequest && (
                <div className="animate-fade-in">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-xl">🔧</span>
                                Our Diagnosis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-700">Based on your description and vehicle information, it appears you need:</p>
                            <div className="bg-success rounded-lg p-4 animate-fade-in-delayed">
                                <Label className="font-semibold mb-2">Recommended Services</Label>
                                <ul className="space-y-2 text-sm">
                                    {diagnosisResponse.services.map((service: any, index: number) => (
                                        <li key={index} className={`flex items-center gap-2 animate-fade-in-delayed-${index + 1}`}>
                                            <Check className="w-4 h-4 text-green-900" />
                                            {service.name} (${service.priceRange.minimumPrice} - ${service.priceRange.maximumPrice})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <p className="text-sm text-gray-600 animate-fade-in-delayed-3">
                                We'll match you to the best service centers for your needs.
                            </p>
                            <Button
                                onClick={() => setCurrentStep("quotes")}
                                disabled={isDisabled}
                                className="w-full bg-[#f16c63] hover:bg-[#e55a51] text-white animate-fade-in-delayed-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Look at Quotes
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Show general diagnosis when isRealRequest = false */}
            {showDiagnosisResults && diagnosisResponse && !diagnosisResponse.isRealRequest && (
                <div className="animate-fade-in">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-xl">🔧</span>
                                Preliminary Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-700">We're analyzing your input, but could use more details for a precise diagnosis.</p>
                            <div className="bg-amber-50 rounded-lg p-4 animate-fade-in-delayed">
                                <Label className="font-semibold mb-2">Common Services</Label>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2 animate-fade-in-delayed-1">
                                        <Check className="w-4 h-4 text-amber-600" />
                                        General diagnostic (~$100-150)
                                    </li>
                                    <li className="flex items-center gap-2 animate-fade-in-delayed-2">
                                        <Check className="w-4 h-4 text-amber-600" />
                                        Vehicle inspection (~$50-100)
                                    </li>
                                </ul>
                            </div>
                            <p className="text-sm text-gray-600 animate-fade-in-delayed-3">
                                Please refine your description to provide accurate quotes.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
