"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { requireSession } from "@/lib/api-utils";
import { actionError, actionSuccess, type ActionResult } from "@/lib/action-result";
import { createMarks, deleteMarks, DuplicateMarksError, updateMarks } from "@/services/marksService";
import { NotFoundError } from "@/services/studentService";
import { marksSchema, marksUpdateSchema } from "@/validators/marks";
import type { MarksDTO } from "@/types";

export async function createMarksAction(input: unknown): Promise<ActionResult<MarksDTO>> {
  try {
    await requireSession(["admin", "faculty"]);
    const parsed = marksSchema.parse(input);
    const marks = await createMarks(parsed);
    revalidatePath("/marks");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    return actionSuccess(marks);
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateMarksAction(
  id: string,
  input: unknown,
): Promise<ActionResult<MarksDTO>> {
  try {
    await requireSession(["admin", "faculty"]);
    const parsed = marksUpdateSchema.parse(input);
    const marks = await updateMarks(id, parsed);
    revalidatePath("/marks");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    return actionSuccess(marks);
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteMarksAction(id: string): Promise<ActionResult<null>> {
  try {
    await requireSession(["admin", "faculty"]);
    await deleteMarks(id);
    revalidatePath("/marks");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    return actionSuccess(null);
  } catch (error) {
    return toActionError(error);
  }
}

function toActionError<T>(error: unknown): ActionResult<T> {
  if (error instanceof ZodError) {
    return actionError("Validation failed", error.flatten().fieldErrors);
  }
  if (error instanceof DuplicateMarksError || error instanceof NotFoundError) {
    return actionError(error.message);
  }
  if (error instanceof Error && error.name === "ForbiddenError") {
    return actionError(error.message);
  }
  if (error instanceof Error && error.name === "UnauthorizedError") {
    return actionError(error.message);
  }
  console.error(error);
  return actionError("Something went wrong. Please try again.");
}
