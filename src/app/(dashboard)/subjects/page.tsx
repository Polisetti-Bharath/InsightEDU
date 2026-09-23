import { auth } from "@/auth";
import { listSubjects } from "@/services/subjectService";
import { SubjectsClient } from "@/components/subjects/subjects-client";

export const dynamic = "force-dynamic";

interface SubjectsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function SubjectsPage({ searchParams }: SubjectsPageProps) {
  const params = await searchParams;
  const session = await auth();

  const page = Number(params.page ?? "1");
  const search = params.search ?? "";

  const result = await listSubjects({ page, pageSize: 10, search });

  return <SubjectsClient result={result} search={search} isAdmin={session?.user.role === "admin"} />;
}
