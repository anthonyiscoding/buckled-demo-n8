"use client"

import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

// Types
interface CarSelection {
    make: string
    model: string
    year: string
}

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

interface Message {
    id: string
    text: string
    sender: 'user' | 'socket'
    timestamp: Date
}

// Custom hooks using SWR for state management
export function useCarSelection() {
    const { data: selectedCar, mutate: setSelectedCar } = useSWR<CarSelection>(
        'selectedCar',
        null,
        {
            fallbackData: { make: "", model: "", year: "" }
        }
    )

    return {
        selectedCar: selectedCar!,
        setSelectedCar: (car: CarSelection) => setSelectedCar(car, { revalidate: false })
    }
}

export function useProblemDescription() {
    const { data: problemDescription, mutate: setProblemDescription } = useSWR<string>(
        'problemDescription',
        null,
        {
            fallbackData: ""
        }
    )

    return {
        problemDescription: problemDescription!,
        setProblemDescription: (description: string) => setProblemDescription(description, { revalidate: false })
    }
}

export function useSelectedQuote() {
    const { data: selectedQuote, mutate: setSelectedQuote } = useSWR<any>(
        'selectedQuote',
        null,
        {
            fallbackData: null
        }
    )

    return {
        selectedQuote,
        setSelectedQuote: (quote: any) => setSelectedQuote(quote, { revalidate: false })
    }
}

export function useSignupStatus() {
    const { data: isSignedUp, mutate: setIsSignedUp } = useSWR<boolean>(
        'isSignedUp',
        null,
        {
            fallbackData: false
        }
    )

    return {
        isSignedUp: isSignedUp!,
        setIsSignedUp: (status: boolean) => setIsSignedUp(status, { revalidate: false })
    }
}

export function useSelectedDate() {
    const { data: selectedDate, mutate: setSelectedDate } = useSWR<Date | null>(
        'selectedDate',
        null,
        {
            fallbackData: null
        }
    )

    return {
        selectedDate,
        setSelectedDate: (date: Date | null) => setSelectedDate(date, { revalidate: false })
    }
}

export function useSelectedTime() {
    const { data: selectedTime, mutate: setSelectedTime } = useSWR<string>(
        'selectedTime',
        null,
        {
            fallbackData: ""
        }
    )

    return {
        selectedTime: selectedTime!,
        setSelectedTime: (time: string) => setSelectedTime(time, { revalidate: false })
    }
}

export function useUploadedFiles() {
    const { data: uploadedFiles, mutate: setUploadedFiles } = useSWR<File[]>(
        'uploadedFiles',
        null,
        {
            fallbackData: []
        }
    )

    return {
        uploadedFiles: uploadedFiles!,
        setUploadedFiles: (files: File[]) => setUploadedFiles(files, { revalidate: false })
    }
}

export function useUploadedQuoteFiles() {
    const { data: uploadedQuoteFiles, mutate: setUploadedQuoteFiles } = useSWR<File[]>(
        'uploadedQuoteFiles',
        null,
        {
            fallbackData: []
        }
    )

    return {
        uploadedQuoteFiles: uploadedQuoteFiles!,
        setUploadedQuoteFiles: (files: File[]) => setUploadedQuoteFiles(files, { revalidate: false })
    }
}

export function useSocketMessages() {
    const { data: externalSocketMessages, mutate: setExternalSocketMessages } = useSWR<Message[]>(
        'externalSocketMessages',
        null,
        {
            fallbackData: []
        }
    )

    // Normalize messages to ensure timestamps are Date objects
    const normalizedMessages = (externalSocketMessages || []).map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
    }))

    const addSocketMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>, clearFirst: boolean = false) => {
        const newMessage: Message = {
            ...message,
            id: Date.now().toString(),
            timestamp: new Date()
        }
        const currentMessages = clearFirst ? [] : normalizedMessages
        const isDuplicate = currentMessages.some((m) => {
            return m.text === newMessage.text
        })

        if (isDuplicate) {
            console.log('Duplicate message prevented:', newMessage.text)
            return
        }

        setExternalSocketMessages([...currentMessages, newMessage], { revalidate: false })
    }, [normalizedMessages, setExternalSocketMessages])

    const clearSocketMessages = useCallback(() => {
        setExternalSocketMessages([], { revalidate: false })
    }, [setExternalSocketMessages])

    return {
        externalSocketMessages: normalizedMessages,
        setExternalSocketMessages: (messages: Message[]) => setExternalSocketMessages(messages, { revalidate: false }),
        addSocketMessage,
        clearSocketMessages
    }
}

