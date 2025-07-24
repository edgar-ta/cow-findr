"use client"

import { useEffect } from "react"
import { CheckCircle, AlertCircle, X } from "lucide-react"

interface ToastProps {
  message: string
  type: "success" | "error"
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, isVisible, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
  }

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
  }

  const Icon = icons[type]

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={`flex items-center gap-3 p-4 border rounded-lg shadow-lg max-w-md ${styles[type]}`}>
        <Icon className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
