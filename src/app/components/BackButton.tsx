import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from './ui/button'

interface BackButtonProps {
  onClick: () => void
  className?: string
}

export function BackButton({ onClick, className = '' }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`flex items-center gap-2 px-2 mb-4 hover:bg-transparent ${className}`}
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Back</span>
    </Button>
  )
}
