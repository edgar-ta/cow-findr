"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "./loading-screen"

export default function LoadingDemo() {
  const [currentVariant, setCurrentVariant] = useState<"default" | "minimal" | "animated" | "progress">("default")
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate progress for progress variant
  useEffect(() => {
    if (currentVariant === "progress") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [currentVariant])

  // Reset progress when variant changes
  useEffect(() => {
    setProgress(0)
  }, [currentVariant])

  const variants = [
    { key: "default", name: "Default", description: "Clean loading screen with device icon" },
    { key: "minimal", name: "Minimal", description: "Simple spinner for quick loads" },
    { key: "animated", name: "Animated", description: "Dynamic with rotating icons" },
    { key: "progress", name: "Progress", description: "Shows loading progress" },
  ] as const

  const messages = {
    default: "Connecting to your devices...",
    minimal: "Loading...",
    animated: "Initializing device network",
    progress: "Setting up your dashboard",
  }

  if (isLoading) {
    return (
      <LoadingScreen
        variant={currentVariant}
        message={messages[currentVariant]}
        progress={progress}
        showProgress={currentVariant === "progress"}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loading Screen Variants</h1>
          <p className="text-gray-600">Choose a loading screen style for your device management app</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {variants.map((variant) => (
            <div
              key={variant.key}
              className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all ${
                currentVariant === variant.key ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setCurrentVariant(variant.key)}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{variant.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{variant.description}</p>
              <div className="text-xs text-gray-500">Message: "{messages[variant.key]}"</div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <button
            onClick={() => {
              setIsLoading(true)
              setProgress(0)
              // Auto-hide after 3 seconds (or when progress reaches 100%)
              setTimeout(
                () => {
                  if (currentVariant !== "progress" || progress >= 100) {
                    setIsLoading(false)
                  }
                },
                currentVariant === "progress" ? 5000 : 3000,
              )
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Preview {variants.find((v) => v.key === currentVariant)?.name} Loading Screen
          </button>

          <p className="text-sm text-gray-500">Click a variant above, then click preview to see it in action</p>
        </div>

        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage Example</h2>
          <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
            <div className="text-gray-600 mb-2">// Import the component</div>
            <div className="text-blue-600">import {"{ LoadingScreen }"} from './components/loading-screen'</div>
            <br />
            <div className="text-gray-600 mb-2">// Use in your app</div>
            <div>{"<LoadingScreen"}</div>
            <div className="ml-4">variant="{currentVariant}"</div>
            <div className="ml-4">message="{messages[currentVariant]}"</div>
            {currentVariant === "progress" && (
              <>
                <div className="ml-4">progress={"{progress}"}</div>
                <div className="ml-4">showProgress={"{true}"}</div>
              </>
            )}
            <div>{"/>"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
