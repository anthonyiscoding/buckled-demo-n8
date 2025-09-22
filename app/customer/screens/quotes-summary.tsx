import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import { Card, CardContent } from "../../../components/ui/card"
import { StarRating } from "../../../components/ui/star-rating"
import { Button } from "../../../components/ui/button"
import { useSignupStatus, useSelectedQuote, useNavigation, useOtherState } from "@/lib/hooks"
import { getMockQuotes } from "../../../components/car-data"
import { SocketStatus } from "@/components/ui/socket-status"

export function QuotesSummary() {
    const { isSignedUp } = useSignupStatus()
    const { setSelectedQuote } = useSelectedQuote()
    const { setCurrentStep } = useNavigation()
    const { diagnosisResponse } = useOtherState()
    const mockQuotes = getMockQuotes(diagnosisResponse)

    const quoteLength = isSignedUp ? mockQuotes.length : 1

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <SocketStatus src="/images/socket-holding-rfp.png" alt="Socket holding an RFP" />
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Service Center Quotes</h2>
                <p className="text-gray-600">Compare quotes from trusted service centers in your area</p>
            </div>

            <div className="grid gap-6">
                {mockQuotes.slice(0, quoteLength).map((quote) => (
                    <Card key={quote.id} className="border-2">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className={cn("text-xl font-semibold", !isSignedUp && "blur-sm")}>{quote.serviceCenterName}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <StarRating rating={quote.rating} />
                                        <span className="text-sm text-gray-600">{quote.rating}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-[#f16c63]">${quote.price}</div>
                                    <div className="text-sm text-gray-600">{quote.estimatedTime}</div>
                                    <div className="text-sm text-gray-600">{quote.warranty}</div>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4">{quote.description}</p>
                            <Button
                                onClick={() => {
                                    setSelectedQuote(quote)
                                    setCurrentStep("quote-details")
                                }}
                                className="w-full bg-[#f16c63] hover:bg-[#e55a51] text-white"
                                disabled={!isSignedUp}
                            >
                                View Details
                            </Button>
                        </CardContent>
                    </Card>
                ))}

                {/* Blurred quotes requiring signup */}
                {!isSignedUp && (
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-1 flex items-start justify-center rounded-lg">
                            <Card className="max-w-sm">
                                <CardContent className="p-6 text-center">
                                    <h3 className="text-lg font-semibold mb-2">See All Quotes</h3>
                                    <p className="text-gray-600 mb-4">Sign up to view {mockQuotes.length - quoteLength} more competitive quotes</p>
                                    <Button
                                        onClick={() => setCurrentStep("signup")}
                                        className="bg-[#f16c63] hover:bg-[#e55a51] text-white"
                                    >
                                        Sign Up to See All Offers
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-4 opacity-50">
                            {mockQuotes.slice(2).map((quote) => (
                                <Card key={quote.id}>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold blur-sm">████████████</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className="w-4 h-4 text-gray-300" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-[#f16c63] blur-sm">$███</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
