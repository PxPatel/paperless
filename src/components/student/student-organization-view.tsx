"use client";

import { useState } from "react";
import { DocumentList } from "../shared/document-list";
import type { Document, Organization } from "@/types/organization";
import { StudentSidebar } from "./student-sidebar";

interface StudentOrganizationViewProps {
  organization: Organization;
  documents: Document[];
}

// View component
export function StudentOrganizationView({
  organization,
  documents,
}: StudentOrganizationViewProps) {
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
      <StudentSidebar
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
