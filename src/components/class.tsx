"use client";

import { redirect } from "next/navigation";
import React from "react";

interface ClassBoxProps {
  data: {
    id: string;
    class_code: string;
    class_name: string;
    instructor?: string[];
    created_by: any;
    role: string;
  };
}

const ClassBox: React.FC<ClassBoxProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div
      className="bg-gray-100 rounded-lg shadow-md border border-gray-400 p-20 flex flex-wrap gap-4 cursor-pointer"
      onClick={() => redirect(`/dashboard/${data.id}`)}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div
        key={data.id}
        className="w-full transition-transform transform hover:scale-105"
      >
        <h3 className="min-w-full text-xl font-semibold mb-2 text-gray-800">
          {data.class_name}
        </h3>
        <p className="text-gray-500">Role: {data.role}</p>
      </div>
    </div>
  );
};

export default ClassBox;
