"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, LogOut } from "lucide-react"
import Image from "next/image"

interface ServiceCenterHeaderProps {
    title?: string
    subtitle?: string
}

export function ServiceCenterHeader({
    title = "Service Center Portal",
    subtitle
}: ServiceCenterHeaderProps) {
    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] pt-4">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="bg-white rounded-3xl shadow-lg z-[5] w-full px-3 sm:px-5 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                            <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-blue-600 flex-shrink-0">
                                {/* Logo only on small screens */}
                                <Image
                                    src="/images/logos/buckled-logo-only.svg"
                                    alt="Buckled.io logo"
                                    width={48}
                                    height={48}
                                    className="sm:hidden"
                                    priority
                                />
                                {/* Horizontal logo on larger screens */}
                                <Image
                                    src="/images/logos/buckled-horizontal.svg"
                                    alt="Buckled.io logo"
                                    width={150}
                                    height={30}
                                    className="hidden sm:block"
                                    priority
                                />
                            </Link>
                            <div className="flex flex-col">
                                <span className="text-sm sm:text-2xs text-gray-500">{title}</span>
                                {subtitle && (
                                    <span className="hidden sm:flex text-xs text-gray-400">{subtitle}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                            <Link href="/service-center/profile">
                                <Button variant="outline" size="sm" className="hidden sm:flex">
                                    <Settings className="w-4 h-4 mr-2" />
                                    <span className="hidden md:flex">Profile Settings</span>
                                </Button>
                                <Button variant="outline" size="sm" className="sm:hidden p-2">
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline" size="sm" className="hidden sm:flex">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    <span className="hidden md:flex">Exit</span>
                                </Button>
                                <Button variant="outline" size="sm" className="sm:hidden p-2">
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}