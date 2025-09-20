"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { SWRConfig } from 'swr'
import { localStorageProvider } from './swr-config'
import {
    defaultPendingRequests,
    defaultActiveQuotes,
    defaultScheduledServices,
    defaultCustomerReviews,
    defaultServiceCenterProfile,
    defaultRevenueData,
} from './service-center-data'

interface SWRProviderProps {
    children: React.ReactNode
}

interface SWRContextType {
    resetCache: () => void
}

const SWRContext = createContext<SWRContextType | null>(null)

export function useSWRReset() {
    const context = useContext(SWRContext)
    if (!context) {
        // Return a no-op function during SSR or if context is missing
        return { resetCache: () => { } }
    }
    return context
}

export function SWRProvider({ children }: SWRProviderProps) {
    const [isClient, setIsClient] = useState(false)
    const [cacheKey, setCacheKey] = useState(0) // Use a counter to force complete reset

    useEffect(() => {
        setIsClient(true)
    }, [])

    const resetCache = () => {
        if (typeof window !== 'undefined') {
            // Clear localStorage
            localStorage.removeItem('app-cache')
            localStorage.clear()
        }

        // Force a complete SWR reset by changing the key
        setCacheKey(prev => prev + 1)
    }

    if (!isClient) {
        // During SSR or before hydration, still provide context but without SWR
        return (
            <SWRContext.Provider value={{ resetCache }}>
                {children}
            </SWRContext.Provider>
        )
    }

    return (
        <SWRContext.Provider value={{ resetCache }}>
            <SWRConfig
                key={cacheKey} // This will force a complete reset when changed
                value={{
                    provider: () => localStorageProvider(),
                    fallback: {
                        'service-center/pending-requests': defaultPendingRequests,
                        'service-center/active-quotes': defaultActiveQuotes,
                        'service-center/scheduled-services': defaultScheduledServices,
                        'service-center/customer-reviews': defaultCustomerReviews,
                        'service-center/profile': defaultServiceCenterProfile,
                        'service-center/revenue-data': defaultRevenueData,
                    },
                }}
            >
                {children}
            </SWRConfig>
        </SWRContext.Provider>
    )
}
