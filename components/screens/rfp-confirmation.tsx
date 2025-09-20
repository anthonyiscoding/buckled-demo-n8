import { Label } from "@radix-ui/react-label";
import { FileText, ArrowRight, Wrench, Clock, Check } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useSelectedQuote, useOtherState } from "@/lib/hooks";

export function RfpConfirmation() {
    const { selectedQuote } = useSelectedQuote()
    const { rfpSent, proposalReady } = useOtherState()

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            <div className="text-center">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Sending Your Request</h2>
                    <p className="text-gray-600 mb-6">We're sending your RFP to {selectedQuote?.serviceCenterName}</p>
                </div>

                <Card className="p-8">
                    <CardContent className="space-y-6">
                        {/* Animation Container */}
                        <div className="flex items-center justify-center mb-8">
                            <div className="relative">
                                {/* Document Icon */}
                                <div
                                    className={`w-16 h-20 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center transition-all duration-1000 ${rfpSent ? "transform translate-x-20 opacity-50" : ""}`}
                                >
                                    <FileText className="w-8 h-8 text-gray-600" />
                                </div>

                                {/* Arrow Animation */}
                                <div
                                    className={`absolute top-1/2 left-20 transform -translate-y-1/2 transition-opacity duration-500 ${rfpSent ? "opacity-100" : "opacity-0"}`}
                                >
                                    <ArrowRight className="w-6 h-6 text-[#f16c63] animate-pulse" />
                                </div>

                                {/* Service Center Icon */}
                                <div
                                    className={`absolute top-0 left-32 w-16 h-20 bg-[#f16c63] rounded-lg flex items-center justify-center transition-all duration-1000 ${rfpSent ? "ring-4 ring-[#f16c63] ring-opacity-30" : ""}`}
                                >
                                    <Wrench className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Status Messages */}
                        {!proposalReady ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#f16c63]"></div>
                                    <span className="text-gray-700">{rfpSent ? "Processing your request..." : "Sending RFP..."}</span>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-blue-600 -mt-0.5" />
                                        <div className="text-sm">
                                            <Label className="font-medium text-blue-900 mb-1">Response Time</Label>
                                            <ul>
                                                <li>Common requests: Automatic response within seconds</li>
                                                <li>Complex cases: Response within 24 hours</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <Check className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-semibold text-green-700">Proposal Ready!</span>
                                </div>

                                <p className="text-gray-600">
                                    Great news! Your service proposal has been prepared and is ready for review.
                                </p>

                                <div className="animate-pulse text-sm text-gray-500">Redirecting to scheduling...</div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
