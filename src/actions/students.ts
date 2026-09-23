"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { requireSession } from "@/lib/api-utils";
import { actionError, actionSuccess, type ActionResult } from "@/lib/action-result";
import {
  createStudent,
  deleteStudent,
  DuplicateStudentError,
  NotFoundError,
  updateStudent,
} from "@/services/studentService";
import { studentSchema, studentUpdateSchema } from "@/validators/student";
import type { StudentDTO } from "@/types";

export async function createStudentAction(
  input: unknown,
): Promise<ActionResult<StudentDTO>> {
  try {
    await requireSession(["admin"]);
    const parsed = studentSchema.parse(input);
    const student = await createStudent(parsed);
    revalidatePath("/students");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    return actionSuccess(student);
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateStudentAction(
  id: string,
  input: unknown,
): Promise<ActionResult<StudentDTO>> {
  try {
    await requireSession(["admin"]);
    const parsed = studentUpdateSchema.parse(input);
    const student = await updateStudent(id, parsed);
    revalidatePath("/students");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    return actionSuccess(student);
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteStudentAction(id: string): Promise<ActionResult<null>> {
  try {
    await requireSession(["admin"]);
    await deleteStudent(id);
    revalidatePath("/students");
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
  if (error instanceof DuplicateStudentError || error instanceof NotFoundError) {
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
