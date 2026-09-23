import { NextRequest, NextResponse } from "next/server";
import { handleApiError, requireSession } from "@/lib/api-utils";
import { deleteMarks, updateMarks } from "@/services/marksService";
import { marksUpdateSchema } from "@/validators/marks";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireSession(["admin", "faculty"]);
    const { id } = await params;
    const body = await request.json();
    const input = marksUpdateSchema.parse(body);
    const marks = await updateMarks(id, input);
    return NextResponse.json(marks);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireSession(["admin", "faculty"]);
    const { id } = await params;
    await deleteMarks(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
