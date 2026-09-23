import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Student } from "@/models/Student";
import { Marks } from "@/models/Marks";
import type { StudentInput, StudentUpdateInput } from "@/validators/student";
import type { Department, PaginatedResult, StudentDTO } from "@/types";

interface ListStudentsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: Department | "all";
}

export class DuplicateStudentError extends Error {
  constructor(field: "studentId" | "email") {
    super(
      field === "studentId"
        ? "A student with this Student ID already exists."
        : "A student with this email already exists.",
    );
    this.name = "DuplicateStudentError";
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found.`);
    this.name = "NotFoundError";
  }
}

function toStudentDTO(doc: {
  _id: Types.ObjectId;
  studentId: string;
  name: string;
  email: string;
  department: string;
  semester: number;
  createdAt?: Date;
}): StudentDTO {
  return {
    id: doc._id.toString(),
    studentId: doc.studentId,
    name: doc.name,
    email: doc.email,
    department: doc.department as Department,
    semester: doc.semester,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
  };
}

export async function listStudents({
  page = 1,
  pageSize = 10,
  search,
  department,
}: ListStudentsParams): Promise<PaginatedResult<StudentDTO>> {
  await connectToDatabase();

  const filter: Record<string, unknown> = {};

  if (department && department !== "all") {
    filter.department = department;
  }

  if (search && search.trim()) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: regex }, { studentId: regex }, { email: regex }];
  }

  const skip = (page - 1) * pageSize;

  const [docs, total] = await Promise.all([
    Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
    Student.countDocuments(filter),
  ]);

  return {
    data: docs.map(toStudentDTO),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function listAllStudents(): Promise<StudentDTO[]> {
  await connectToDatabase();
  const docs = await Student.find().sort({ name: 1 }).lean();
  return docs.map(toStudentDTO);
}

export async function getStudentById(id: string): Promise<StudentDTO> {
  await connectToDatabase();
  const doc = await Student.findById(id).lean();
  if (!doc) {
    throw new NotFoundError("Student");
  }
  return toStudentDTO(doc);
}

export async function createStudent(input: StudentInput): Promise<StudentDTO> {
  await connectToDatabase();

  const existing = await Student.findOne({
    $or: [{ studentId: input.studentId }, { email: input.email }],
  }).lean();

  if (existing) {
    throw new DuplicateStudentError(
      existing.studentId === input.studentId ? "studentId" : "email",
    );
  }

  const doc = await Student.create(input);
  return toStudentDTO(doc.toObject());
}

export async function updateStudent(
  id: string,
  input: StudentUpdateInput,
): Promise<StudentDTO> {
  await connectToDatabase();

  if (input.studentId || input.email) {
    const existing = await Student.findOne({
      _id: { $ne: id },
      $or: [
        ...(input.studentId ? [{ studentId: input.studentId }] : []),
        ...(input.email ? [{ email: input.email }] : []),
      ],
    }).lean();

    if (existing) {
      throw new DuplicateStudentError(
        existing.studentId === input.studentId ? "studentId" : "email",
      );
    }
  }

  const doc = await Student.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  }).lean();

  if (!doc) {
    throw new NotFoundError("Student");
  }

  return toStudentDTO(doc);
}

export async function deleteStudent(id: string): Promise<void> {
  await connectToDatabase();
  const doc = await Student.findByIdAndDelete(id).lean();
  if (!doc) {
    throw new NotFoundError("Student");
  }
  await Marks.deleteMany({ studentId: id });
}
