"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface AddDeviceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (label: string, acquisitionCode: string) => void
}

export function AddDeviceModal({ isOpen, onClose, onSuccess }: AddDeviceModalProps) {
  const [label, setLabel] = useState("")
  const [acquisitionCode, setAcquisitionCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset states
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      const response = await fetch("/api/add-device", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: label.trim(),
          acquisitionCode: acquisitionCode.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Show success state
      setSuccess(true)

      // Call success callback
      onSuccess(label.trim(), acquisitionCode.trim())

      // Close modal after a brief delay to show success
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add device. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (isLoading) return // Prevent closing while loading

    // Reset form state
    setLabel("")
    setAcquisitionCode("")
    setError(null)
    setSuccess(false)
    setIsLoading(false)
    onClose()
  }

  const isFormValid = label.trim().length > 0 && acquisitionCode.trim().length > 0

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-[#00000077] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Device</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Device Label Input */}
          <div>
            <label htmlFor="device-label" className="block text-sm font-medium text-gray-700 mb-2">
              Device Label
            </label>
            <input
              id="device-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Temperature Sensor - Lab A"
              disabled={isLoading || success}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              maxLength={100}
            />
            <p className="mt-1 text-xs text-gray-500">Give your device a descriptive name (max 100 characters)</p>
          </div>

          {/* Acquisition Code Input */}
          <div>
            <label htmlFor="acquisition-code" className="block text-sm font-medium text-gray-700 mb-2">
              Device Acquisition Code
            </label>
            <input
              id="acquisition-code"
              type="text"
              value={acquisitionCode}
              onChange={(e) => setAcquisitionCode(e.target.value)}
              placeholder="e.g., ACQ-2024-XYZ123"
              disabled={isLoading || success}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed font-mono"
              maxLength={50}
            />
            <p className="mt-1 text-xs text-gray-500">Enter the unique acquisition code provided with your device</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-700">Device added successfully!</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isLoading || success}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Device...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Added!
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Device
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
