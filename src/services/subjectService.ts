import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Subject } from "@/models/Subject";
import { Marks } from "@/models/Marks";
import type { SubjectInput, SubjectUpdateInput } from "@/validators/subject";
import type { PaginatedResult, SubjectDTO } from "@/types";
import { NotFoundError } from "@/services/studentService";

interface ListSubjectsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export class DuplicateSubjectError extends Error {
  constructor() {
    super("A subject with this Subject Code already exists.");
    this.name = "DuplicateSubjectError";
  }
}

function toSubjectDTO(doc: {
  _id: Types.ObjectId;
  subjectCode: string;
  subjectName: string;
  credits: number;
  createdAt?: Date;
}): SubjectDTO {
  return {
    id: doc._id.toString(),
    subjectCode: doc.subjectCode,
    subjectName: doc.subjectName,
    credits: doc.credits,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
  };
}

export async function listSubjects({
  page = 1,
  pageSize = 10,
  search,
}: ListSubjectsParams): Promise<PaginatedResult<SubjectDTO>> {
  await connectToDatabase();

  const filter: Record<string, unknown> = {};

  if (search && search.trim()) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ subjectName: regex }, { subjectCode: regex }];
  }

  const skip = (page - 1) * pageSize;

  const [docs, total] = await Promise.all([
    Subject.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
    Subject.countDocuments(filter),
  ]);

  return {
    data: docs.map(toSubjectDTO),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function listAllSubjects(): Promise<SubjectDTO[]> {
  await connectToDatabase();
  const docs = await Subject.find().sort({ subjectName: 1 }).lean();
  return docs.map(toSubjectDTO);
}

export async function getSubjectById(id: string): Promise<SubjectDTO> {
  await connectToDatabase();
  const doc = await Subject.findById(id).lean();
  if (!doc) {
    throw new NotFoundError("Subject");
  }
  return toSubjectDTO(doc);
}

export async function createSubject(input: SubjectInput): Promise<SubjectDTO> {
  await connectToDatabase();

  const existing = await Subject.findOne({ subjectCode: input.subjectCode }).lean();
  if (existing) {
    throw new DuplicateSubjectError();
  }

  const doc = await Subject.create(input);
  return toSubjectDTO(doc.toObject());
}

export async function updateSubject(
  id: string,
  input: SubjectUpdateInput,
): Promise<SubjectDTO> {
  await connectToDatabase();

  if (input.subjectCode) {
    const existing = await Subject.findOne({
      _id: { $ne: id },
      subjectCode: input.subjectCode,
    }).lean();
    if (existing) {
      throw new DuplicateSubjectError();
    }
  }

  const doc = await Subject.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  }).lean();

  if (!doc) {
    throw new NotFoundError("Subject");
  }

  return toSubjectDTO(doc);
}

export async function deleteSubject(id: string): Promise<void> {
  await connectToDatabase();
  const doc = await Subject.findByIdAndDelete(id).lean();
  if (!doc) {
    throw new NotFoundError("Subject");
  }
  await Marks.deleteMany({ subjectId: id });
}
