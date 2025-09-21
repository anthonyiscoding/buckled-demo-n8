"use client"

import React, { useState, useRef, useEffect } from 'react'

interface Message {
    id: string
    text: string
    sender: 'user' | 'socket'
    timestamp: Date
}

interface SocketChatProps {
    isOpen: boolean
    onClose: () => void
    externalMessages?: Message[]
    onAddMessage?: (message: Omit<Message, 'id' | 'timestamp'>) => void
    showContinueButton?: boolean
    continueButtonText?: string
    onContinueClick?: () => void
}

const SocketChat: React.FC<SocketChatProps> = ({
    isOpen,
    onClose,
    externalMessages = [],
    onAddMessage,
    showContinueButton = false,
    continueButtonText = "Continue",
    onContinueClick
}) => {
    const [internalMessages, setInternalMessages] = useState<Message[]>([])

    // Combine internal messages with external messages and sort by timestamp
    // Ensure timestamps are Date objects (they might be strings from localStorage)
    const normalizedExternalMessages = externalMessages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
    }))

    const messages = [...internalMessages, ...normalizedExternalMessages].sort((a, b) =>
        a.timestamp.getTime() - b.timestamp.getTime()
    )
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Effect to handle external messages being added
    useEffect(() => {
        if (onAddMessage) {
            // This effect ensures that when external messages are added, 
            // the chat scrolls to the bottom
            scrollToBottom()
        }
    }, [externalMessages, onAddMessage])

    const generateSocketResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase()

        // Simple AI responses based on keywords
        if (lowerMessage.includes('brake') || lowerMessage.includes('brakes')) {
            return "Brake issues can be serious! Common signs include squeaking, grinding sounds, or longer stopping distances. I'd recommend getting them checked soon. Would you like me to help you find service centers specializing in brake repairs?"
        }

        if (lowerMessage.includes('transmission')) {
            return "Transmission problems can show up as delayed shifting, strange noises, or fluid leaks. Have you noticed any of these symptoms? I can help you understand what might be causing the issue."
        }

        if (lowerMessage.includes('oil') || lowerMessage.includes('change')) {
            return "Regular oil changes are crucial for engine health! Most cars need oil changes every 3,000-7,500 miles depending on the type of oil and driving conditions. When was your last oil change?"
        }

        if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            return "I understand cost is important! I can help you find competitive quotes from trusted service centers in your area. Would you like me to start the quote comparison process for your specific issue?"
        }

        if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
            return "I can help you schedule an appointment! Once you've selected a service center and quote, I'll guide you through the scheduling process. Do you have a preferred date or time?"
        }

        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return "You're welcome! I'm here whenever you need help with your car. Is there anything else I can assist you with today?"
        }

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! Great to chat with you. What car issue can I help you solve today?"
        }

        // Default responses
        const defaultResponses = [
            "That's an interesting question! Could you tell me more about your specific car issue so I can provide better assistance?",
            "I'd love to help with that! Can you describe what symptoms or problems you're experiencing with your vehicle?",
            "Great question! For the most accurate help, could you share some details about your car's make, model, and the specific issue you're facing?",
            "I'm here to help! Let me know what's going on with your car and I'll do my best to guide you to a solution."
        ]

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
    }

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        }

        setInternalMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        // Simulate AI thinking time
        setTimeout(() => {
            const socketResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: generateSocketResponse(inputValue),
                sender: 'socket',
                timestamp: new Date()
            }

            setInternalMessages(prev => [...prev, socketResponse])
            setIsTyping(false)
        }, 1000 + Math.random() * 2000) // 1-3 second delay
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (!isOpen) return null

    return (
        <>
            {/* Mobile backdrop */}
            <div className="sm:hidden fixed inset-0 bg-black/50 z-40" onClick={onClose} />
            
            <div className="fixed inset-4 sm:bottom-24 sm:right-4 sm:inset-auto sm:w-90 sm:h-120 bg-white rounded-lg sm:rounded-lg shadow-2xl border border-gray-200 flex flex-col animate-socket-dialog-in z-50">
                {/* Header */}
                <div className="p-4 border-b bg-[#f16c63] text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <img
                                    src="/images/socket-thinking.png"
                                    alt="Socket"
                                    className="w-8 h-8 object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="text-white text-lg font-semibold">Socket Assistant</h3>
                                <p className="text-white/80 text-sm">Your AI car expert</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 p-1 rounded"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'user'
                                ? 'bg-[#f16c63] text-white'
                                : 'bg-gray-100 text-gray-800'
                                }`}>
                                <p className="text-sm">{message.text}</p>
                                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                                    }`}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Continue Button */}
                {showContinueButton && (
                    <div className="px-4 pb-2">
                        <button
                            onClick={onContinueClick}
                            className="w-full bg-[#f16c63] hover:bg-[#e55a51] text-white py-3 px-4 rounded-md font-medium transition-colors"
                        >
                            {continueButtonText}
                        </button>
                    </div>
                )}

                {/* Input */}
                <div className="p-4 border-t bg-white rounded-b-lg">
                    <div className="flex gap-2">
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask Socket about your car..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f16c63] focus:border-transparent"
                            disabled={isTyping}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping}
                            className="bg-[#f16c63] hover:bg-[#e55a51] text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export { SocketChat as default }
