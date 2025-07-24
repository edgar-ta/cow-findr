"use client"

import { useState, useEffect } from "react"
import { Wifi, Activity, Thermometer, Droplets } from "lucide-react"

interface LoadingScreenProps {
  message?: string
  progress?: number
  showProgress?: boolean
  variant?: "default" | "minimal" | "animated" | "progress"
}

export function LoadingScreen({
  message = "Loading your devices...",
  progress = 0,
  showProgress = false,
  variant = "default",
}: LoadingScreenProps) {
  const [dots, setDots] = useState("")
  const [currentIcon, setCurrentIcon] = useState(0)

  const icons = [Wifi, Activity, Thermometer, Droplets]

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length)
    }, 800)

    return () => clearInterval(interval)
  }, [icons.length])

  if (variant === "minimal") {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">{message}</p>
        </div>
      </div>
    )
  }

  if (variant === "progress") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-blue-600 animate-pulse" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Setting up your dashboard</h2>
              <p className="text-gray-600">{message}</p>
            </div>

            {showProgress && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "animated") {
    const CurrentIcon = icons[currentIcon]

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-8">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <CurrentIcon className="h-8 w-8 text-blue-400 animate-pulse" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Device Management System</h2>
          <p className="text-blue-200 text-lg mb-2">
            {message}
            {dots}
          </p>

          <div className="flex justify-center space-x-2 mt-6">
            {icons.map((Icon, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIcon ? "bg-blue-400 scale-125" : "bg-blue-600"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="relative w-20 h-20 mx-auto">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            {/* Spinning ring */}
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            {/* Inner icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Wifi className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Device Management</h2>
        <p className="text-gray-600 mb-6">
          {message}
          {dots}
        </p>

        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  )
}
