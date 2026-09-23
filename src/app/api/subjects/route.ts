import { NextRequest, NextResponse } from "next/server";
import { handleApiError, requireSession } from "@/lib/api-utils";
import { createSubject, listAllSubjects, listSubjects } from "@/services/subjectService";
import { subjectSchema } from "@/validators/subject";

export async function GET(request: NextRequest) {
  try {
    await requireSession();

    const { searchParams } = new URL(request.url);

    if (searchParams.get("all") === "true") {
      const subjects = await listAllSubjects();
      return NextResponse.json(subjects);
    }

    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "10");
    const search = searchParams.get("search") ?? undefined;

    const result = await listSubjects({ page, pageSize, search });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession(["admin"]);

    const body = await request.json();
    const input = subjectSchema.parse(body);
    const subject = await createSubject(input);

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
