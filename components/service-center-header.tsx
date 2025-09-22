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
            <div className="max-w-6xl mx-auto px-6">
                <div className="bg-white rounded-3xl shadow-lg z-[5] w-full px-5 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                                <Image
                                    src="/images/logos/buckled-horizontal.svg"
                                    alt="The buckled.io logo"
                                    width={150}
                                    height={30}
                                />
                            </Link>
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">{title}</span>
                                {subtitle && (
                                    <span className="text-xs text-gray-400">{subtitle}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/service-center/profile">
                                <Button variant="outline" size="sm">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Profile Settings
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline" size="sm">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Exit
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}