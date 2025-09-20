"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { SWRConfig } from 'swr'
import { localStorageProvider } from './swr-config'

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
    const [cacheKey, setCacheKey] = useState(0) // Force re-render with new provider

    useEffect(() => {
        setIsClient(true)
    }, [])

    const resetCache = () => {
        if (typeof window !== 'undefined') {
            // Clear localStorage
            localStorage.removeItem('app-cache')
            localStorage.clear()
        }

        // Force a new provider instance by updating the key
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
                key={cacheKey} // This forces a complete re-mount with fresh cache
                value={{
                    provider: () => new Map(), // Fresh Map for each reset
                    fallback: {},
                }}
            >
                {children}
            </SWRConfig>
        </SWRContext.Provider>
    )
}