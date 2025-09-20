"use client"

import React, { useState, useEffect } from 'react'
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
    /** External messages to display in SocketChat */
    externalMessages?: Array<{
        id: string
        text: string
        sender: 'user' | 'socket'
        timestamp: Date
    }>
    /** Function to add messages to SocketChat */
    onAddMessage?: (message: Omit<{
        id: string
        text: string
        sender: 'user' | 'socket'
        timestamp: Date
    }, 'id' | 'timestamp'>) => void
    /** Control whether chat should be open */
    shouldOpenChat?: boolean
    /** Callback when chat open state changes */
    onChatOpenChange?: (isOpen: boolean) => void
    /** Whether to show continue button in chat */
    showContinueButton?: boolean
    /** Text for the continue button */
    continueButtonText?: string
    /** Handler for continue button click */
    onContinueClick?: () => void
}

export const SocketAssistant: React.FC<SocketAssistantProps> = ({
    isVisible = true,
    isExpanded = false,
    onClick,
    className = "",
    showBounceAnimation = false,
    externalMessages = [],
    onAddMessage,
    shouldOpenChat = false,
    onChatOpenChange,
    showContinueButton = false,
    continueButtonText = "Continue",
    onContinueClick,
}) => {
    const [isChatOpen, setIsChatOpen] = useState(false)

    // Effect to handle external control of chat opening
    useEffect(() => {
        if (shouldOpenChat) {
            setIsChatOpen(true)
            // Notify parent that chat is now open and reset the flag
            if (onChatOpenChange) {
                onChatOpenChange(true)
            }
        }
    }, [shouldOpenChat, onChatOpenChange])

    // Create a wrapper for onContinueClick that also closes the chat
    const handleContinueClick = () => {
        if (onContinueClick) {
            onContinueClick()
        }
        // Close the chat when continue is clicked
        handleChatClose()
    }

    const handleClick = () => {
        if (onClick) {
            onClick()
        }
        setIsChatOpen(true)
    }

    const handleChatClose = () => {
        setIsChatOpen(false)
        // Notify parent that chat is now closed
        if (onChatOpenChange) {
            onChatOpenChange(false)
        }
    }

    if (!isVisible || isExpanded) {
        return (
            <div>
                {React.createElement(SocketChat, {
                    isOpen: isChatOpen,
                    onClose: handleChatClose,
                    externalMessages,
                    onAddMessage,
                    showContinueButton,
                    continueButtonText,
                    onContinueClick: handleContinueClick
                })}
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
            {React.createElement(SocketChat, {
                isOpen: isChatOpen,
                onClose: handleChatClose,
                externalMessages,
                onAddMessage,
                showContinueButton,
                continueButtonText,
                onContinueClick: handleContinueClick
            })}
        </div>
    )
}
