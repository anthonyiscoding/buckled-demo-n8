import { UploadIcon, Camera, ArrowLeft } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { useUploadedFiles, useNavigation } from "@/lib/hooks"

export function MediaUpload() {
    const { uploadedFiles, setUploadedFiles } = useUploadedFiles()
    const { setCurrentStep } = useNavigation()

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        setUploadedFiles([...uploadedFiles, ...files])
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Share photos or videos</h2>
                <p className="text-gray-600">Visual evidence helps our experts provide better diagnosis (optional)</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upload Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
                        <div className="flex gap-4 justify-center">
                            <div className="relative">
                                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                                    <UploadIcon className="w-4 h-4" />
                                    Upload Files
                                </Button>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                                <Camera className="w-4 h-4" />
                                Take Photo
                            </Button>
                        </div>
                    </div>

                    {uploadedFiles.length > 0 && (
                        <div>
                            <h4 className="font-medium mb-2">Uploaded Files:</h4>
                            <div className="space-y-2">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                        <span className="text-sm">{file.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep("problem-description")}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        <div className="flex-1 flex items-center justify-between">
                            <Button
                                onClick={() => setCurrentStep("quote-upload")} // Updated to go to quote-upload instead of diagnosis
                                className="bg-[#f16c63] hover:bg-[#e55a51] text-white"
                            >
                                Continue
                            </Button>
                            <button
                                onClick={() => setCurrentStep("quote-upload")} // Updated to go to quote-upload instead of diagnosis
                                className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer transition-colors ml-4"
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
