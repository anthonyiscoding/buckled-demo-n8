import { UploadIcon, Camera, ArrowLeft } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Progress } from "../../../components/ui/progress"
import { useUploadedQuoteFiles, useNavigation } from "@/lib/hooks"
import { getFileDetails } from "@/lib/utils"

export function QuoteUpload() {
    const { uploadedQuoteFiles, setUploadedQuoteFiles } = useUploadedQuoteFiles()
    const { setCurrentStep } = useNavigation()

    const handleQuoteFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = getFileDetails(event)
        setUploadedQuoteFiles([...uploadedQuoteFiles, ...files])
    }

    return (
        <div className="max-w-2xl mx-auto px-6 pt-24 pb-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload existing quotes</h2>
                <p className="text-gray-600">Have quotes from other service centers? Upload them for comparison (optional)</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upload Quote Documents</CardTitle>
                    <CardDescription>Upload photos or PDFs of quotes you've received from other service centers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">Upload photos or PDFs of existing quotes</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <div className="relative">
                                <Button variant="outline" className="flex items-center gap-2 bg-transparent w-full sm:w-auto">
                                    <UploadIcon className="w-4 h-4" />
                                    Upload Quote
                                </Button>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,.pdf"
                                    onChange={handleQuoteFileUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <Button variant="outline" className="flex items-center gap-2 bg-transparent w-full sm:w-auto">
                                <Camera className="w-4 h-4" />
                                Take Photo
                            </Button>
                        </div>
                    </div>

                    {uploadedQuoteFiles.length > 0 && (
                        <div>
                            <h4 className="font-medium mb-2">Uploaded Quote Files:</h4>
                            <div className="space-y-2">
                                {uploadedQuoteFiles.map((filename, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                        <span className="text-sm">{filename}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep("media-upload")}
                            className="flex items-center gap-2 justify-center"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <Button
                                onClick={() => {
                                    if (uploadedQuoteFiles.length > 0) {
                                        setCurrentStep("quote-scanning")
                                    } else {
                                        setCurrentStep("diagnosis")
                                    }
                                }}
                                className="bg-[#f16c63] hover:bg-[#e55a51] text-white w-full sm:w-auto"
                            >
                                Continue
                            </Button>
                            <button
                                onClick={() => setCurrentStep("diagnosis")}
                                className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer transition-colors"
                            >
                                Skip &gt;
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export function QuoteScanning() {
    const { uploadedQuoteFiles } = useUploadedQuoteFiles()

    return (
        <div className="max-w-2xl mx-auto px-6 pt-24 pb-12">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#f16c63] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <span className="text-2xl">📄</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Scanning your quotes...</h2>
                <p className="text-gray-600">Our AI is analyzing your uploaded quotes for comparison</p>
            </div>

            <Card>
                <CardContent className="p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-center">
                            <div className="relative">
                                <div className="w-32 h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    <span className="text-4xl">📄</span>
                                </div>
                                <div className="absolute inset-0 bg-[#f16c63] opacity-20 rounded-lg animate-pulse"></div>
                                <div className="absolute top-0 left-0 w-full h-1 bg-[#f16c63] animate-pulse rounded-t-lg"></div>
                            </div>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-[#f16c63] rounded-full animate-bounce"></div>
                                <div
                                    className="w-2 h-2 bg-[#f16c63] rounded-full animate-bounce"
                                    style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                    className="w-2 h-2 bg-[#f16c63] rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-600">
                                Reading your prior quote{uploadedQuoteFiles.length !== 1 ? "s" : ""}...
                            </p>
                        </div>

                        <Progress value={100} className="w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
