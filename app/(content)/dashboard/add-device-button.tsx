"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { AddDeviceModal } from "./add-device-modal"

interface AddDeviceButtonProps {
  onDeviceAdded?: (label: string, acquisitionCode: string) => void
  className?: string
  variant?: "primary" | "secondary"
}

export function AddDeviceButton({ onDeviceAdded, className = "", variant = "primary" }: AddDeviceButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSuccess = (label: string, acquisitionCode: string) => {
    // Call the callback if provided
    if (onDeviceAdded) {
      onDeviceAdded(label, acquisitionCode)
    }

    // You could also show a toast notification here
    console.log("Device added successfully:", { label, acquisitionCode })
  }

  const buttonStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonStyles[variant]} ${className}`}
      >
        <Plus className="h-4 w-4" />
        Add Device
      </button>

      <AddDeviceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleSuccess} />
    </>
  )
}
