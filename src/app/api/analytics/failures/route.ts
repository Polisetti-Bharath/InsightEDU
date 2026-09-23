import { NextResponse } from "next/server";
import { handleApiError, requireSession } from "@/lib/api-utils";
import { getSubjectFailureAnalysis } from "@/services/analyticsService";

export async function GET() {
  try {
    await requireSession();
    const failures = await getSubjectFailureAnalysis();
    return NextResponse.json(failures);
  } catch (error) {
    return handleApiError(error);
  }
}
