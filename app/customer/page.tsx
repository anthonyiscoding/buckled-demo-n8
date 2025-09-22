"use client"

import React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { SocketAssistant } from "@/components/ui/socket-assistant"
import { SWRProvider } from "@/lib/swr-provider"
import {
  useSocketState,
  useSocketMessages,
  useOtherState,
  useUploadedQuoteFiles,
  useNavigation,
  useHasExistingData
} from "@/lib/hooks"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react";
// Import all screen components
import { Welcome } from "@/app/customer/screens/welcome"
import { CarSelection } from "@/app/customer/screens/car-selection"
import { ProblemDescription } from "@/app/customer/screens/problem-description"
import { MediaUpload } from "@/app/customer/screens/media-upload"
import { QuoteUpload, QuoteScanning } from "@/app/customer/screens/quote-upload"
import { Diagnosis } from "@/app/customer/screens/diagnosis"
import { QuotesSummary } from "@/app/customer/screens/quotes-summary"
import { Signup } from "@/app/customer/screens/signup"
import { QuotesDetail } from "@/app/customer/screens/quotes-detail"
import { RfpConfirmation } from "@/app/customer/screens/rfp-confirmation"
import { Scheduling } from "@/app/customer/screens/scheduling"
import { Confirmation } from "@/app/customer/screens/confirmation"
import Image from "next/image"

type Step =
  | "welcome"
  | "car-selection"
  | "problem-description"
  | "media-upload"
  | "quote-upload"
  | "quote-scanning"
  | "diagnosis"
  | "quotes"
  | "signup"
  | "quote-details"
  | "rfp-confirmation"
  | "scheduling"
  | "confirmation"

