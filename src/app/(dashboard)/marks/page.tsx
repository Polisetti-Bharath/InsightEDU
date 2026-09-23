import { listMarks } from "@/services/marksService";
import { listAllStudents } from "@/services/studentService";
import { listAllSubjects } from "@/services/subjectService";
import { MarksClient } from "@/components/marks/marks-client";
import type { Department } from "@/types";

export const dynamic = "force-dynamic";

interface MarksPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    department?: string;
    subjectId?: string;
  }>;
}

export default async function MarksPage({ searchParams }: MarksPageProps) {
  const params = await searchParams;

  const page = Number(params.page ?? "1");
  const search = params.search ?? "";
  const department = (params.department ?? "all") as Department | "all";
  const subjectId = params.subjectId ?? "all";

  const [result, students, subjects] = await Promise.all([
    listMarks({ page, pageSize: 10, search, department, subjectId }),
    listAllStudents(),
    listAllSubjects(),
  ]);

  return (
    <MarksClient
      result={result}
      search={search}
      department={department}
      subjectId={subjectId}
      students={students}
      subjects={subjects}
    />
  );
}
