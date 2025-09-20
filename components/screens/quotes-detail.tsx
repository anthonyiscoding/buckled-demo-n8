import { Label } from "@radix-ui/react-label";
import { CheckSquare, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { StarRating } from "../ui/star-rating";
import { Button } from "../ui/button";
import { useSelectedQuote, useCarSelection, useProblemDescription, useNavigation } from "@/lib/hooks";

export function QuotesDetail() {
    const { selectedQuote } = useSelectedQuote()
    const { selectedCar } = useCarSelection()
    const { problemDescription } = useProblemDescription()
    const { setCurrentStep } = useNavigation()

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            {selectedQuote && (
                <>
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedQuote.serviceCenterName}</h2>
                        <div className="flex items-center gap-2">
                            <StarRating rating={selectedQuote.rating} />
                            <span className="text-gray-600">{selectedQuote.rating} rating</span>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Service Quote</span>
                                <span className="text-2xl text-[#f16c63]">${selectedQuote.price}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="font-semibold mb-2">Services Included:</h4>
                                <p className="text-gray-700">{selectedQuote.details}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold">Estimated Time:</h4>
                                    <p className="text-gray-700">{selectedQuote.estimatedTime}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Warranty:</h4>
                                    <p className="text-gray-700">{selectedQuote.warranty}</p>
                                </div>
                            </div>

                            <div className="bg-success rounded-lg p-4">
                                <h4 className="font-semibold mb-2">Draft RFP Summary</h4>
                                <div className="text-sm">
                                    <Label className="font-bold">Vehicle</Label>
                                    <p className="mb-2">{selectedCar.year} {selectedCar.make} {selectedCar.model}</p>
                                    <Label className="font-bold">Issue</Label>
                                    <p className="mb-2">{problemDescription}</p>
                                    <Label className="font-bold">Suggested Services</Label>
                                    <ul className="mb-2">
                                        <li className="flex items-center">
                                            <CheckSquare className="w-5 h-5 mr-2 text-green-900" />
                                            Transmission fluid change
                                        </li>
                                        <li className="flex items-center">
                                            <CheckSquare className="w-5 h-5 mr-2 text-green-900" />
                                            Brake pad replacement
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button variant="outline" onClick={() => setCurrentStep("quotes")} className="flex items-center gap-2">
                                    <ArrowLeft className="w-4 h-4" />
                                    Go Back
                                </Button>
                                <Button
                                    onClick={() => setCurrentStep("rfp-confirmation")}
                                    className="flex-1 bg-[#f16c63] hover:bg-[#e55a51] text-white"
                                >
                                    Accept Quote
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}