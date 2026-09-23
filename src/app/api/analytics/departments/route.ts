import { NextResponse } from "next/server";
import { handleApiError, requireSession } from "@/lib/api-utils";
import { getDepartmentPerformance } from "@/services/analyticsService";

export async function GET() {
  try {
    await requireSession();
    const departments = await getDepartmentPerformance();
    return NextResponse.json(departments);
  } catch (error) {
    return handleApiError(error);
  }
}
