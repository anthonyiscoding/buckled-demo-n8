import { Label } from "@radix-ui/react-label";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { useCarSelection, useProblemDescription, useNavigation, useOtherState, useSocketMessages, useSocketState } from "@/lib/hooks";
import { useEffect } from "react";
import Image from "next/image"

export function ProblemDescription() {
    const { selectedCar } = useCarSelection()
    const { problemDescription, setProblemDescription } = useProblemDescription()
    const { setCurrentStep } = useNavigation()
    const {
        setDiagnosisLoading,
        setDiagnosisResponse,
        setShowInvalidRequestMessage,
        diagnosisLoading,
        showInvalidRequestMessage
    } = useOtherState()
    const { addSocketMessage } = useSocketMessages()
    const { setShouldOpenChat, setShowContinueButton, setContinueButtonText } = useSocketState()

    useEffect(() => {
        setDiagnosisLoading(false)
        setDiagnosisResponse({})
    }, [showInvalidRequestMessage])
    // Reset invalid request state when component mounts
    useEffect(() => {
        if (showInvalidRequestMessage) {
            setShowInvalidRequestMessage(false)
            setShowContinueButton(false)
        }
    }, [showInvalidRequestMessage, setShowInvalidRequestMessage, setShowContinueButton])

    const handleProblemSubmission = async () => {
        console.log(problemDescription)
        setDiagnosisLoading(true)

        fetch("/api/diagnose", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                issues: problemDescription
            })
        }).then(response => response.json()).then((diagnosisData) => {
            console.log("Diagnosis response:", diagnosisData)

            // Store the response
            setDiagnosisResponse(diagnosisData)

            // If it's not a real request, store this state but still allow progression
            if (!diagnosisData.isRealRequest) {
                setShowInvalidRequestMessage(true)
            }
        }).catch((error) => {
            console.error("Error submitting problem:", error)
            setShowInvalidRequestMessage(true)
        }).finally(() => {
            setDiagnosisLoading(false)
        })

        // Always proceed, we'll prompt the user if the request was bad
        setCurrentStep("media-upload")
    }

    return (
        <div className="max-w-2xl mx-auto px-6 pt-24 pb-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Describe your problem</h2>
                <p className="text-gray-600">
                    Tell us what's happening with your {selectedCar.year} {selectedCar.make} {selectedCar.model}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>What's the issue?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="problem">Problem Description</Label>
                        <Textarea
                            id="problem"
                            placeholder="Describe the symptoms, sounds, or issues you're experiencing..."
                            value={problemDescription}
                            onChange={(e) => setProblemDescription(e.target.value)}
                            rows={6}
                        />
                    </div>

                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep("car-selection")}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        <div className="flex-1 flex items-center justify-between">
                            <Button
                                onClick={handleProblemSubmission}
                                disabled={!problemDescription.trim()}
                                className="bg-[#f16c63] hover:bg-[#e55a51] text-white"
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
