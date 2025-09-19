"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, Camera, Star, Check, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Mock data
const carMakes = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Nissan",
  "Hyundai",
]
const carModels = {
  Toyota: ["Camry", "Corolla", "RAV4", "Prius", "Highlander"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "Fit"],
  Ford: ["F-150", "Escape", "Explorer", "Mustang", "Focus"],
  Chevrolet: ["Silverado", "Equinox", "Malibu", "Tahoe", "Cruze"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "i3"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "A-Class"],
  Audi: ["A4", "A6", "Q5", "Q7", "A3"],
  Volkswagen: ["Jetta", "Passat", "Tiguan", "Golf", "Atlas"],
  Nissan: ["Altima", "Sentra", "Rogue", "Pathfinder", "Leaf"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent"],
}

const mockQuotes = [
  {
    id: 1,
    serviceCenterName: "AutoCare Plus",
    price: 450,
    rating: 4.8,
    description: "Transmission fluid change and brake pad replacement",
    details:
      "Complete transmission fluid flush with premium fluid, front and rear brake pad replacement with ceramic pads, brake system inspection",
    estimatedTime: "3-4 hours",
    warranty: "12 months / 12,000 miles",
  },
  {
    id: 2,
    serviceCenterName: "Precision Motors",
    price: 425,
    rating: 4.7,
    description: "Transmission service and brake work",
    details: "Transmission fluid and filter change, brake pad replacement, rotor resurfacing if needed",
    estimatedTime: "2-3 hours",
    warranty: "6 months / 6,000 miles",
  },
  {
    id: 3,
    serviceCenterName: "Elite Auto Service",
    price: 380,
    rating: 4.9,
    description: "Complete transmission and brake service",
    details: "Full transmission service, brake pad and rotor replacement, brake fluid flush",
    estimatedTime: "4-5 hours",
    warranty: "18 months / 18,000 miles",
  },
  {
    id: 4,
    serviceCenterName: "Quick Fix Garage",
    price: 320,
    rating: 4.6,
    description: "Transmission fluid and brake maintenance",
    details: "Transmission fluid change, brake pad replacement, basic inspection",
    estimatedTime: "2 hours",
    warranty: "6 months / 6,000 miles",
  },
  {
    id: 5,
    serviceCenterName: "Master Mechanics",
    price: 395,
    rating: 4.8,
    description: "Professional transmission and brake service",
    details: "Premium transmission service, high-performance brake pads, comprehensive inspection",
    estimatedTime: "3 hours",
    warranty: "12 months / 12,000 miles",
  },
]

type Step =
  | "welcome"
  | "car-selection"
  | "problem-description"
  | "media-upload"
  | "diagnosis"
  | "quotes"
  | "signup"
  | "quote-details"
  | "scheduling"
  | "confirmation"

export default function CustomerInterface() {
  const [currentStep, setCurrentStep] = useState<Step>("welcome")
  const [socketVisible, setSocketVisible] = useState(false)
  const [socketExpanded, setSocketExpanded] = useState(false)
  const [hasNotification, setHasNotification] = useState(false)
  const [selectedCar, setSelectedCar] = useState({ make: "", model: "", year: "" })
  const [problemDescription, setProblemDescription] = useState("")
  const [selectedQuote, setSelectedQuote] = useState<(typeof mockQuotes)[0] | null>(null)
  const [isSignedUp, setIsSignedUp] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const years = Array.from({ length: 46 }, (_, i) => 2025 - i)
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

  useEffect(() => {
    if (currentStep === "welcome") {
      const timer = setTimeout(() => {
        setSocketVisible(true)
        setSocketExpanded(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  useEffect(() => {
    if (currentStep === "confirmation") {
      const timer = setTimeout(() => {
        setHasNotification(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  const handleSocketClick = () => {
    if (hasNotification) {
      setHasNotification(false)
      // Show notification overlay
      alert("Great news! AutoCare Plus has accepted your proposal and provided a final quote.")
    } else {
      setSocketExpanded(!socketExpanded)
    }
  }

  const handleGetStarted = () => {
    setSocketExpanded(false)
    setTimeout(() => {
      setCurrentStep("car-selection")
    }, 500)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const renderWelcome = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f4f1] to-white">
      <div className="text-center max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Buckled.io</h1>
        <p className="text-xl text-gray-600 mb-8">
          Get expert car diagnosis and fair quotes from trusted service centers
        </p>

        {socketVisible && (
          <Dialog open={socketExpanded} onOpenChange={setSocketExpanded}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">🔧</span>
                  Hi, I'm Socket!
                </DialogTitle>
                <DialogDescription className="text-base">
                  Welcome! I'm here to help you resolve your car diagnosis and repair needs. I'll guide you through the
                  main steps to get you back on the road.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center pt-4">
                <Button onClick={handleGetStarted} className="bg-[#f16c63] hover:bg-[#e55a51] text-white">
                  Get Started
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Socket Assistant */}
      {socketVisible && !socketExpanded && (
        <div
          className="fixed bottom-6 right-6 w-12 h-12 bg-[#f16c63] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce-in"
          onClick={handleSocketClick}
        >
          <span className="text-xl">🔧</span>
          {hasNotification && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">1</span>
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderCarSelection = () => (
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
                onValueChange={(value) => setSelectedCar((prev) => ({ ...prev, make: value, model: "" }))}
              >
                <SelectTrigger>
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
                onValueChange={(value) => setSelectedCar((prev) => ({ ...prev, model: value }))}
                disabled={!selectedCar.make}
              >
                <SelectTrigger>
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
                onValueChange={(value) => setSelectedCar((prev) => ({ ...prev, year: value }))}
              >
                <SelectTrigger>
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
            <button
              onClick={() => setCurrentStep("problem-description")}
              className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer transition-colors"
            >
              Skip &gt;
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderProblemDescription = () => (
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
                onClick={() => setCurrentStep("media-upload")}
                disabled={!problemDescription.trim()}
                className="bg-[#f16c63] hover:bg-[#e55a51] text-white"
              >
                Continue
              </Button>
              <button
                onClick={() => setCurrentStep("media-upload")}
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

  const renderMediaUpload = () => (
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
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
            <div className="flex gap-4 justify-center">
              <div className="relative">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Upload className="w-4 h-4" />
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
                onClick={() => setCurrentStep("diagnosis")}
                className="bg-[#f16c63] hover:bg-[#e55a51] text-white"
              >
                Continue
              </Button>
              <button
                onClick={() => setCurrentStep("diagnosis")}
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

  const renderDiagnosis = () => (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#f16c63] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔧</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analyzing your issue...</h2>
        <Progress value={100} className="w-full max-w-md mx-auto" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🔧</span>
            Socket's Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">Based on your description and vehicle information, it appears you need:</p>
          <div className="bg-[#fef7f7] border border-[#f16c63] rounded-lg p-4">
            <h4 className="font-semibold text-[#732621] mb-2">Recommended Services:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#f16c63]" />
                Transmission fluid change (~$200)
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#f16c63]" />
                Brake pad replacement (~$250-400)
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-600">
            I recommend getting quotes from multiple service centers to ensure you get the best value. Even if one quote
            seems good, it never hurts to get a second opinion!
          </p>
          <Button
            onClick={() => setCurrentStep("quotes")}
            className="w-full bg-[#f16c63] hover:bg-[#e55a51] text-white"
          >
            Look at Quotes
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderQuotes = () => {
    const quoteLength = isSignedUp ? mockQuotes.length : 2
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
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
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(quote.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
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
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Blurred quotes requiring signup */}
          {!isSignedUp &&

            <div className="relative">
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <Card className="max-w-sm">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">See All Quotes</h3>
                    <p className="text-gray-600 mb-4">Sign up to view 3 more competitive quotes</p>
                    <Button onClick={() => setCurrentStep("signup")} className="bg-[#f16c63] hover:bg-[#e55a51] text-white">
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
          }
        </div>
      </div>
    )
  }

  const renderSignup = () => (
    <div className="max-w-md mx-auto px-6 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>Sign up to see all quotes and book services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button
            onClick={() => {
              setIsSignedUp(true)
              setCurrentStep("quotes")
            }}
            className="w-full bg-[#f16c63] hover:bg-[#e55a51] text-white"
          >
            Sign Up
          </Button>
          <Separator />
          <div className="space-y-2">
            <Button variant="outline" className="w-full bg-transparent">
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Continue with Facebook
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderQuoteDetails = () => (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {selectedQuote && (
        <>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedQuote.serviceCenterName}</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(selectedQuote.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
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

              <div className="bg-[#fef7f7] border border-[#f16c63] rounded-lg p-4">
                <h4 className="font-semibold text-[#732621] mb-2">Draft RFP Summary:</h4>
                <p className="text-sm text-gray-700">
                  Vehicle: {selectedCar.year} {selectedCar.make} {selectedCar.model}
                  <br />
                  Issue: {problemDescription}
                  <br />
                  Requested Services: Transmission fluid change, brake pad replacement
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setCurrentStep("quotes")} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </Button>
                <Button
                  onClick={() => setCurrentStep("scheduling")}
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

  const renderScheduling = () => (
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Select Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
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

  const renderConfirmation = () => (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Appointment Scheduled!</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🔧</span>
            Socket says...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            See that was easy! We're sending off this RFP to {selectedQuote?.serviceCenterName}. Remember to check your
            email, they will be in touch soon. Our Service Centers are top-notch, customer-focused, and are guaranteed
            to respond within 24 hours!
          </p>

          <div className="bg-[#fef7f7] border border-[#f16c63] rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <div className="flex items-center gap-2 text-sm text-[#732621]">
                <span>📧</span>
                <span>RFP</span>
                <span>→</span>
                <span>🔧</span>
                <span className="animate-pulse">Sending...</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
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

          <p className="text-sm text-gray-600">
            You can always come back here any time you have additional car needs or even just a question about your
            vehicle.
          </p>
        </CardContent>
      </Card>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "welcome":
        return renderWelcome()
      case "car-selection":
        return renderCarSelection()
      case "problem-description":
        return renderProblemDescription()
      case "media-upload":
        return renderMediaUpload()
      case "diagnosis":
        return renderDiagnosis()
      case "quotes":
        return renderQuotes()
      case "signup":
        return renderSignup()
      case "quote-details":
        return renderQuoteDetails()
      case "scheduling":
        return renderScheduling()
      case "confirmation":
        return renderConfirmation()
      default:
        return renderWelcome()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with breadcrumb navigation */}
      {currentStep !== "welcome" && (
        <div className="border-b bg-white sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-900">Buckled.io</h1>
                <div className="text-sm text-gray-500">
                  Step{" "}
                  {[
                    "car-selection",
                    "problem-description",
                    "media-upload",
                    "diagnosis",
                    "quotes",
                    "signup",
                    "quote-details",
                    "scheduling",
                    "confirmation",
                  ].indexOf(currentStep) + 1}{" "}
                  of 9
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {selectedCar.make && `${selectedCar.year} ${selectedCar.make} ${selectedCar.model}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main>{renderCurrentStep()}</main>

      {/* Socket Assistant - always visible after welcome */}
      {currentStep !== "welcome" && (
        <div
          className="fixed bottom-6 right-6 w-12 h-12 bg-[#f16c63] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={handleSocketClick}
        >
          <span className="text-xl">🔧</span>
          {hasNotification && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-xs text-white font-bold">1</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
