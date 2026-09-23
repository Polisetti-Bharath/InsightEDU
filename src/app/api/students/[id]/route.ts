import { NextRequest, NextResponse } from "next/server";
import { handleApiError, requireSession } from "@/lib/api-utils";
import { deleteStudent, getStudentById, updateStudent } from "@/services/studentService";
import { studentUpdateSchema } from "@/validators/student";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireSession();
    const { id } = await params;
    const student = await getStudentById(id);
    return NextResponse.json(student);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireSession(["admin"]);
    const { id } = await params;
    const body = await request.json();
    const input = studentUpdateSchema.parse(body);
    const student = await updateStudent(id, input);
    return NextResponse.json(student);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireSession(["admin"]);
    const { id } = await params;
    await deleteStudent(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
