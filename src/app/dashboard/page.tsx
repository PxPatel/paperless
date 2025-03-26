import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import ClassBox from "../../components/class";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // TODO: Fix/Redo the database schema so its easier to query
  const { data, error } = await supabase.from("class_teachers").select(
    `
      class_id!inner(*)
     `
  );

  // Handle any error that occurred during the query
  if (error) {
    console.error("Error fetching classes:", error);
    return;
  }

  const mappedData = [
    {
      id: "test_id",
      class_code: "test_code",
      class_name: "test_name",
      instructor: ["test_instructor"],
      created_by: "test_creator",
      role: "teacher",
    },
  ];

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      {mappedData.map((item) => (
        <ClassBox key={item.id} data={{ ...item }} />
      ))}
    </div>
  );
}
