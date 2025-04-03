import { redirect } from "next/navigation";
import { OrganizationDashboard } from "../../../components/organization/organization-dashboard";
import type { Document } from "../../../components/organization/organization-dashboard";

// This acts as the Controller in MVC - fetching data and passing to the view
export default function OrganizationPage({
  params,
}: {
  params: { id: string };
}) {
  // Mock data - in a real app, this would be fetched from an API
  const organizationData = {
    id: params.id,
    name: "Computer Science 101",
    adminName: "Prof. Alan Turing",
  };

  // Mock documents data
  const documents: Document[] = [
    {
      id: "doc1",
      title: "Course Syllabus",
      dateCreated: "2025-03-15",
      status: "completed",
      type: "pdf",
      category: "course_material",
    },
    {
      id: "doc2",
      title: "Assignment 1: Introduction to Algorithms",
      dateCreated: "2025-03-18",
      status: "pending",
      dueDate: "2025-04-10",
      type: "docx",
      category: "assignment",
    },
    {
      id: "doc3",
      title: "Midterm Exam Guidelines",
      dateCreated: "2025-03-20",
      status: "pending",
      dueDate: "2025-04-05",
      type: "pdf",
      category: "exam",
    },
    {
      id: "doc4",
      title: "Programming Project Requirements",
      dateCreated: "2025-03-22",
      status: "pending",
      dueDate: "2025-04-15",
      type: "pdf",
      category: "project",
    },
    {
      id: "doc5",
      title: "Lecture Notes - Week 1",
      dateCreated: "2025-03-10",
      status: "completed",
      type: "pdf",
      category: "course_material",
    },
    {
      id: "doc6",
      title: "Lecture Notes - Week 2",
      dateCreated: "2025-03-17",
      status: "completed",
      type: "pdf",
      category: "course_material",
    },
    {
      id: "doc7",
      title: "Group Project Team Assignment",
      dateCreated: "2025-03-25",
      status: "completed",
      type: "pdf",
      category: "announcement",
    },
  ];

  // If organization doesn't exist, redirect to dashboard
  if (!organizationData) {
    redirect("/dashboard");
  }

  return (
    <OrganizationDashboard
      organization={organizationData}
      documents={documents}
    />
  );
}