function CustomerInterface() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentStep = (searchParams.get('step') as Step) || "welcome"

  // Track which steps have already shown their messages to prevent re-running effects
  const [shownMessages, setShownMessages] = useState<Set<Step>>(new Set())

  const {
    socketVisible,
    setSocketVisible,
    shouldOpenChat,
    setShouldOpenChat,
    showContinueButton,
    setShowContinueButton,
    continueButtonText,
    setContinueButtonText
  } = useSocketState()

  const {
    externalSocketMessages,
    addSocketMessage
  } = useSocketMessages()

  const {
    setDiagnosisProgress,
    setShowDiagnosisResults,
    setRfpSent,
    setProposalReady,
    diagnosisResponse,
    diagnosisLoading,
    showInvalidRequestMessage,
    setShowInvalidRequestMessage
  } = useOtherState()

  const { uploadedQuoteFiles } = useUploadedQuoteFiles()
  const { setCurrentStep, clearProgressCustomer, transitionKey } = useNavigation()
  const { hasExistingData } = useHasExistingData()

  // Socket refers to the visual character, not web sockets
  useEffect(() => {
    if (currentStep === "welcome") {
      const timer = setTimeout(() => {
        setSocketVisible(true)

        if (hasExistingData) {
          addSocketMessage({
            text: "Welcome back! I see you have some information saved from before. You can continue where you left off or start fresh with a new quote. What would you like to do?",
            sender: 'socket'
          }, true) // Clear messages first
          // Don't open chat for returning users - they use the buttons instead
          setShowContinueButton(false)
        } else {
          addSocketMessage({
            text: "Welcome! I'm here to help you resolve your car diagnosis and repair needs. I'll guide you through the main steps to get you back on the road.",
            sender: 'socket'
          }, true) // Clear messages first
          setShouldOpenChat(true)
          setShowContinueButton(true)
          setContinueButtonText("Get Started")
        }

        // Mark this message as shown
        setShownMessages(prev => new Set(prev).add("welcome"))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, hasExistingData, shownMessages, setSocketVisible, addSocketMessage, setShouldOpenChat, setShowContinueButton, setContinueButtonText])

  useEffect(() => {
    if (currentStep === "confirmation" && !shownMessages.has("confirmation")) {
      setSocketVisible(true)
      const timer = setTimeout(() => {
        addSocketMessage({
          text: "Congratulations! 🎉 Your appointment has been successfully scheduled! The service center will contact you within 24 hours to confirm the details. I'm always here if you need help with future car troubles!",
          sender: 'socket'
        })
        setShouldOpenChat(true)
        setShowContinueButton(true)
        setContinueButtonText("Got it!")

        // Mark this message as shown
        setShownMessages(prev => new Set(prev).add("confirmation"))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentStep, shownMessages, setSocketVisible, addSocketMessage, setShouldOpenChat, setShowContinueButton, setContinueButtonText])

  useEffect(() => {
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

      const sendTimer = setTimeout(() => {
        setRfpSent(true)
      }, 1000)

      const readyTimer = setTimeout(() => {
        setProposalReady(true)
      }, 5000)

      const advanceTimer = setTimeout(() => {
        setCurrentStep("scheduling")
      }, 8000)

      return () => {
        clearTimeout(sendTimer)
        clearTimeout(readyTimer)
        clearTimeout(advanceTimer)
      }
    }
  }, [currentStep, setRfpSent, setProposalReady, setCurrentStep])

  useEffect(() => {
    if (currentStep === "diagnosis") {
      setDiagnosisProgress(0)
      setShowDiagnosisResults(false)
    }
  }, [currentStep, setDiagnosisProgress, setShowDiagnosisResults])

  // Separate effect to handle diagnosis progress based on API response
  useEffect(() => {
    if (currentStep === "diagnosis" && diagnosisResponse && !diagnosisLoading) {
      // Only start progress when we have a response and we're not loading
      const duration = 1000
      const startTime = Date.now()

      const animateProgress = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min((elapsed / duration) * 100, 100)
        setDiagnosisProgress(progress)

        if (progress < 100) {
          requestAnimationFrame(animateProgress)
        } else {
          setTimeout(() => {
            setShowDiagnosisResults(true)
          }, 500)
        }
      }

      requestAnimationFrame(animateProgress)
    }
  }, [currentStep, diagnosisResponse, diagnosisLoading, setDiagnosisProgress, setShowDiagnosisResults])

  const handleSocketClick = () => {
    setShouldOpenChat(true)
  }

  const handleChatOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setShouldOpenChat(false)
    }
  }

  const handleContinueClick = () => {
    setShowContinueButton(false)

    if (currentStep === "welcome") {
      setCurrentStep("car-selection")
    } else if (currentStep === "confirmation") {
      setShowContinueButton(false)
    } else if (currentStep === "diagnosis" && showInvalidRequestMessage) {
      // Handle retry - reset invalid request state and go back to problem description
      setShowInvalidRequestMessage(false)
      setCurrentStep("problem-description")
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "welcome":
        return <Welcome />
      case "car-selection":
        return <CarSelection />
      case "problem-description":
        return <ProblemDescription />
      case "media-upload":
        return <MediaUpload />
      case "quote-upload":
        return <QuoteUpload />
      case "quote-scanning":
        return <QuoteScanning />
      case "diagnosis":
        return <Diagnosis />
      case "quotes":
        return <QuotesSummary />
      case "signup":
        return <Signup />
      case "quote-details":
        return <QuotesDetail />
      case "rfp-confirmation":
        return <RfpConfirmation />
      case "scheduling":
        return <Scheduling />
      case "confirmation":
        return <Confirmation />
      default:
        return <Welcome />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f1] to-white">
      {/* Header with breadcrumb navigation */}
      <div className="fixed top-0 left-0 right-0 z-[9999] pt-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-lg z-[5] w-full px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                  <Image src="/images/logos/buckled-horizontal.svg" alt="The buckled.io logo" width={150} height={30} />
                </Link>
                <span className="text-sm text-gray-500">Customer Portal</span>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="outline" size="sm">
                    <LogOut className="w-4 h-4 mr-2" />
                    Exit
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={transitionKey}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{
              duration: 0.1,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className="w-full"
          >
            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
              <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
                {renderCurrentStep()}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

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

// Default export wrapped in Suspense and SWR Provider
export default function Page() {
  return (
    <Suspense fallback={<SearchParamsLoader />}>
      <CustomerInterface />
    </Suspense>
  )
}
