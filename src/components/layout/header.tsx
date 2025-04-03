"use client"

import { useState } from "react"
import Link from "next/link"
import { User, LogOut, Settings, Bell, FileText } from "lucide-react"

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-cyan-600" />
          <span className="text-xl font-semibold text-gray-800">Paperless</span>
        </div>

        <div className="relative">
          <button
            onClick={toggleProfileMenu}
            className="flex items-center gap-2 rounded-full bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200"
          >
            <User className="h-5 w-5" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              <div className="border-b border-gray-100 px-4 py-2">
                <p className="font-medium text-gray-800">John Doe</p>
                <p className="text-sm text-gray-500">john.doe@example.com</p>
              </div>

              <Link
                href="/profile"
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>

              <Link
                href="/notifications"
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </Link>

              <Link
                href="/settings"
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>

              <div className="border-t border-gray-100">
                <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

