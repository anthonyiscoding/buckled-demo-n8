import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SWRProvider } from '../lib/swr-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Buckled.io',
  description: 'Easily find trustworthy car service centers and mechanics in seconds'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <SWRProvider>
          {children}
        </SWRProvider>
        <Analytics />
      </body>
    </html>
  )
}
