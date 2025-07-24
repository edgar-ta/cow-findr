"use client"

import { useEffect, useState } from "react"
import { DeviceMap } from "./device-map"
import type { Dashboard_DeviceModel } from "@/app/api/_data-models/dashboard/device";

interface MapViewProps {
  devices: Dashboard_DeviceModel[]
  onDeviceSelect?: (device: Dashboard_DeviceModel) => void
}

export function MapView({ devices, onDeviceSelect }: MapViewProps) {
  const [cssLoaded, setCssLoaded] = useState(false)

  useEffect(() => {
    // Check if Leaflet CSS is already loaded
    const existingLink = document.querySelector('link[href*="leaflet"]')
    if (existingLink) {
      setCssLoaded(true)
      return
    }

    // Load Leaflet CSS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    link.crossOrigin = "anonymous"

    link.onload = () => setCssLoaded(true)
    link.onerror = () => {
      console.error("Failed to load Leaflet CSS")
      setCssLoaded(true) // Still try to show map
    }

    document.head.appendChild(link)

    // Cleanup function
    return () => {
      if (document.head.contains(link)) {
        try {
          document.head.removeChild(link)
        } catch (error) {
          console.error("Error removing CSS link:", error)
        }
      }
    }
  }, [])

  if (!cssLoaded) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Device Locations</h2>
            <p className="text-gray-600 text-sm">Loading map resources...</p>
          </div>
        </div>

        <div className="w-full h-96 rounded-lg border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <div className="text-gray-500">Loading map...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Device Locations</h2>
          <p className="text-gray-600 text-sm">Interactive map showing real-time device positions</p>
        </div>
      </div>

      <DeviceMap devices={devices} onDeviceSelect={onDeviceSelect} className="w-full" />

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-green-600">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-900">Interactive Leaflet Map</h3>
            <p className="text-sm text-green-700 mt-1">
              Pan by dragging, zoom with mouse wheel, and click device markers for details. Use the control buttons to
              center the view.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
