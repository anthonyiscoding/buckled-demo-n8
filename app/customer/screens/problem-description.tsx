import { Label } from "@radix-ui/react-label";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { useCarSelection, useProblemDescription, useNavigation } from "@/lib/hooks";
import { useEffect } from "react";

export function ProblemDescription() {
    const { selectedCar } = useCarSelection()
    const { problemDescription, setProblemDescription } = useProblemDescription()
    const { setCurrentStep } = useNavigation()

    const handleProblemSubmission = () => {
        console.log(problemDescription)
        fetch("/api/diagnose", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                issues: problemDescription
            })
        }).then(response => console.log(response.json()))

        setCurrentStep("media-upload")
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
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
