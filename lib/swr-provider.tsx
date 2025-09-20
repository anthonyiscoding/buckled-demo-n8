"use client"

import React, { createContext, useContext } from 'react'
import { SWRConfig } from 'swr'
import { localStorageProvider } from './swr-config'

interface SWRProviderProps {
  children: React.ReactNode
}

export function SWRProvider({ children }: SWRProviderProps) {
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