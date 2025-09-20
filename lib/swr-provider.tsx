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
    const [useMemoryCache, setUseMemoryCache] = useState(false) // Switch between localStorage and memory cache

    useEffect(() => {
        setIsClient(true)
    }, [])

    const resetCache = () => {
        if (typeof window !== 'undefined') {
            // Clear localStorage
            localStorage.removeItem('app-cache')
            localStorage.clear()
        }

        // Switch to memory cache to force fresh state
        setUseMemoryCache(true)

        // After a brief moment, switch back to localStorage cache for persistence
        setTimeout(() => {
            setUseMemoryCache(false)
        }, 100)
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
                key={useMemoryCache ? 'memory' : 'persistent'} // Different keys for different providers
                value={{
                    provider: useMemoryCache ? () => new Map() : () => localStorageProvider(),
                    fallback: {},
                }}
            >
                {children}
            </SWRConfig>
        </SWRContext.Provider>
    )
}