"use client";

import Link from "next/link";
import {
  Clock,
  CheckCircle,
  Archive,
  Home,
  Users,
  Settings,
} from "lucide-react";
import type { Organization } from "@/types/organization";

interface TeacherSidebarProps {
  organization: Organization;
  activeSection: "all" | "pending" | "completed";
  setActiveSection: (section: "all" | "pending" | "completed") => void;
  pendingCount: number;
  completedCount: number;
  allCount: number;
}

export function TeacherSidebar({
  organization,
  activeSection,
  setActiveSection,
  pendingCount,
  completedCount,
  allCount,
}: TeacherSidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-cyan-600"
          >
            <Home className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <div className="mb-4">
            <h3 className="mb-2 px-3 text-xs font-medium uppercase text-gray-500">
              Documents
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveSection("all")}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                    activeSection === "all"
                      ? "bg-cyan-50 text-cyan-700"
                      : "text-gray-700 hover:bg-gray-100"
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
              <li>
                <button
                  onClick={() => setActiveSection("pending")}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                    activeSection === "pending"
                      ? "bg-cyan-50 text-cyan-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Pending Action</span>
                  </div>
                  {pendingCount > 0 && (
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("completed")}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                    activeSection === "completed"
                      ? "bg-cyan-50 text-cyan-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Completed</span>
                  </div>
                  {completedCount > 0 && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      {completedCount}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="mb-2 px-3 text-xs font-medium uppercase text-gray-500">
              Management
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="#"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <Users className="h-4 w-4" />
                  <span>Students</span>
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="rounded-lg bg-cyan-50 p-3">
            <h3 className="mb-1 text-xs font-medium text-cyan-800">
              TEACHER TOOLS
            </h3>
            <p className="text-xs text-cyan-700">
              Use the Create Document button to upload new materials for your
              students.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
