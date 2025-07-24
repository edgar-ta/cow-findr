"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Wifi, WifiOff, X, Navigation } from "lucide-react"
import type { Dashboard_DeviceModel } from "@/app/api/_data-models/dashboard/device"

interface DeviceMapProps {
  devices: Dashboard_DeviceModel[]
  onDeviceSelect?: (device: Dashboard_DeviceModel) => void
  className?: string
}

export function DeviceMap({ devices, onDeviceSelect, className = "" }: DeviceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [selectedDevice, setSelectedDevice] = useState<Dashboard_DeviceModel | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const devicesWithPositions = devices.filter((d) => d.lastPosition)
  const activeDevicesWithPositions = devicesWithPositions.filter((d) => d.active)

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize map only once
  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return

    let isMounted = true

    const initMap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const L = (await import("leaflet")).default

        // Fix for webpack
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })

        if (!isMounted || !mapRef.current) return

        // Calculate initial center
        let center: [number, number] = [40.7128, -74.006] // Default NYC
        if (devicesWithPositions.length > 0) {
          const avgLat =
            devicesWithPositions.reduce((sum, d) => sum + d.lastPosition![0], 0) / devicesWithPositions.length
          const avgLng =
            devicesWithPositions.reduce((sum, d) => sum + d.lastPosition![1], 0) / devicesWithPositions.length
          center = [avgLat, avgLng]
        }

        // Create map
        const mapInstance = L.map(mapRef.current, {
          center: center,
          zoom: 10,
          zoomControl: true,
          attributionControl: true,
        })

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapInstance)

        if (isMounted) {
          mapInstanceRef.current = mapInstance
          setIsMapReady(true)
        }
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    initMap()

    return () => {
      isMounted = false
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch (error) {
          console.error("Error removing map:", error)
        }
        mapInstanceRef.current = null
        setIsMapReady(false)
      }
    }
  }, [isClient]) // Only depend on isClient, not devices

  // Update markers when devices change
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !isClient) return

    const updateMarkers = async () => {
      try {
        const L = (await import("leaflet")).default

        // Clear existing markers
        markersRef.current.forEach((marker) => {
          try {
            mapInstanceRef.current?.removeLayer(marker)
          } catch (error) {
            console.error("Error removing marker:", error)
          }
        })
        markersRef.current = []

        // Add new markers
        const newMarkers: any[] = []

        for (const device of devices) {
          if (!device.lastPosition) continue

          try {
            // Create custom icon HTML
            const iconHtml = `
              <div style="
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: ${device.active ? "#10b981" : "#6b7280"};
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                position: relative;
              ">
                📍
                ${device.active ? '<div style="position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></div>' : ""}
              </div>
            `

            const customIcon = L.divIcon({
              html: iconHtml,
              className: "custom-device-marker",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            })

            const marker = L.marker([device.lastPosition[0], device.lastPosition[1]], {
              icon: customIcon,
            }).addTo(mapInstanceRef.current)

            // Create popup content
            const popupContent = `
              <div style="padding: 8px; min-width: 200px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                  <h3 style="margin: 0; font-weight: 600; color: #111827;">${device.label}</h3>
                  <span style="
                    display: inline-flex;
                    align-items: center;
                    padding: 2px 8px;
                    border-radius: 9999px;
                    font-size: 12px;
                    font-weight: 500;
                    ${device.active ? "background-color: #dcfce7; color: #166534;" : "background-color: #f3f4f6; color: #4b5563;"}
                  ">
                    ${device.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div style="font-size: 12px; color: #6b7280; line-height: 1.4;">
                  <div><strong>Hardware ID:</strong> ${device.hardware_id}</div>
                  <div><strong>Device ID:</strong> ${device.id}</div>
                  <div><strong>Position:</strong> ${device.lastPosition[0].toFixed(6)}, ${device.lastPosition[1].toFixed(6)}</div>
                </div>
              </div>
            `

            marker.bindPopup(popupContent, {
              maxWidth: 300,
              closeButton: true,
            })

            // Add click event
            marker.on("click", () => {
              setSelectedDevice(device)
              if (onDeviceSelect) {
                onDeviceSelect(device)
              }
            })

            newMarkers.push(marker)
          } catch (error) {
            console.error("Error creating marker for device:", device.id, error)
          }
        }

        markersRef.current = newMarkers

        // Fit bounds if we have devices
        if (devicesWithPositions.length > 0 && newMarkers.length > 0) {
          try {
            const group = L.featureGroup(newMarkers)
            const bounds = group.getBounds()
            if (bounds.isValid()) {
              mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] })
            }
          } catch (error) {
            console.error("Error fitting bounds:", error)
          }
        }
      } catch (error) {
        console.error("Error updating markers:", error)
      }
    }

    updateMarkers()
  }, [devices, isMapReady, onDeviceSelect, isClient])

  // Don't render on server
  if (!isClient) {
    return (
      <div
        className={`w-full h-96 rounded-lg border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center ${className}`}
      >
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Map container */}
      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg border border-gray-200 shadow-sm"
        style={{ minHeight: "384px" }}
      />

      {/* Loading overlay */}
      {!isMapReady && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-[1000] rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <div className="text-gray-600">Initializing map...</div>
          </div>
        </div>
      )}

      {/* Map stats overlay */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{devicesWithPositions.length} devices located</span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{activeDevicesWithPositions.length} active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>{devicesWithPositions.length - activeDevicesWithPositions.length} inactive</span>
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        <button
          onClick={() => {
            if (mapInstanceRef.current && devicesWithPositions.length > 0) {
              try {
                const L = require("leaflet")
                const group = L.featureGroup(markersRef.current)
                const bounds = group.getBounds()
                if (bounds.isValid()) {
                  mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] })
                }
              } catch (error) {
                console.error("Error fitting bounds:", error)
              }
            }
          }}
          className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
          title="Fit all devices"
        >
          <MapPin className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={() => {
            if (navigator.geolocation && mapInstanceRef.current) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  mapInstanceRef.current?.setView([position.coords.latitude, position.coords.longitude], 12)
                },
                (error) => {
                  console.error("Error getting location:", error)
                },
              )
            }
          }}
          className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
          title="Center on my location"
        >
          <Navigation className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Device details sidebar */}
      {selectedDevice && (
        <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-lg z-[1001] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Device Details</h3>
              <button onClick={() => setSelectedDevice(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">{selectedDevice.label}</h4>
              <div className="flex items-center gap-2 mb-3">
                {selectedDevice.active ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-gray-400" />
                )}
                <span className={`text-sm font-medium ${selectedDevice.active ? "text-green-600" : "text-gray-500"}`}>
                  {selectedDevice.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Hardware ID</span>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedDevice.hardware_id}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Device ID</span>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedDevice.id}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Activation Code</span>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedDevice.activation_code}</p>
              </div>

              {selectedDevice.lastPosition && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Last Position</span>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {selectedDevice.lastPosition[0].toFixed(6)}, {selectedDevice.lastPosition[1].toFixed(6)}
                  </p>
                  <button
                    onClick={() => {
                      if (mapInstanceRef.current && selectedDevice.lastPosition) {
                        mapInstanceRef.current.setView(
                          [selectedDevice.lastPosition[0], selectedDevice.lastPosition[1]],
                          15,
                        )
                      }
                    }}
                    className="mt-1 text-xs text-blue-600 hover:text-blue-800"
                  >
                    Center on map
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No location warning */}
      {devices.length > devicesWithPositions.length && (
        <div className="absolute bottom-4 left-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 z-[1000]">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <MapPin className="h-4 w-4" />
            <span>{devices.length - devicesWithPositions.length} devices have no location data</span>
          </div>
        </div>
      )}
    </div>
  )
}
