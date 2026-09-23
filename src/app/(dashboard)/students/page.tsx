import { auth } from "@/auth";
import { listStudents } from "@/services/studentService";
import { StudentsClient } from "@/components/students/students-client";
import type { Department } from "@/types";

export const dynamic = "force-dynamic";

interface StudentsPageProps {
  searchParams: Promise<{ page?: string; search?: string; department?: string }>;
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const params = await searchParams;
  const session = await auth();

  const page = Number(params.page ?? "1");
  const search = params.search ?? "";
  const department = (params.department ?? "all") as Department | "all";

  const result = await listStudents({ page, pageSize: 10, search, department });

  return (
    <StudentsClient
      result={result}
      search={search}
      department={department}
      isAdmin={session?.user.role === "admin"}
    />
  );
}
