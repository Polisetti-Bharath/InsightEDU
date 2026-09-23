import { NextRequest, NextResponse } from "next/server";
import { handleApiError, requireSession } from "@/lib/api-utils";
import { deleteSubject, getSubjectById, updateSubject } from "@/services/subjectService";
import { subjectUpdateSchema } from "@/validators/subject";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireSession();
    const { id } = await params;
    const subject = await getSubjectById(id);
    return NextResponse.json(subject);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireSession(["admin"]);
    const { id } = await params;
    const body = await request.json();
    const input = subjectUpdateSchema.parse(body);
    const subject = await updateSubject(id, input);
    return NextResponse.json(subject);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireSession(["admin"]);
    const { id } = await params;
    await deleteSubject(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
