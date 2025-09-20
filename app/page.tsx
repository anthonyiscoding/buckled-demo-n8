"use client"

import React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { SocketAssistant } from "@/components/ui/socket-assistant"
import {
  UploadIcon,
  Camera,
  Star,
  Check,
  ArrowLeft,
  ArrowRight,
  FileText,
  Wrench,
  Clock,
  CheckSquare,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

// Interface for Socket messages
interface Message {
  id: string
  text: string
  sender: 'user' | 'socket'
  timestamp: Date
}

// Custom hook for localStorage with SSR support
function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key)
        if (item) {
          setValue(JSON.parse(item))
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error)
      }
    }
  }, [key])

  const setStoredValue = (newValue: T) => {
    setValue(newValue)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    }
  }

  return [value, setStoredValue, isHydrated] as const
}

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
  | "quote-upload" // Added new step for uploading existing quotes
  | "quote-scanning" // Added new step for scanning animation
  | "diagnosis"
  | "quotes"
  | "signup"
  | "quote-details"
  | "rfp-confirmation" // Added new step for RFP confirmation
  | "scheduling"
  | "confirmation"

interface CarSelection {
  make: string
  model: string
  year: string
}

// Star Rating Component
const StarRating = ({ rating, className = "w-4 h-4" }: { rating: number; className?: string }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => {
        const difference = rating - i;

        return (
          <div key={i} className="relative">
            {/* Base star (always gray) */}
            <Star className={`${className} text-gray-300`} />

            {/* Filled portion overlay */}
            {difference > 0 && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  clipPath: `polygon(0 0, ${Math.min(difference * 100, 100)}% 0, ${Math.min(difference * 100, 100)}% 100%, 0 100%)`
                }}
              >
                <Star className={`${className} fill-yellow-400 text-yellow-400`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CustomerInterface() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get current step from URL, default to welcome
  const currentStep = (searchParams.get('step') as Step) || "welcome"

  // Function to navigate to a new step
  const setCurrentStep = (step: Step) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('step', step)
    router.push(`?${params.toString()}`)
  }

  // Function to clear all stored progress
  const clearProgress = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('selectedCar')
      localStorage.removeItem('problemDescription')
      localStorage.removeItem('selectedQuote')
      localStorage.removeItem('isSignedUp')
      localStorage.removeItem('selectedDate')
      localStorage.removeItem('selectedTime')
    }
    // Reset state
    setSelectedCar({ make: "", model: "", year: "" })
    setProblemDescription("")
    setSelectedQuote(null)
    setIsSignedUp(false)
    setSelectedDate(null)
    setSelectedTime("")
    // Go back to welcome
    setCurrentStep("welcome")
  }

  const [socketVisible, setSocketVisible] = useState(false)
  const [socketExpanded, setSocketExpanded] = useState(false)
  const [shouldOpenChat, setShouldOpenChat] = useState(false)

  // Continue button state
  const [showContinueButton, setShowContinueButton] = useState(false)
  const [continueButtonText, setContinueButtonText] = useState("Continue")

  // State for external Socket messages that get added to SocketChat
  const [externalSocketMessages, setExternalSocketMessages] = useState<Message[]>([])

  // Function to add messages to SocketChat from automatic events
  const addSocketMessage = (message: Omit<Message, 'id' | 'timestamp'>, autoOpen: boolean = false) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    setExternalSocketMessages(prev => [...prev, newMessage])
    // Only auto-open the chat if explicitly requested
    if (autoOpen) {
      setShouldOpenChat(true)
    }
  }  // Use localStorage hook for persistent state
  const [selectedCar, setSelectedCar, carHydrated] = useLocalStorage<CarSelection>('selectedCar', { make: "", model: "", year: "" })
  const [problemDescription, setProblemDescription, descriptionHydrated] = useLocalStorage('problemDescription', "")
  const [selectedQuote, setSelectedQuote, quoteHydrated] = useLocalStorage<(typeof mockQuotes)[0] | null>('selectedQuote', null)
  const [isSignedUp, setIsSignedUp, signupHydrated] = useLocalStorage('isSignedUp', false)
  const [selectedTime, setSelectedTime, timeHydrated] = useLocalStorage('selectedTime', "")

  // Special handling for Date objects
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [dateHydrated, setDateHydrated] = useState(false)

  useEffect(() => {
    setDateHydrated(true)
    if (typeof window !== 'undefined') {
      const savedDate = localStorage.getItem('selectedDate')
      if (savedDate) {
        setSelectedDate(new Date(savedDate))
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && selectedDate) {
      localStorage.setItem('selectedDate', selectedDate.toISOString())
    }
  }, [selectedDate])

  // Check if all data is hydrated
  const isHydrated = carHydrated && descriptionHydrated && quoteHydrated && signupHydrated && timeHydrated && dateHydrated

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadedQuoteFiles, setUploadedQuoteFiles] = useState<File[]>([]) // Added state for quote files
  const [rfpSent, setRfpSent] = useState(false)
  const [proposalReady, setProposalReady] = useState(false)
  const [diagnosisProgress, setDiagnosisProgress] = useState(0)
  const [showDiagnosisResults, setShowDiagnosisResults] = useState(false)

  const years = ["Don't know", ...Array.from({ length: 46 }, (_, i) => 2025 - i)]
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

  // Save to localStorage when values change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCar', JSON.stringify(selectedCar))
    }
  }, [selectedCar])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('problemDescription', problemDescription)
    }
  }, [problemDescription])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedQuote', JSON.stringify(selectedQuote))
    }
  }, [selectedQuote])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isSignedUp', isSignedUp.toString())
    }
  }, [isSignedUp])

  useEffect(() => {
    if (typeof window !== 'undefined' && selectedDate) {
      localStorage.setItem('selectedDate', selectedDate.toISOString())
    }
  }, [selectedDate])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedTime', selectedTime)
    }
  }, [selectedTime])

  useEffect(() => {
    if (currentStep === "welcome") {
      const timer = setTimeout(() => {
        setSocketVisible(true)
        // Add welcome message to chat and auto-open it
        addSocketMessage({
          text: "Welcome! I'm here to help you resolve your car diagnosis and repair needs. I'll guide you through the main steps to get you back on the road.",
          sender: 'socket'
        }, true) // Auto-open for welcome message
        // Show continue button for welcome step
        setShowContinueButton(true)
        setContinueButtonText("Get Started")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  useEffect(() => {
    if (currentStep === "confirmation") {
      // Make Socket visible after a delay
      setSocketVisible(true)
      const timer = setTimeout(() => {
        // Add confirmation message to chat and auto-open
        addSocketMessage({
          text: "Congratulations! 🎉 Your appointment has been successfully scheduled! The service center will contact you within 24 hours to confirm the details. I'm always here if you need help with future car troubles!",
          sender: 'socket'
        }, true) // Auto-open for confirmation message
        // Show continue button for confirmation step
        setShowContinueButton(true)
        setContinueButtonText("Got it!")
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  useEffect(() => {
    // Auto-advance after 3 seconds for quote-scanning step
    if (currentStep === "quote-scanning") {
      const timer = setTimeout(() => {
        setCurrentStep("diagnosis")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, setCurrentStep])

  useEffect(() => {
    if (currentStep === "rfp-confirmation") {
      setRfpSent(false)
      setProposalReady(false)

      // Start RFP sending animation
      const sendTimer = setTimeout(() => {
        setRfpSent(true)
      }, 1000)

      // Show proposal ready after 5 seconds
      const readyTimer = setTimeout(() => {
        setProposalReady(true)
      }, 5000)

      // Auto-advance to scheduling after 7 seconds
      const advanceTimer = setTimeout(() => {
        setCurrentStep("scheduling")
      }, 8000)

      return () => {
        clearTimeout(sendTimer)
        clearTimeout(readyTimer)
        clearTimeout(advanceTimer)
      }
    }
  }, [currentStep])

  // Animate diagnosis progress over 3 seconds
  useEffect(() => {
    if (currentStep === "diagnosis") {
      setDiagnosisProgress(0)
      setShowDiagnosisResults(false)
      const duration = 3000 // 3 seconds
      const startTime = Date.now()

      const animateProgress = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min((elapsed / duration) * 100, 100)
        setDiagnosisProgress(progress)

        if (progress < 100) {
          requestAnimationFrame(animateProgress)
        } else {
          // Show diagnosis results with fade-in after progress completes
          setTimeout(() => {
            setShowDiagnosisResults(true)
          }, 500)
        }
      }

      requestAnimationFrame(animateProgress)
    }
  }, [currentStep])

  const handleSocketClick = () => {
    // Just open the chat, don't trigger any messages
    // Messages should be triggered by specific events, not user clicks
    setShouldOpenChat(true)
  }

  const handleChatOpenChange = (isOpen: boolean) => {
    // Reset the shouldOpenChat flag when chat closes
    if (!isOpen) {
      setShouldOpenChat(false)
    }
  }

  const handleContinueClick = () => {
    setShowContinueButton(false)

    // Handle different continue actions based on current step
    if (currentStep === "welcome") {
      setCurrentStep("car-selection")
    } else if (currentStep === "confirmation") {
      // Could navigate to a different screen or close the chat
      setShowContinueButton(false)
    }
  }


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const handleQuoteFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedQuoteFiles((prev) => [...prev, ...files])
  }

  const renderWelcome = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f4f1] to-white">
      <div className="text-center max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Buckled.io</h1>
        <p className="text-xl text-gray-600 mb-8">
          Get expert car diagnosis and fair quotes from trusted service centers
        </p>
      </div>
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
                onValueChange={(value) => setSelectedCar({ ...selectedCar, make: value, model: "" })}
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
                onValueChange={(value) => setSelectedCar({ ...selectedCar, model: value })}
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
                onValueChange={(value) => setSelectedCar({ ...selectedCar, year: value })}
                disabled={!selectedCar.model}
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

  const renderQuoteUpload = () => (
    <div className="max-w-2xl mx-auto px-6 py-12">
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
            <div className="flex gap-4 justify-center">
              <div className="relative">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
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
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Camera className="w-4 h-4" />
                Take Photo
              </Button>
            </div>
          </div>

          {uploadedQuoteFiles.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Uploaded Quote Files:</h4>
              <div className="space-y-2">
                {uploadedQuoteFiles.map((file, index) => (
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
              onClick={() => setCurrentStep("media-upload")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex-1 flex items-center justify-between">
              <Button
                onClick={() => {
                  if (uploadedQuoteFiles.length > 0) {
                    setCurrentStep("quote-scanning")
                  } else {
                    setCurrentStep("diagnosis")
                  }
                }}
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

  const renderQuoteScanning = () => (
    <div className="max-w-2xl mx-auto px-6 py-12">
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

  const renderDiagnosis = () => (
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

  const renderQuotes = () => {
    const quoteLength = isSignedUp ? mockQuotes.length : 1
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
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-start justify-center rounded-lg">
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
          <div className="space-y-2">
            <Button
              onClick={() => {
                setIsSignedUp(true)
                setCurrentStep("quotes")
              }}
              variant="outline"
              className="w-full bg-transparent"
            >
              Continue with Google
            </Button>
            <Button
              onClick={() => {
                setIsSignedUp(true)
                setCurrentStep("quotes")
              }}
              variant="outline"
              className="w-full bg-transparent"
            >
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
                <p className="text-sm align-items">
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
                </p>
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

  const renderRfpConfirmation = () => (
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
            <DatePicker
              placeholderText="Pick a date"
              selected={selectedDate}
              onChange={setSelectedDate}
              minDate={new Date()}
              maxDate={new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)}
              dateFormat="MMMM d, yyyy"
              className="w-full px-3 py-2 border rounded-md"
            />
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

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            All Set!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            See that was easy! We're sending off this RFP to {selectedQuote?.serviceCenterName}. Remember to check your
            email, they will be in touch soon. Our Service Centers are top-notch, customer-focused, and are always guaranteed
            to respond within 24 hours!
          </p>

          <div className="bg-success animate-pulse rounded-lg p-4 animate-fade-in-delayed">
            <div className="flex items-center justify-center mb-2">
              <div className="flex items-center gap-2 text-lg">
                <span>📧</span>
                <span>RFP</span>
                <span>→</span>
                <span>🔧</span>
                <span>Sent</span>
              </div>
            </div>
          </div>

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
      case "quote-upload": // Added new quote upload case
        return renderQuoteUpload()
      case "quote-scanning": // Added new quote scanning case
        return renderQuoteScanning()
      case "diagnosis":
        return renderDiagnosis()
      case "quotes":
        return renderQuotes()
      case "signup":
        return renderSignup()
      case "quote-details":
        return renderQuoteDetails()
      case "rfp-confirmation": // Added new rfp confirmation case
        return renderRfpConfirmation()
      case "scheduling":
        return renderScheduling()
      case "confirmation":
        return renderConfirmation()
      default:
        return renderWelcome()
    }
  }

  // Prevent hydration mismatch by not rendering until client-side hydration is complete
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f4f1] to-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#f16c63] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
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
              </div>
              <div className="text-sm text-gray-600">
                {selectedCar.make && `${selectedCar.year != "Don't know" ? selectedCar.year : ""} ${selectedCar.make} ${selectedCar.model}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main>{renderCurrentStep()}</main>

      <SocketAssistant
        isVisible={true}
        isExpanded={false}
        onClick={handleSocketClick}
        externalMessages={externalSocketMessages}
        onAddMessage={addSocketMessage}
        shouldOpenChat={shouldOpenChat}
        onChatOpenChange={handleChatOpenChange}
        showContinueButton={showContinueButton}
        continueButtonText={continueButtonText}
        onContinueClick={handleContinueClick}
      />
    </div>
  )
}

// Loading component for Suspense fallback
function SearchParamsLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f4f1] to-white">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#f16c63] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

// Default export wrapped in Suspense
export default function Page() {
  return (
    <Suspense fallback={<SearchParamsLoader />}>
      <CustomerInterface />
    </Suspense>
  )
}
