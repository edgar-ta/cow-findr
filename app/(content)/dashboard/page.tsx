"use client"

import { useEffect, useState } from "react"
import { Search, Filter, Plus, Download, Map, Grid3X3 } from 'lucide-react'
import { DeviceCard } from "./device-card"
import { MapView } from "./map-view"

import type { Dashboard_DeviceModel } from "@/app/api/_data-models/dashboard/device"
import LoadingDemo from "@/components/custom/loading-screen-demo"

export default function DeviceInterface() {
  const [devices, setDevices] = useState<Dashboard_DeviceModel[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterActive, setFilterActive] = useState<boolean | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<Dashboard_DeviceModel | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")

  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const [ fetchError, setFetchError ] = useState<string | null>(null);

  useEffect(() => {
      const fetchDevices = async () => {
        setIsLoading(true);
        setFetchError(null);
  
        try {
          const response = await fetch("/api/get-dashboard-data", {
            method: "POST",
          });
  
          if (!response.ok) {
            throw new Error("Failed to fetch devices.");
          }
  
          const data = await response.json();
          setDevices(data);
        } catch (err: any) {
          setFetchError(err.message || "An error occurred while fetching devices.");
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchDevices();
    }, []);

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.hardware_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.activation_code.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterActive === null || device.active === filterActive

    return matchesSearch && matchesFilter
  })

  const activeCount = devices.filter((d) => d.active).length
  const inactiveCount = devices.length - activeCount

  const exportData = () => {
    const dataStr = JSON.stringify(filteredDevices, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "devices.json"
    link.click()
    URL.revokeObjectURL(url)
  }

    if (isLoading) {
      return <LoadingDemo />
    }
  
    if (fetchError !== null) {
      return (
        <div>
          <h1>Error</h1>
          <p>
            Algo salió mal con la obtención de datos del dispositivo
          </p>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Device Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage your connected devices</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportData}
              className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              Add Device
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{devices.length}</div>
            <div className="text-sm text-gray-600">Total Devices</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            <div className="text-sm text-gray-600">Active Devices</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-500">{inactiveCount}</div>
            <div className="text-sm text-gray-600">Inactive Devices</div>
          </div>
        </div>

        {/* Search, Filter, and View Toggle */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search devices by label, hardware ID, or activation code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <button
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filterActive === null ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilterActive(null)}
              >
                All ({devices.length})
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filterActive === true ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilterActive(true)}
              >
                Active ({activeCount})
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filterActive === false ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilterActive(false)}
              >
                Inactive ({inactiveCount})
              </button>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border border-gray-300 rounded-md p-1">
              <button
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                className={`p-2 rounded transition-colors ${
                  viewMode === "map" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setViewMode("map")}
                title="Map view"
              >
                <Map className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        {(searchTerm || filterActive !== null) && (
          <div className="text-sm text-gray-600">
            Showing {filteredDevices.length} of {devices.length} devices
          </div>
        )}

        {/* Content based on view mode */}
        {viewMode === "map" ? (
          <MapView devices={filteredDevices}/>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDevices.map((device) => (
              <div key={device.id} onClick={() => setSelectedDevice(device)} className="cursor-pointer">
                <DeviceCard device={device} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredDevices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No devices found</div>
            <p className="text-gray-400 mt-2">
              {searchTerm || filterActive !== null
                ? "Try adjusting your search or filter criteria"
                : "Add your first device to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
