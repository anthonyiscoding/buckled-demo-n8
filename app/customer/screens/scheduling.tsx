import { Label } from "../../../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useSelectedDate, useSelectedTime, useNavigation } from "@/lib/hooks";

const timeSlots = [
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
]

export function Scheduling() {
    const { selectedDate, setSelectedDate } = useSelectedDate()
    const { selectedTime, setSelectedTime } = useSelectedTime()
    const { setCurrentStep } = useNavigation()

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Schedule Your Service</h2>
                <p className="text-gray-600">Pick a convenient date and time for your appointment</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Select Date & Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label>Select Date</Label>
                        <DatePicker
                            placeholderText="Pick a date"
                            selected={selectedDate}
                            onChange={setSelectedDate}
                            minDate={new Date()}
                            maxDate={new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)}
                            dateFormat="MMMM d, yyyy"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <Label>Select Time</Label>
                        <Select value={selectedTime} onValueChange={setSelectedTime}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a time slot" />
                            </SelectTrigger>
                            <SelectContent>
                                {timeSlots.map((time) => (
                                    <SelectItem key={time} value={time}>
                                        {time}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={() => setCurrentStep("confirmation")}
                        disabled={!selectedDate || !selectedTime}
                        className="w-full bg-[#f16c63] hover:bg-[#e55a51] text-white"
                    >
                        Schedule Appointment
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
