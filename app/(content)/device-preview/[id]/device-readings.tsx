"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Cloud,
  Activity,
  Heart,
  Download,
  Filter,
} from "lucide-react"
import type { DeviceModel } from "@/app/api/_data-models/device";

interface DeviceReadingsProps {
  device: DeviceModel
  onBack: () => void
}

export function DeviceReadings({ device, onBack }: DeviceReadingsProps) {
  const [sortBy, setSortBy] = useState<"time" | "temperature" | "activity">("time")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterWelfare, setFilterWelfare] = useState<string>("")

  const readings = device.readings || []

  const sortedAndFilteredReadings = readings
    .filter((reading) => !filterWelfare || reading.cowWelfare.toLowerCase().includes(filterWelfare.toLowerCase()))
    .sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "time":
          aValue = new Date(a.time).getTime()
          bValue = new Date(b.time).getTime()
          break
        case "temperature":
          aValue = a.temperature
          bValue = b.temperature
          break
        case "activity":
          aValue = a.activity
          bValue = b.activity
          break
        default:
          return 0
      }

      if (sortOrder === "asc") {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCoordinates = (position: [number, number]) => {
    return `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`
  }

  const getWelfareColor = (welfare: string) => {
    const lower = welfare.toLowerCase()
    if (lower.includes("high") || lower.includes("good") || lower.includes("normal")) {
      return "bg-green-100 text-green-800"
    } else if (lower.includes("medium") || lower.includes("moderate")) {
      return "bg-yellow-100 text-yellow-800"
    } else if (lower.includes("low") || lower.includes("poor") || lower.includes("stress")) {
      return "bg-red-100 text-red-800"
    }
    return "bg-gray-100 text-gray-800"
  }

  const getConditionIcon = (condition: string) => {
    const lower = condition.toLowerCase()
    if (lower.includes("clear") || lower.includes("sunny")) return "☀️"
    if (lower.includes("rain")) return "🌧️"
    if (lower.includes("cloud")) return "☁️"
    if (lower.includes("storm")) return "⛈️"
    if (lower.includes("snow")) return "❄️"
    return "🌤️"
  }

  const exportReadings = () => {
    const dataStr = JSON.stringify(sortedAndFilteredReadings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${device.hardware_id}_readings.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const averageTemp =
    readings.length > 0 ? (readings.reduce((sum, r) => sum + r.temperature, 0) / readings.length).toFixed(1) : "0"
  const averageHumidity =
    readings.length > 0 ? (readings.reduce((sum, r) => sum + r.humidity, 0) / readings.length).toFixed(1) : "0"
  const averageActivity =
    readings.length > 0 ? (readings.reduce((sum, r) => sum + r.activity, 0) / readings.length).toFixed(2) : "0"

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-md transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{device.label}</h1>
            <p className="text-gray-600 mt-1">Device readings and monitoring data</p>
          </div>
          <button
            onClick={exportReadings}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Readings
          </button>
        </div>

        {/* Device Info */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Hardware ID</span>
              <p className="font-mono text-sm">{device.hardware_id}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Status</span>
              <p className={`text-sm font-medium ${device.active ? "text-green-600" : "text-gray-500"}`}>
                {device.active ? "Active" : "Inactive"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Total Readings</span>
              <p className="text-sm font-medium">{readings.length}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Last Reading</span>
              <p className="text-sm">{readings.length > 0 ? formatDate(readings[0]?.time) : "No readings"}</p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{averageTemp}°C</div>
                <div className="text-sm text-gray-600">Avg Temperature</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{averageHumidity}%</div>
                <div className="text-sm text-gray-600">Avg Humidity</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{averageActivity}</div>
                <div className="text-sm text-gray-600">Avg Activity (m/s²)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "time" | "temperature" | "activity")}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="time">Time</option>
                <option value="temperature">Temperature</option>
                <option value="activity">Activity</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filter welfare:</span>
              <input
                type="text"
                placeholder="e.g., Low, High, Normal..."
                value={filterWelfare}
                onChange={(e) => setFilterWelfare(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm w-40"
              />
            </div>
          </div>
        </div>

        {/* Readings Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weather
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Environment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Welfare
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAndFilteredReadings.map((reading, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{formatDate(reading.time)}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900 font-mono">{formatCoordinates(reading.position)}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <span className="mr-2">{getConditionIcon(reading.condition)}</span>
                          <span className="capitalize">{reading.condition}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <Cloud className="inline h-3 w-3 mr-1" />
                          {reading.clouds}% clouds
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Thermometer className="h-3 w-3 text-red-500 mr-1" />
                          <span>{reading.temperature}°C</span>
                          <span className="mx-2 text-gray-300">|</span>
                          <Droplets className="h-3 w-3 text-blue-500 mr-1" />
                          <span>{reading.humidity}%</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Wind className="h-3 w-3 mr-1" />
                          <span>{reading.wind} m/s</span>
                          <span className="mx-2">•</span>
                          <span>THI: {reading.thi}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm font-medium">{reading.activity} m/s²</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getWelfareColor(reading.cowWelfare)}`}
                      >
                        <Heart className="h-3 w-3 mr-1" />
                        {reading.cowWelfare}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {sortedAndFilteredReadings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No readings found</div>
            <p className="text-gray-400 mt-2">
              {filterWelfare ? "Try adjusting your filter criteria" : "No readings available for this device"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
