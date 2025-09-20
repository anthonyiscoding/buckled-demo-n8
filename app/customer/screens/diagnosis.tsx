import { Label } from "@radix-ui/react-label";
import { Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { Button } from "../../../components/ui/button";
import Image from "next/image";
import { useOtherState, useNavigation } from "@/lib/hooks";

export function Diagnosis() {
    const { diagnosisProgress, showDiagnosisResults } = useOtherState()
    const { setCurrentStep } = useNavigation()

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

            {showDiagnosisResults && (
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
                                    <li className="flex items-center gap-2 animate-fade-in-delayed-1">
                                        <Check className="w-4 h-4 text-green-900" />
                                        Transmission fluid change (~$200)
                                    </li>
                                    <li className="flex items-center gap-2 animate-fade-in-delayed-2">
                                        <Check className="w-4 h-4 text-green-900" />
                                        Brake pad replacement (~$250-400)
                                    </li>
                                </ul>
                            </div>
                            <p className="text-sm text-gray-600 animate-fade-in-delayed-3">
                                We'll match you to the best service centers for your needs.
                            </p>
                            <Button
                                onClick={() => setCurrentStep("quotes")}
                                className="w-full bg-[#f16c63] hover:bg-[#e55a51] text-white animate-fade-in-delayed-4"
                            >
                                Look at Quotes
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
