import { NextResponse } from "next/server";
import { handleApiError, requireSession } from "@/lib/api-utils";
import { getSubjectPerformance } from "@/services/analyticsService";

export async function GET() {
  try {
    await requireSession();
    const subjects = await getSubjectPerformance();
    return NextResponse.json(subjects);
  } catch (error) {
    return handleApiError(error);
  }
}
