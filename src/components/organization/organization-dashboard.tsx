"use client";

import { useState } from "react";
import { DocumentList } from "./document-list";
import { OrganizationSidebar } from "./organization-sidebar";

// Types (Model in MVC)
export interface Organization {
  id: string;
  name: string;
  adminName: string;
}

export interface Document {
  id: string;
  title: string;
  dateCreated: string;
  status: "pending" | "completed";
  dueDate?: string;
  type: string;
  category: string;
}

interface OrganizationDashboardProps {
  organization: Organization;
  documents: Document[];
}

// View component
export function OrganizationDashboard({
  organization,
  documents,
}: OrganizationDashboardProps) {
  const [activeSection, setActiveSection] = useState<"pending" | "all">(
    "pending"
  );

  // Controller logic
  const pendingDocuments = documents.filter((doc) => doc.status === "pending");
  const allDocuments = documents;

  const displayedDocuments =
    activeSection === "pending" ? pendingDocuments : allDocuments;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <OrganizationSidebar
        organization={organization}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        pendingCount={pendingDocuments.length}
        allCount={allDocuments.length}
      />

      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {organization.name}
          </h1>
          <p className="text-sm text-gray-500">
            Admin: {organization.adminName}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-700">
            {activeSection === "pending"
              ? "Documents Requiring Action"
              : "All Documents"}
          </h2>
          <p className="text-sm text-gray-500">
            {activeSection === "pending"
              ? `You have ${pendingDocuments.length} document${pendingDocuments.length !== 1 ? "s" : ""} that require your attention.`
              : `Showing all ${allDocuments.length} document${allDocuments.length !== 1 ? "s" : ""}.`}
          </p>
        </div>

        <DocumentList documents={displayedDocuments} />
      </main>
    </div>
  );
}
