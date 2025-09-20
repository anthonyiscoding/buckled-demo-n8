import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { SWRProvider } from '../lib/swr-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Buckled.io',
  description: 'Easily find trustworthy car service centers and mechanics in seconds',
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SWRProvider>
          {children}
        </SWRProvider>
        <Analytics />
      </body>
    </html>
  )
}
