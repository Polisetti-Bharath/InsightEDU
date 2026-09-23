import { NextResponse } from "next/server";
import { handleApiError, requireSession } from "@/lib/api-utils";
import { getPassFailRatio } from "@/services/analyticsService";

export async function GET() {
  try {
    await requireSession();
    const ratio = await getPassFailRatio();
    return NextResponse.json(ratio);
  } catch (error) {
    return handleApiError(error);
  }
}
