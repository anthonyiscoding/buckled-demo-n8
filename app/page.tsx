"use client"

import React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SocketAssistant } from "@/components/ui/socket-assistant"
import { SWRProvider } from "@/lib/swr-provider"
import {
  useSocketState,
  useSocketMessages,
  useOtherState,
  useUploadedQuoteFiles,
  useNavigation
} from "@/lib/hooks"

// Import all screen components
import { Welcome } from "@/components/screens/welcome"
import { CarSelection } from "@/components/screens/car-selection"
import { ProblemDescription } from "@/components/screens/problem-description"
import { MediaUpload } from "@/components/screens/media-upload"
import { QuoteUpload, QuoteScanning } from "@/components/screens/quote-upload"
import { Diagnosis } from "@/components/screens/diagnosis"
import { QuotesSummary } from "@/components/screens/quotes-summary"
import { Signup } from "@/components/screens/signup"
import { QuotesDetail } from "@/components/screens/quotes-detail"
import { RfpConfirmation } from "@/components/screens/rfp-confirmation"
import { Scheduling } from "@/components/screens/scheduling"
import { Confirmation } from "@/components/screens/confirmation"

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
    setProposalReady
  } = useOtherState()

  const { uploadedQuoteFiles } = useUploadedQuoteFiles()
  const { setCurrentStep, clearProgress } = useNavigation()

  // Socket refers to the visual character, not web sockets
  useEffect(() => {
    if (currentStep === "welcome") {
      const timer = setTimeout(() => {
        setSocketVisible(true)
        addSocketMessage({
          text: "Welcome! I'm here to help you resolve your car diagnosis and repair needs. I'll guide you through the main steps to get you back on the road.",
          sender: 'socket'
        })
        setShouldOpenChat(true)
        setShowContinueButton(true)
        setContinueButtonText("Get Started")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  useEffect(() => {
    if (currentStep === "confirmation") {
      setSocketVisible(true)
      const timer = setTimeout(() => {
        addSocketMessage({
          text: "Congratulations! 🎉 Your appointment has been successfully scheduled! The service center will contact you within 24 hours to confirm the details. I'm always here if you need help with future car troubles!",
          sender: 'socket'
        })
        setShouldOpenChat(true)
        setShowContinueButton(true)
        setContinueButtonText("Got it!")
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

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
  }, [currentStep])

  useEffect(() => {
    if (currentStep === "diagnosis") {
      setDiagnosisProgress(0)
      setShowDiagnosisResults(false)
      const duration = 3000
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
  }, [currentStep])

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
    <div className="min-h-screen bg-white">
      {/* Header with breadcrumb navigation */}
      {currentStep !== "welcome" && (
        <div className="border-b bg-white sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-900">Buckled.io</h1>
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

// Default export wrapped in Suspense and SWR Provider
export default function Page() {
  return (
    <SWRProvider>
      <Suspense fallback={<SearchParamsLoader />}>
        <CustomerInterface />
      </Suspense>
    </SWRProvider>
  )
}
