"use client";

import { useRouter } from "next/navigation";
import {
  FileText,
  FileIcon as FilePdf,
  FileIcon as FileWord,
  Clock,
} from "lucide-react";
import { Document } from "./organization-dashboard";

interface DocumentListProps {
  documents: Document[];
}

export function DocumentList({ documents }: DocumentListProps) {
  const router = useRouter();

  // Controller logic
  const handleDocumentClick = (documentId: string) => {
    // Placeholder navigation - in a real app, this would go to the document view
    router.push(`/document/${documentId}`);
  };

  // Helper function to get the appropriate icon based on document type
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FilePdf className="h-5 w-5 text-red-500" />;
      case "docx":
        return <FileWord className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  if (documents.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
        <p className="text-gray-500">No documents found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Document
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Category
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {documents.map((document) => (
            <tr
              key={document.id}
              onClick={() => handleDocumentClick(document.id)}
              className="cursor-pointer transition-colors hover:bg-gray-50"
            >
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center">
                  {getDocumentIcon(document.type)}
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {document.title}
                    </div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm text-gray-500">
                  {formatDate(document.dateCreated)}
                </div>
                {document.dueDate && document.status === "pending" && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <Clock className="h-3 w-3" />
                    <span>Due {formatDate(document.dueDate)}</span>
                  </div>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    document.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {document.status === "pending"
                    ? "Action Required"
                    : "Completed"}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {document.category
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
