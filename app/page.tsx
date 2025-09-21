"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useNavigation } from "@/lib/hooks"

export default function HomePage() {
  const [isResetting, setIsResetting] = useState(false)
  const { clearAllAppData } = useNavigation()

  useEffect(() => {
    const request = fetch("/api/diagnose")
    request.then((response) => {
      console.log(response)
    })
  }, [])
  const handleResetDemo = () => {
    setIsResetting(true)
    // resetAllAppData()
    clearAllAppData()

    // Show feedback to user
    setTimeout(() => {
      setIsResetting(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f1] to-white">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to the Buckled.io Demo</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Below you will find both customer and service center experiences
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Customer Experience</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Customers can get their car diagnosed, find trusted mechanics, and book repair services with ease leading to increased trust in Service Centers and repeat business.
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Center Experience</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Service Centers can seamlessly manage customer requests, provide quotes, and grow their auto repair business at below market rate acquisiton costs.
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
          <p className="text-gray-500 mb-12">Trusted by thousands of customers and service centers nationwide</p>

          {/* Integrations Section */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Seamless Integrations</h3>
            <p className="text-gray-600 mb-8">Connect with the tools you already use</p>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center justify-items-center">
              {/* Shop-Ware */}
              <div className="flex flex-col items-center group">
                <div className="w-32 h-32 bg-orange-500 rounded-lg shadow-md flex items-center justify-center mb-2 group-hover:shadow-lg transition-shadow">
                  <Image
                    src="/images/logos/shopware.png"
                    alt="Shop-Ware"
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm text-gray-600">Shop-Ware</span>
              </div>

              {/* ALL-DATA */}
              <div className="flex flex-col items-center group">
                <div className="w-32 h-32 bg-white rounded-lg shadow-md flex items-center justify-center mb-2 group-hover:shadow-lg transition-shadow">
                  <Image
                    src="/images/logos/alldata.png"
                    alt="ALL-DATA"
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm text-gray-600">ALL-DATA</span>
              </div>

              {/* QuickBooks */}
              <div className="flex flex-col items-center group">
                <div className="w-32 h-32 bg-white rounded-lg shadow-md flex items-center justify-center mb-2 group-hover:shadow-lg transition-shadow">
                  <Image
                    src="/images/logos/quickbooks.png"
                    alt="QuickBooks"
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm text-gray-600">QuickBooks</span>
              </div>

              {/* BayMaster (R.O Writer equivalent) */}
              <div className="flex flex-col items-center group">
                <div className="w-32 h-32 bg-white rounded-lg shadow-md flex items-center justify-center mb-2 group-hover:shadow-lg transition-shadow">
                  <Image
                    src="/images/logos/baymaster.png"
                    alt="BayMaster"
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm text-gray-600">BayMaster</span>
              </div>

              {/* Tekmetric */}
              <div className="flex flex-col items-center group">
                <div className="w-32 h-32 bg-gray-900 rounded-lg shadow-md flex items-center justify-center mb-2 group-hover:shadow-lg transition-shadow">
                  <Image
                    src="/images/logos/tekmetric.png"
                    alt="Tekmetric"
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm text-gray-600">Tekmetric</span>
              </div>

              {/* Many More */}
              <div className="flex flex-col items-center group">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg shadow-md flex flex-col items-center justify-center mb-2 group-hover:shadow-lg group-hover:border-[#f16c63] transition-all duration-300">
                  <div className="w-8 h-8 bg-[#f16c63] rounded-full flex items-center justify-center mb-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-[#f16c63] transition-colors">Many More!</span>
                </div>
                <span className="text-sm text-gray-600">20+ Integrations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
