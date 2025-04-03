"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface EnrollModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (code: string) => void
}

// This is part of the View in MVC
export function EnrollModal({ isOpen, onClose, onSubmit }: EnrollModalProps) {
  const [code, setCode] = useState("")

  // This is part of the Controller in MVC
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim()) {
      onSubmit(code)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Join an Organization</h2>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="org-code" className="mb-2 block text-sm font-medium text-gray-700">
              Organization Code
            </label>
            <input
              id="org-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code provided by your organization"
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-cyan-600 px-4 py-2 text-white transition-colors hover:bg-cyan-700"
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

