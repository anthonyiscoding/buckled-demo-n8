"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { resetAllAppData } from "@/lib/global-reset"

export default function HomePage() {
  const [isResetting, setIsResetting] = useState(false)

  const handleResetDemo = () => {
    setIsResetting(true)
    resetAllAppData()

    // Show feedback to user
    setTimeout(() => {
      setIsResetting(false)
      // Optional: Show a toast or alert that data has been reset
      alert("Demo data has been reset successfully!")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f1] to-white">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Buckled.io</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Easily find trustworthy car service centers and mechanics in seconds
          </p>
          <div className="mt-6">
            <Button
              onClick={handleResetDemo}
              disabled={isResetting}
              variant="outline"
              className="text-gray-600 border-gray-300 hover:bg-gray-50 bg-transparent"
            >
              {isResetting ? "Resetting..." : "Reset Demo"}
            </Button>
          </div>
        </div>

        {/* Main Selection Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Customer Portal */}
          <Card className="p-8 hover:shadow-lg transition-shadow duration-300 border-2 hover:border-[#f16c63]">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#f16c63] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">I'm a Customer</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Get your car diagnosed, find trusted mechanics, and book repair services with ease.
              </p>
              <Link href="/customer" className="block">
                <Button
                  className="w-full bg-[#f16c63] hover:bg-[#e55a50] text-white py-3 text-lg font-medium"
                  size="lg"
                >
                  Start Car Diagnosis
                </Button>
              </Link>
            </div>
          </Card>

          {/* Service Center Portal */}
          <Card className="p-8 hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">I'm a Service Center</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Manage customer requests, provide quotes, and grow your auto repair business.
              </p>
              <Link href="/service-center" className="block">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg font-medium" size="lg">
                  Access Service Portal
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <p className="text-gray-500">Trusted by thousands of customers and service centers nationwide</p>
        </div>
      </div>
    </div>
  )
}