export function useSocketState() {
    const { data: socketVisible, mutate: setSocketVisible } = useSWR<boolean>(
        'socketVisible',
        null,
        {
            fallbackData: false
        }
    )

    const { data: shouldOpenChat, mutate: setShouldOpenChat } = useSWR<boolean>(
        'shouldOpenChat',
        null,
        {
            fallbackData: false
        }
    )

    const { data: showContinueButton, mutate: setShowContinueButton } = useSWR<boolean>(
        'showContinueButton',
        null,
        {
            fallbackData: false
        }
    )

    const { data: continueButtonText, mutate: setContinueButtonText } = useSWR<string>(
        'continueButtonText',
        null,
        {
            fallbackData: "Continue"
        }
    )

    return {
        socketVisible: socketVisible!,
        setSocketVisible: useCallback((visible: boolean) => setSocketVisible(visible, { revalidate: false }), [setSocketVisible]),
        shouldOpenChat: shouldOpenChat!,
        setShouldOpenChat: useCallback((open: boolean) => setShouldOpenChat(open, { revalidate: false }), [setShouldOpenChat]),
        showContinueButton: showContinueButton!,
        setShowContinueButton: useCallback((show: boolean) => setShowContinueButton(show, { revalidate: false }), [setShowContinueButton]),
        continueButtonText: continueButtonText!,
        setContinueButtonText: useCallback((text: string) => setContinueButtonText(text, { revalidate: false }), [setContinueButtonText])
    }
}

export function useOtherState() {
    const { data: rfpSent, mutate: setRfpSent } = useSWR<boolean>(
        'rfpSent',
        null,
        {
            fallbackData: false
        }
    )

    const { data: proposalReady, mutate: setProposalReady } = useSWR<boolean>(
        'proposalReady',
        null,
        {
            fallbackData: false
        }
    )

    const { data: diagnosisProgress, mutate: setDiagnosisProgress } = useSWR<number>(
        'diagnosisProgress',
        null,
        {
            fallbackData: 0
        }
    )

    const { data: showDiagnosisResults, mutate: setShowDiagnosisResults } = useSWR<boolean>(
        'showDiagnosisResults',
        null,
        {
            fallbackData: false
        }
    )

    return {
        rfpSent: rfpSent!,
        setRfpSent: useCallback((sent: boolean) => setRfpSent(sent, { revalidate: false }), [setRfpSent]),
        proposalReady: proposalReady!,
        setProposalReady: useCallback((ready: boolean) => setProposalReady(ready, { revalidate: false }), [setProposalReady]),
        diagnosisProgress: diagnosisProgress!,
        setDiagnosisProgress: useCallback((progress: number) => setDiagnosisProgress(progress, { revalidate: false }), [setDiagnosisProgress]),
        showDiagnosisResults: showDiagnosisResults!,
        setShowDiagnosisResults: useCallback((show: boolean) => setShowDiagnosisResults(show, { revalidate: false }), [setShowDiagnosisResults])
    }
}

// Navigation hook
export function useNavigation() {
    const router = useRouter()

    const setCurrentStep = useCallback((step: Step) => {
        const params = new URLSearchParams(window.location.search)
        params.set('step', step)
        router.push(`?${params.toString()}`)
    }, [router])

    const clearProgress = useCallback(() => {
        // Clear all SWR cache keys
        const keys = [
            'selectedCar',
            'problemDescription',
            'selectedQuote',
            'isSignedUp',
            'selectedDate',
            'selectedTime',
            'uploadedFiles',
            'uploadedQuoteFiles',
            'externalSocketMessages',
            'socketVisible',
            'shouldOpenChat',
            'showContinueButton',
            'continueButtonText',
            'rfpSent',
            'proposalReady',
            'diagnosisProgress',
            'showDiagnosisResults'
        ]

        // Clear localStorage cache
        localStorage.removeItem('app-cache')

        // Go back to welcome
        setCurrentStep("welcome")
    }, [setCurrentStep])

    return { setCurrentStep, clearProgress }
}