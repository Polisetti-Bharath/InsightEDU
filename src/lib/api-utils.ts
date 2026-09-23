import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/auth";
import type { UserRole } from "@/types";
import { DuplicateStudentError, NotFoundError } from "@/services/studentService";
import { DuplicateSubjectError } from "@/services/subjectService";
import { DuplicateMarksError } from "@/services/marksService";

export class UnauthorizedError extends Error {
  constructor(message = "You are not signed in.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function requireSession(allowedRoles?: UserRole[]) {
  const session = await auth();

  if (!session?.user) {
    throw new UnauthorizedError();
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    throw new ForbiddenError();
  }

  return session;
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof UnauthorizedError) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  if (error instanceof ForbiddenError) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (
    error instanceof DuplicateStudentError ||
    error instanceof DuplicateSubjectError ||
    error instanceof DuplicateMarksError
  ) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  console.error(error);
  return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}
