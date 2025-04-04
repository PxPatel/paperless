"use client";

import { useState } from "react";
import { DocumentList } from "../shared/document-list";
import { TeacherSidebar } from "./teacher-sidebar";
import { CreateDocumentModal } from "./create-document-modal";
import type {
  Document,
  DocumentFormData,
  Organization,
} from "@/types/organization";
import { PlusCircle } from "lucide-react";

interface TeacherOrganizationViewProps {
  organization: Organization;
  documents: Document[];
}

// View component for teachers
export function TeacherOrganizationView({
  organization,
  documents,
}: TeacherOrganizationViewProps) {
  const [activeSection, setActiveSection] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<Document | null>(null);
  const [localDocuments, setLocalDocuments] = useState<Document[]>(documents);

  // Controller logic
  const pendingDocuments = localDocuments.filter(
    (doc) => doc.status === "pending"
  );
  const completedDocuments = localDocuments.filter(
    (doc) => doc.status === "completed"
  );

  let displayedDocuments: Document[];
  switch (activeSection) {
    case "pending":
      displayedDocuments = pendingDocuments;
      break;
    case "completed":
      displayedDocuments = completedDocuments;
      break;
    default:
      displayedDocuments = localDocuments;
  }

  const handleCreateDocument = (formData: DocumentFormData) => {
    // In a real app, this would send data to an API
    const newDocument: Document = {
      id: `doc${localDocuments.length + 1}`,
      title: formData.title,
      dateCreated: new Date().toISOString().split("T")[0],
      status: "pending",
      dueDate: formData.dueDate,
      type: formData.file?.name.split(".").pop() || "pdf",
      category: formData.category,
      completedBy: 0,
      totalStudents: 30,
    };

    setLocalDocuments([...localDocuments, newDocument]);
    setIsCreateModalOpen(false);
  };

  const handleEditDocument = (document: Document) => {
    setDocumentToEdit(document);
    setIsCreateModalOpen(true);
  };

  const handleUpdateDocument = (formData: DocumentFormData) => {
    if (!documentToEdit) return;

    const updatedDocuments = localDocuments.map((doc) =>
      doc.id === documentToEdit.id
        ? {
            ...doc,
            title: formData.title,
            category: formData.category,
            dueDate: formData.dueDate,
          }
        : doc
    );

    setLocalDocuments(updatedDocuments);
    setDocumentToEdit(null);
    setIsCreateModalOpen(false);
  };

  const handleDeleteDocument = (documentId: string) => {
    // In a real app, this would send a request to an API
    if (confirm("Are you sure you want to delete this document?")) {
      setLocalDocuments(localDocuments.filter((doc) => doc.id !== documentId));
    }
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setDocumentToEdit(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <TeacherSidebar
        organization={organization}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        pendingCount={pendingDocuments.length}
        completedCount={completedDocuments.length}
        allCount={localDocuments.length}
      />

      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {organization.name}
            </h1>
            <p className="text-sm text-gray-500">
              Admin: {organization.adminName}
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white transition-colors hover:bg-cyan-700"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create Document</span>
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-700">
            {activeSection === "pending"
              ? "Documents Requiring Action"
              : activeSection === "completed"
                ? "Completed Documents"
                : "All Documents"}
          </h2>
          <p className="text-sm text-gray-500">
            {activeSection === "pending"
              ? `${pendingDocuments.length} document${pendingDocuments.length !== 1 ? "s" : ""} require student action.`
              : activeSection === "completed"
                ? `${completedDocuments.length} document${completedDocuments.length !== 1 ? "s" : ""} have been completed.`
                : `Showing all ${localDocuments.length} document${localDocuments.length !== 1 ? "s" : ""}.`}
          </p>
        </div>

        <DocumentList
          documents={displayedDocuments}
          showCompletionStats={true}
          onEditDocument={handleEditDocument}
          onDeleteDocument={handleDeleteDocument}
        />
      </main>

      <CreateDocumentModal
        isOpen={isCreateModalOpen}
        onClose={closeModal}
        onSubmit={documentToEdit ? handleUpdateDocument : handleCreateDocument}
        editDocument={documentToEdit}
      />
    </div>
  );
}
