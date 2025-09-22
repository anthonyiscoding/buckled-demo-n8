import { Check } from "lucide-react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { useSelectedQuote, useSelectedDate, useSelectedTime } from "@/lib/hooks";
import { SocketStatus } from "@/components/ui/socket-status";

export function Confirmation() {
    const { selectedQuote } = useSelectedQuote()
    const { selectedDate } = useSelectedDate()
    const { selectedTime } = useSelectedTime()

    return (
        <div className="max-w-2xl mx-auto px-6 pt-24 pb-12">
            <SocketStatus src="/images/socket-thumbs-up.png" alt="Socket giving a thumbs up" />
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Appointment Scheduled!</h2>
            </div>

            <Card className="animate-fade-in">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        All Set!
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-700">
                        See that was easy! We're sending off this RFP to {selectedQuote?.serviceCenterName}. Remember to check your
                        email, they will be in touch soon. Our Service Centers are top-notch, customer-focused, and always guaranteed
                        to respond within 24 hours!
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 animate-fade-in-delayed-1">
                        <h4 className="font-semibold mb-2">Appointment Details:</h4>
                        <div className="space-y-1 text-sm">
                            <p>
                                <strong>Service Center:</strong> {selectedQuote?.serviceCenterName}
                            </p>
                            <p>
                                <strong>Date:</strong> {selectedDate ? format(selectedDate, "PPP") : "Not selected"}
                            </p>
                            <p>
                                <strong>Time:</strong> {selectedTime}
                            </p>
                            <p>
                                <strong>Estimated Cost:</strong> ${selectedQuote?.price}
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 animate-fade-in-delayed-2">
                        You can always come back here any time you have additional car needs or even just a question about your
                        vehicle.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
