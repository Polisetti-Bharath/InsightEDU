import { NextResponse } from "next/server";
import { handleApiError, requireSession } from "@/lib/api-utils";
import { getGradeDistribution } from "@/services/analyticsService";

export async function GET() {
  try {
    await requireSession();
    const grades = await getGradeDistribution();
    return NextResponse.json(grades);
  } catch (error) {
    return handleApiError(error);
  }
}
