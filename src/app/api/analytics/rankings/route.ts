import { NextRequest, NextResponse } from "next/server";
import { handleApiError, requireSession } from "@/lib/api-utils";
import { getStudentRankings } from "@/services/analyticsService";

export async function GET(request: NextRequest) {
  try {
    await requireSession();
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : undefined;

    const rankings = await getStudentRankings(limit);
    return NextResponse.json(rankings);
  } catch (error) {
    return handleApiError(error);
  }
}
