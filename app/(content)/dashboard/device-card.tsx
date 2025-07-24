"use client";

import { Copy, Wifi, WifiOff } from "lucide-react";
import type { Dashboard_DeviceModel } from "@/app/api/_data-models/dashboard/device";
import Link from "next/link";

interface DeviceCardProps {
  device: Dashboard_DeviceModel;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/device-preview/${device.id}`}>
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {device.label}
          </h3>
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              device.active
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {device.active ? (
              <Wifi className="h-3 w-3" />
            ) : (
              <WifiOff className="h-3 w-3" />
            )}
            {device.active ? "Active" : "Inactive"}
          </span>
        </div>
      </Link>

      <div className="p-4 pt-2 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              Hardware ID
            </span>
            <div className="flex items-center gap-2">
              <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono text-gray-800 max-w-32 truncate">
                {device.hardware_id}
              </code>
              <button
                onClick={() => copyToClipboard(device.hardware_id)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded hover:bg-gray-100"
                title="Copy hardware ID"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              Acquisition Code
            </span>
            <div className="flex items-center gap-2">
              <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono text-gray-800 max-w-32 truncate">
                {device.activation_code}
              </code>
              <button
                onClick={() => copyToClipboard(device.activation_code)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded hover:bg-gray-100"
                title="Copy activation code"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
