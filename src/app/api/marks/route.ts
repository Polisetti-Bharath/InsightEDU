import { NextRequest, NextResponse } from "next/server";
import { handleApiError, requireSession } from "@/lib/api-utils";
import { createMarks, listMarks } from "@/services/marksService";
import { marksSchema } from "@/validators/marks";
import type { Department } from "@/types";

export async function GET(request: NextRequest) {
  try {
    await requireSession();

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "10");
    const search = searchParams.get("search") ?? undefined;
    const department = (searchParams.get("department") ?? "all") as Department | "all";
    const subjectId = searchParams.get("subjectId") ?? "all";

    const result = await listMarks({ page, pageSize, search, department, subjectId });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession(["admin", "faculty"]);

    const body = await request.json();
    const input = marksSchema.parse(body);
    const marks = await createMarks(input);

    return NextResponse.json(marks, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
