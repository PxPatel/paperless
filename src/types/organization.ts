// Model definitions (MVC)
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
  completedBy?: number;
  totalStudents?: number;
}

export type DocumentCategory =
  | "course_material"
  | "assignment"
  | "exam"
  | "project"
  | "announcement"
  | "other";

export interface DocumentFormData {
  title: string;
  category: DocumentCategory;
  dueDate?: string;
  file?: File;
}
