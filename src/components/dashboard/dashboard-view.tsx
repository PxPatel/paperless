"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { EnrollModal } from "./enroll-modal"
import { OrganizationCard } from "./organization-card"

// This is the View part of MVC
export interface Organization {
  id: string
  name: string
  headline?: string
  adminName: string
  newNotifications: number
}

interface DashboardViewProps {
  organizations: Organization[]
}

export function DashboardView({ organizations }: DashboardViewProps) {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)

  // This is the Controller part of MVC
  const handleEnrollClick = () => {
    setIsEnrollModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsEnrollModalOpen(false)
  }

  const handleEnrollSubmit = (code: string) => {
    // This would normally send the code to your API
    console.log("Enrolling with code:", code)
    setIsEnrollModalOpen(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">My Organizations</h1>
        <button
          onClick={handleEnrollClick}
          className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white transition-colors hover:bg-cyan-700"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Join Organization</span>
        </button>
      </div>

      {organizations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500">You are not enrolled in any organizations yet.</p>
          <button
            onClick={handleEnrollClick}
            className="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-white transition-colors hover:bg-cyan-700"
          >
            Join Your First Organization
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {organizations.map((org) => (
            <OrganizationCard key={org.id} organization={org} />
          ))}
        </div>
      )}

      <EnrollModal isOpen={isEnrollModalOpen} onClose={handleCloseModal} onSubmit={handleEnrollSubmit} />
    </div>
  )
}

