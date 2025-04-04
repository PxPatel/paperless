import { redirect } from "next/navigation";
import { TeacherOrganizationView } from "../../../components/teacher/teacher-organization-view";
import { StudentOrganizationView } from "../../../components/student/student-organization-view";
import { Document } from "../../../types/organization";

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
      completedBy: 28,
      totalStudents: 30,
    },
    {
      id: "doc2",
      title: "Assignment 1: Introduction to Algorithms",
      dateCreated: "2025-03-18",
      status: "pending",
      dueDate: "2025-04-10",
      type: "docx",
      category: "assignment",
      completedBy: 15,
      totalStudents: 30,
    },
    {
      id: "doc3",
      title: "Midterm Exam Guidelines",
      dateCreated: "2025-03-20",
      status: "pending",
      dueDate: "2025-04-05",
      type: "pdf",
      category: "exam",
      completedBy: 22,
      totalStudents: 30,
    },
    {
      id: "doc4",
      title: "Programming Project Requirements",
      dateCreated: "2025-03-22",
      status: "pending",
      dueDate: "2025-04-15",
      type: "pdf",
      category: "project",
      completedBy: 8,
      totalStudents: 30,
    },
    {
      id: "doc5",
      title: "Lecture Notes - Week 1",
      dateCreated: "2025-03-10",
      status: "completed",
      type: "pdf",
      category: "course_material",
      completedBy: 30,
      totalStudents: 30,
    },
    {
      id: "doc6",
      title: "Lecture Notes - Week 2",
      dateCreated: "2025-03-17",
      status: "completed",
      type: "pdf",
      category: "course_material",
      completedBy: 25,
      totalStudents: 30,
    },
    {
      id: "doc7",
      title: "Group Project Team Assignment",
      dateCreated: "2025-03-25",
      status: "completed",
      type: "pdf",
      category: "announcement",
      completedBy: 30,
      totalStudents: 30,
    },
  ];

  // If organization doesn't exist, redirect to dashboard
  if (!organizationData) {
    redirect("/dashboard");
  }

  // Check user role from environment variable
  // In a real app, this would come from authentication/session
  const userRole = process.env.ROLE || "STUDENT";

  // Render the appropriate view based on user role
  if (userRole === "TEACHER") {
    return (
      <TeacherOrganizationView
        organization={organizationData}
        documents={documents}
      />
    );
  } else {
    return (
      <StudentOrganizationView
        organization={organizationData}
        documents={documents}
      />
    );
  }
}
