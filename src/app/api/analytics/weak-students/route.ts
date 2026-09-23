import { NextResponse } from "next/server";
import { handleApiError, requireSession } from "@/lib/api-utils";
import { getWeakStudents } from "@/services/analyticsService";

export async function GET() {
  try {
    await requireSession();
    const weakStudents = await getWeakStudents();
    return NextResponse.json(weakStudents);
  } catch (error) {
    return handleApiError(error);
  }
}
