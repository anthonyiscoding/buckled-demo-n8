"use client"

import React from 'react'
import Image from 'next/image'

interface SocketAssistantProps {
    /** Controls visibility of the Socket Assistant */
    isVisible?: boolean
    /** Controls whether the assistant is expanded (dialog open) */
    isExpanded?: boolean
    /** Click handler for the Socket Assistant button */
    onClick?: () => void
    /** Whether to show notification badge */
    hasNotification?: boolean
    /** Socket character image to display.*/
    socketImage?: string
    /** Additional CSS classes for the container */
    className?: string
    /** Whether to show bounce animation */
    showBounceAnimation?: boolean
}

export const SocketAssistant: React.FC<SocketAssistantProps> = ({
    isVisible = true,
    isExpanded = false,
    onClick,
    hasNotification = false,
    socketImage,
    className = "",
    showBounceAnimation = false,
}) => {
    if (!isVisible || isExpanded) {
        return null
    }

    const baseClasses = "fixed bottom-6 right-6 w-16 h-16  rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
    const animationClasses = showBounceAnimation ? "animate-bounce-in" : ""
    const notificationAnimationClasses = hasNotification ? "animate-bounce" : ""

    return (
        <div
            className={`${baseClasses} ${animationClasses} ${notificationAnimationClasses} ${className}`}
            onClick={onClick}
        >
            <Image
                src={`/images/socket-thinking.png`}
                alt="Socket character"
                className="w-full h-full object-contain animate-socket-appear max-h-[64px]"
                width={120}
                height={300}
            />

            {hasNotification && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-900 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">1</span>
                </div>
            )}
        </div>
    )
}