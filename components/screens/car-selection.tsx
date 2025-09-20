import { Label } from "../ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useCarSelection, useNavigation } from "@/lib/hooks";
import { getCarMakes, getCarModels } from "../car-data";

const carMakes = getCarMakes()
const carModels = getCarModels()
const years = ["Don't know", ...Array.from({ length: 46 }, (_, i) => 2025 - i)]

export function CarSelection() {
    const { selectedCar, setSelectedCar } = useCarSelection()
    const { setCurrentStep } = useNavigation()

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell us about your car</h2>
                <p className="text-gray-600">We need some basic information to provide accurate diagnosis</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="make">Make</Label>
                            <Select
                                value={selectedCar.make}
                                onValueChange={(value) => setSelectedCar({ ...selectedCar, make: value, model: "" })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select make" />
                                </SelectTrigger>
                                <SelectContent>
                                    {carMakes.map((make) => (
                                        <SelectItem key={make} value={make}>
                                            {make}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="model">Model</Label>
                            <Select
                                value={selectedCar.model}
                                onValueChange={(value) => setSelectedCar({ ...selectedCar, model: value })}
                                disabled={!selectedCar.make}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select model" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedCar.make &&
                                        carModels[selectedCar.make as keyof typeof carModels]?.map((model) => (
                                            <SelectItem key={model} value={model}>
                                                {model}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="year">Year</Label>
                            <Select
                                value={selectedCar.year}
                                onValueChange={(value) => setSelectedCar({ ...selectedCar, year: value })}
                                disabled={!selectedCar.model}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Button
                            onClick={() => setCurrentStep("problem-description")}
                            disabled={!selectedCar.make || !selectedCar.model || !selectedCar.year}
                            className="bg-[#f16c63] hover:bg-[#e55a51] text-white"
                        >
                            Continue
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
