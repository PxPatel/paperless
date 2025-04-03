"use client";

import { useRouter } from "next/navigation";
import type { Organization } from "./dashboard-view";
import { Bell } from "lucide-react";

interface OrganizationCardProps {
  organization: Organization;
}

// This is part of the View in MVC
export function OrganizationCard({ organization }: OrganizationCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/organization/${organization.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {organization.name}
          </h3>
          {organization.newNotifications > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-cyan-100 px-2 py-1 text-xs font-medium text-cyan-800">
              <Bell className="h-3 w-3" />
              <span>{organization.newNotifications}</span>
            </div>
          )}
        </div>

        {organization.headline && (
          <p className="mb-4 text-sm text-gray-500">{organization.headline}</p>
        )}

        <div className="mt-auto pt-4">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Admin:</span> {organization.adminName}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-1 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}
