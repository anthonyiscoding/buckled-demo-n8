"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ExpandableTextProps {
  text: string
  maxLength?: number
  className?: string
}

export function ExpandableText({ text, maxLength = 128, className = "" }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (text.length <= maxLength) {
    return <span className={className}>{text}</span>
  }

  const truncatedText = text.slice(0, maxLength)

  return (
    <div className={className}>
      <span>{isExpanded ? text : `${truncatedText}...`}</span>
      <Button
        variant="link"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-0 h-auto ml-1 text-blue-600 hover:text-blue-800"
      >
        {isExpanded ? "show less" : "click to expand"}
      </Button>
    </div>
  )
}
