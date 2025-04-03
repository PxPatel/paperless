"use client"

import Link from "next/link"
import { Clock, Archive, Home } from "lucide-react"
import { Organization } from "./organization-dashboard"

interface OrganizationSidebarProps {
  organization: Organization
  activeSection: "pending" | "all"
  setActiveSection: (section: "pending" | "all") => void
  pendingCount: number
  allCount: number
}

export function OrganizationSidebar({
  organization,
  activeSection,
  setActiveSection,
  pendingCount,
  allCount,
}: OrganizationSidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 p-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-gray-600 hover:text-cyan-600">
            <Home className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveSection("pending")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                  activeSection === "pending" ? "bg-cyan-50 text-cyan-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Pending Documents</span>
                </div>
                {pendingCount > 0 && (
                  <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-800">
                    {pendingCount}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("all")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                  activeSection === "all" ? "bg-cyan-50 text-cyan-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Archive className="h-4 w-4" />
                  <span>All Documents</span>
                </div>
                {allCount > 0 && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                    {allCount}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="rounded-lg bg-gray-50 p-3">
            <h3 className="mb-1 text-xs font-medium text-gray-500">QUICK HELP</h3>
            <p className="text-xs text-gray-500">
              Need assistance with your documents? Contact your course administrator.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

