import { NextResponse } from "next/server";
import { handleApiError, requireSession } from "@/lib/api-utils";
import { getDashboardMetrics } from "@/services/analyticsService";

export async function GET() {
  try {
    await requireSession();
    const metrics = await getDashboardMetrics();
    return NextResponse.json(metrics);
  } catch (error) {
    return handleApiError(error);
  }
}
