"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { SWRConfig } from 'swr'
import { localStorageProvider } from './swr-config'

interface SWRProviderProps {
    children: React.ReactNode
}

export function SWRProvider({ children }: SWRProviderProps) {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) {
        // During SSR or before hydration, just render children without SWR provider
        return <>{children}</>
    }

    return (
        <SWRConfig
            value={{
                provider: () => localStorageProvider(),
                fallback: {},
            }}
        >
            {children}
        </SWRConfig>
    )
}