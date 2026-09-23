"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { requireSession } from "@/lib/api-utils";
import { actionError, actionSuccess, type ActionResult } from "@/lib/action-result";
import {
  createSubject,
  deleteSubject,
  DuplicateSubjectError,
  updateSubject,
} from "@/services/subjectService";
import { NotFoundError } from "@/services/studentService";
import { subjectSchema, subjectUpdateSchema } from "@/validators/subject";
import type { SubjectDTO } from "@/types";

export async function createSubjectAction(
  input: unknown,
): Promise<ActionResult<SubjectDTO>> {
  try {
    await requireSession(["admin"]);
    const parsed = subjectSchema.parse(input);
    const subject = await createSubject(parsed);
    revalidatePath("/subjects");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    return actionSuccess(subject);
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateSubjectAction(
  id: string,
  input: unknown,
): Promise<ActionResult<SubjectDTO>> {
  try {
    await requireSession(["admin"]);
    const parsed = subjectUpdateSchema.parse(input);
    const subject = await updateSubject(id, parsed);
    revalidatePath("/subjects");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    return actionSuccess(subject);
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteSubjectAction(id: string): Promise<ActionResult<null>> {
  try {
    await requireSession(["admin"]);
    await deleteSubject(id);
    revalidatePath("/subjects");
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
  if (error instanceof DuplicateSubjectError || error instanceof NotFoundError) {
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
