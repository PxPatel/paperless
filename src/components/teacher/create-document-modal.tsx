"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import type {
  Document,
  DocumentCategory,
  DocumentFormData,
} from "@/types/organization";

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: DocumentFormData) => void;
  editDocument?: Document | null;
}

export function CreateDocumentModal({
  isOpen,
  onClose,
  onSubmit,
  editDocument,
}: CreateDocumentModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("course_material");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Populate form when editing a document
  useEffect(() => {
    if (editDocument) {
      setTitle(editDocument.title);
      setCategory(editDocument.category as DocumentCategory);
      setDueDate(editDocument.dueDate || "");
    } else {
      // Reset form when creating a new document
      setTitle("");
      setCategory("course_material");
      setDueDate("");
      setFile(null);
    }
  }, [editDocument]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: DocumentFormData = {
      title,
      category,
      dueDate: dueDate || undefined,
      file: file || undefined,
    };

    onSubmit(formData);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {editDocument ? "Edit Document" : "Create New Document"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Document Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            >
              <option value="course_material">Course Material</option>
              <option value="assignment">Assignment</option>
              <option value="exam">Exam</option>
              <option value="project">Project</option>
              <option value="announcement">Announcement</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="due-date"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Due Date (Optional)
            </label>
            <input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {!editDocument && (
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Upload Document
              </label>
              <div
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 ${
                  dragActive ? "border-cyan-500 bg-cyan-50" : "border-gray-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="text-center">
                    <p className="mb-1 text-sm font-medium text-gray-700">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="mt-2 text-xs text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-2 h-10 w-10 text-gray-400" />
                    <p className="mb-1 text-sm text-gray-700">
                      Drag and drop your file here, or
                    </p>
                    <label className="cursor-pointer rounded-md bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700 hover:bg-cyan-100">
                      Browse Files
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      Supports PDF, DOC, DOCX
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

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
              {editDocument ? "Update Document" : "Create Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
