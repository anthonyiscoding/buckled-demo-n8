"use client"

import React, { useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import SocketChat to avoid SSR issues
const SocketChat = dynamic(() => import('../socket-chat'), { ssr: false })

interface SocketAssistantProps {
    /** Controls visibility of the Socket Assistant */
    isVisible?: boolean
    /** Controls whether the assistant is expanded (dialog open) */
    isExpanded?: boolean
    /** Click handler for the Socket Assistant button */
    onClick?: () => void
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
    className = "",
    showBounceAnimation = false,
}) => {
    const [isChatOpen, setIsChatOpen] = useState(false)

    const handleClick = () => {
        if (onClick) {
            onClick()
        }
        setIsChatOpen(true)
    }

    const handleChatClose = () => {
        setIsChatOpen(false)
    }

    if (!isVisible || isExpanded) {
        return (
            <div>
                {React.createElement(SocketChat, { isOpen: isChatOpen, onClose: handleChatClose })}
            </div>
        )
    }

    const baseClasses = "fixed bottom-6 right-6 w-16 h-16  rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
    const animationClasses = showBounceAnimation ? "animate-bounce-in" : ""

    return (
        <div>
            <div
                className={`${baseClasses} ${animationClasses} ${className}`}
                onClick={handleClick}
            >
                <img
                    src="/images/socket-thinking.png"
                    alt="Socket character"
                    className="w-full h-full object-contain animate-socket-appear max-h-[64px]"
                />
            </div>
            {React.createElement(SocketChat, { isOpen: isChatOpen, onClose: handleChatClose })}
        </div>
    )
}