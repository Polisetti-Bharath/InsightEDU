import { Types, type PipelineStage } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Marks } from "@/models/Marks";
import { Student } from "@/models/Student";
import { Subject } from "@/models/Subject";
import type { MarksInput, MarksUpdateInput } from "@/validators/marks";
import type { Department, MarksDTO, PaginatedResult } from "@/types";
import { NotFoundError } from "@/services/studentService";

interface ListMarksParams {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: Department | "all";
  subjectId?: string | "all";
}

export class DuplicateMarksError extends Error {
  constructor() {
    super("Marks for this student in this subject already exist.");
    this.name = "DuplicateMarksError";
  }
}

interface MarksAggregateRow {
  _id: Types.ObjectId;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  createdAt: Date;
  student: { _id: Types.ObjectId; studentId: string; name: string; department: string };
  subject: { _id: Types.ObjectId; subjectCode: string; subjectName: string };
}

function toMarksDTO(row: MarksAggregateRow): MarksDTO {
  return {
    id: row._id.toString(),
    studentId: row.student._id.toString(),
    studentName: row.student.name,
    studentDisplayId: row.student.studentId,
    subjectId: row.subject._id.toString(),
    subjectName: row.subject.subjectName,
    subjectCode: row.subject.subjectCode,
    internalMarks: row.internalMarks,
    externalMarks: row.externalMarks,
    totalMarks: row.totalMarks,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listMarks({
  page = 1,
  pageSize = 10,
  search,
  department,
  subjectId,
}: ListMarksParams): Promise<PaginatedResult<MarksDTO>> {
  await connectToDatabase();

  const skip = (page - 1) * pageSize;

  const matchStage: Record<string, unknown> = {};
  if (subjectId && subjectId !== "all") {
    matchStage.subjectId = new Types.ObjectId(subjectId);
  }

  const pipeline: PipelineStage[] = [
    { $match: matchStage },
    {
      $lookup: {
        from: "students",
        localField: "studentId",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: "$student" },
    {
      $lookup: {
        from: "subjects",
        localField: "subjectId",
        foreignField: "_id",
        as: "subject",
      },
    },
    { $unwind: "$subject" },
  ];

  if (department && department !== "all") {
    pipeline.push({ $match: { "student.department": department } });
  }

  if (search && search.trim()) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    pipeline.push({
      $match: {
        $or: [{ "student.name": regex }, { "subject.subjectName": regex }],
      },
    });
  }

  pipeline.push({ $sort: { createdAt: -1 } });

  pipeline.push({
    $facet: {
      data: [{ $skip: skip }, { $limit: pageSize }],
      totalCount: [{ $count: "count" }],
    },
  });

  const result = await Marks.aggregate<{
    data: MarksAggregateRow[];
    totalCount: { count: number }[];
  }>(pipeline);

  const total = result[0]?.totalCount[0]?.count ?? 0;
  const data = (result[0]?.data ?? []).map(toMarksDTO);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function createMarks(input: MarksInput): Promise<MarksDTO> {
  await connectToDatabase();

  const [student, subject] = await Promise.all([
    Student.findById(input.studentId).lean(),
    Subject.findById(input.subjectId).lean(),
  ]);

  if (!student) throw new NotFoundError("Student");
  if (!subject) throw new NotFoundError("Subject");

  const existing = await Marks.findOne({
    studentId: input.studentId,
    subjectId: input.subjectId,
  }).lean();
  if (existing) {
    throw new DuplicateMarksError();
  }

  const totalMarks = input.internalMarks + input.externalMarks;

  const doc = await Marks.create({ ...input, totalMarks });

  return toMarksDTO({
    _id: doc._id,
    internalMarks: doc.internalMarks,
    externalMarks: doc.externalMarks,
    totalMarks: doc.totalMarks,
    createdAt: doc.createdAt ?? new Date(),
    student: {
      _id: student._id,
      studentId: student.studentId,
      name: student.name,
      department: student.department,
    },
    subject: {
      _id: subject._id,
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
    },
  });
}

export async function updateMarks(id: string, input: MarksUpdateInput): Promise<MarksDTO> {
  await connectToDatabase();

  const current = await Marks.findById(id);
  if (!current) {
    throw new NotFoundError("Marks");
  }

  if (input.studentId || input.subjectId) {
    const studentId = input.studentId ?? current.studentId.toString();
    const subjectId = input.subjectId ?? current.subjectId.toString();
    const existing = await Marks.findOne({
      _id: { $ne: id },
      studentId,
      subjectId,
    }).lean();
    if (existing) {
      throw new DuplicateMarksError();
    }
  }

  const internalMarks = input.internalMarks ?? current.internalMarks;
  const externalMarks = input.externalMarks ?? current.externalMarks;

  current.set({
    ...input,
    internalMarks,
    externalMarks,
    totalMarks: internalMarks + externalMarks,
  });

  await current.save();

  const [student, subject] = await Promise.all([
    Student.findById(current.studentId).lean(),
    Subject.findById(current.subjectId).lean(),
  ]);

  if (!student) throw new NotFoundError("Student");
  if (!subject) throw new NotFoundError("Subject");

  return toMarksDTO({
    _id: current._id,
    internalMarks: current.internalMarks,
    externalMarks: current.externalMarks,
    totalMarks: current.totalMarks,
    createdAt: current.createdAt ?? new Date(),
    student: {
      _id: student._id,
      studentId: student.studentId,
      name: student.name,
      department: student.department,
    },
    subject: {
      _id: subject._id,
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
    },
  });
}

export async function deleteMarks(id: string): Promise<void> {
  await connectToDatabase();
  const doc = await Marks.findByIdAndDelete(id).lean();
  if (!doc) {
    throw new NotFoundError("Marks");
  }
}
