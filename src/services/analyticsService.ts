import type { PipelineStage } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Marks } from "@/models/Marks";
import { Student } from "@/models/Student";
import type {
  Department,
  DashboardMetrics,
  DepartmentPerformance,
  Grade,
  GradeDistributionBucket,
  PassFailRatio,
  StudentRanking,
  SubjectAverage,
  SubjectFailureAnalysis,
  WeakStudent,
} from "@/types";

const PASSING_MARKS = 40;
const WEAK_STUDENT_THRESHOLD = 50;

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  await connectToDatabase();

  const [totalStudents, totalSubjects, marksSummary] = await Promise.all([
    Student.countDocuments(),
    (await import("@/models/Subject")).Subject.countDocuments(),
    Marks.aggregate<{
      _id: null;
      totalMarksEntries: number;
      classAverage: number | null;
      highestScore: number | null;
      lowestScore: number | null;
      passedCount: number;
    }>([
      {
        $group: {
          _id: null,
          totalMarksEntries: { $sum: 1 },
          classAverage: { $avg: "$totalMarks" },
          highestScore: { $max: "$totalMarks" },
          lowestScore: { $min: "$totalMarks" },
          passedCount: {
            $sum: {
              $cond: [{ $gte: ["$totalMarks", PASSING_MARKS] }, 1, 0],
            },
          },
        },
      },
    ]),
  ]);

  const summary = marksSummary[0];
  const totalMarksEntries = summary?.totalMarksEntries ?? 0;
  const passPercentage =
    totalMarksEntries > 0 ? ((summary?.passedCount ?? 0) / totalMarksEntries) * 100 : 0;

  return {
    totalStudents,
    totalSubjects,
    totalMarksEntries,
    classAverage: Math.round((summary?.classAverage ?? 0) * 100) / 100,
    highestScore: summary?.highestScore ?? 0,
    lowestScore: summary?.lowestScore ?? 0,
    passPercentage: Math.round(passPercentage * 100) / 100,
  };
}

export async function getStudentRankings(limit?: number): Promise<StudentRanking[]> {
  await connectToDatabase();

  const pipeline: PipelineStage[] = [
    {
      $group: {
        _id: "$studentId",
        averageScore: { $avg: "$totalMarks" },
      },
    },
    { $sort: { averageScore: -1 } },
  ];

  if (limit) {
    pipeline.push({ $limit: limit });
  }

  pipeline.push(
    {
      $lookup: {
        from: "students",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: "$student" },
    {
      $project: {
        _id: 0,
        studentId: { $toString: "$student._id" },
        studentDisplayId: "$student.studentId",
        name: "$student.name",
        department: "$student.department",
        averageScore: { $round: ["$averageScore", 2] },
      },
    },
  );

  const results = await Marks.aggregate<Omit<StudentRanking, "rank">>(pipeline);

  return results.map((row, index) => ({ ...row, rank: index + 1 }));
}

export async function getTopStudents(limit = 10): Promise<StudentRanking[]> {
  return getStudentRankings(limit);
}

export async function getSubjectPerformance(): Promise<SubjectAverage[]> {
  await connectToDatabase();

  return Marks.aggregate<SubjectAverage>([
    {
      $group: {
        _id: "$subjectId",
        averageScore: { $avg: "$totalMarks" },
      },
    },
    {
      $lookup: {
        from: "subjects",
        localField: "_id",
        foreignField: "_id",
        as: "subject",
      },
    },
    { $unwind: "$subject" },
    { $sort: { "subject.subjectName": 1 } },
    {
      $project: {
        _id: 0,
        subjectId: { $toString: "$subject._id" },
        subjectName: "$subject.subjectName",
        subjectCode: "$subject.subjectCode",
        averageScore: { $round: ["$averageScore", 2] },
      },
    },
  ]);
}

export async function getWeakStudents(): Promise<WeakStudent[]> {
  await connectToDatabase();

  return Marks.aggregate<WeakStudent>([
    {
      $group: {
        _id: "$studentId",
        averageScore: { $avg: "$totalMarks" },
      },
    },
    { $match: { averageScore: { $lt: WEAK_STUDENT_THRESHOLD } } },
    { $sort: { averageScore: 1 } },
    {
      $lookup: {
        from: "students",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: "$student" },
    {
      $project: {
        _id: 0,
        studentId: { $toString: "$student._id" },
        studentDisplayId: "$student.studentId",
        name: "$student.name",
        department: "$student.department",
        averageScore: { $round: ["$averageScore", 2] },
      },
    },
  ]);
}

export async function getGradeDistribution(): Promise<GradeDistributionBucket[]> {
  await connectToDatabase();

  const gradeLabels: { grade: Grade; boundary: number }[] = [
    { grade: "F", boundary: 0 },
    { grade: "C", boundary: 50 },
    { grade: "B", boundary: 60 },
    { grade: "A", boundary: 70 },
    { grade: "A+", boundary: 80 },
    { grade: "O", boundary: 90 },
  ];

  const results = await Marks.aggregate<{ _id: number; count: number }>([
    {
      $bucket: {
        groupBy: "$totalMarks",
        boundaries: [0, 50, 60, 70, 80, 90, 101],
        default: "other",
        output: { count: { $sum: 1 } },
      },
    },
  ]);

  const countByBoundary = new Map(results.map((r) => [r._id, r.count]));

  return gradeLabels.map(({ grade, boundary }) => ({
    grade,
    count: countByBoundary.get(boundary) ?? 0,
  }));
}

export async function getDepartmentPerformance(): Promise<DepartmentPerformance[]> {
  await connectToDatabase();

  return Marks.aggregate<DepartmentPerformance>([
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
      $group: {
        _id: "$student.department",
        averageScore: { $avg: "$totalMarks" },
        studentIds: { $addToSet: "$student._id" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        department: "$_id",
        averageScore: { $round: ["$averageScore", 2] },
        studentCount: { $size: "$studentIds" },
      },
    },
  ]);
}

export async function getSubjectFailureAnalysis(): Promise<SubjectFailureAnalysis[]> {
  await connectToDatabase();

  return Marks.aggregate<SubjectFailureAnalysis>([
    {
      $group: {
        _id: "$subjectId",
        totalEntries: { $sum: 1 },
        failedCount: {
          $sum: { $cond: [{ $lt: ["$totalMarks", PASSING_MARKS] }, 1, 0] },
        },
      },
    },
    {
      $lookup: {
        from: "subjects",
        localField: "_id",
        foreignField: "_id",
        as: "subject",
      },
    },
    { $unwind: "$subject" },
    {
      $project: {
        _id: 0,
        subjectId: { $toString: "$subject._id" },
        subjectName: "$subject.subjectName",
        subjectCode: "$subject.subjectCode",
        totalEntries: 1,
        failedCount: 1,
        failureRate: {
          $round: [
            {
              $cond: [
                { $eq: ["$totalEntries", 0] },
                0,
                { $multiply: [{ $divide: ["$failedCount", "$totalEntries"] }, 100] },
              ],
            },
            2,
          ],
        },
      },
    },
    { $sort: { failureRate: -1 } },
  ]);
}

export async function getPassFailRatio(): Promise<PassFailRatio> {
  await connectToDatabase();

  const results = await Marks.aggregate<{ _id: null; passed: number; failed: number }>([
    {
      $group: {
        _id: null,
        passed: {
          $sum: { $cond: [{ $gte: ["$totalMarks", PASSING_MARKS] }, 1, 0] },
        },
        failed: {
          $sum: { $cond: [{ $lt: ["$totalMarks", PASSING_MARKS] }, 1, 0] },
        },
      },
    },
  ]);

  const passed = results[0]?.passed ?? 0;
  const failed = results[0]?.failed ?? 0;
  const total = passed + failed;

  return {
    passed,
    failed,
    passPercentage: total > 0 ? Math.round((passed / total) * 10000) / 100 : 0,
  };
}

export interface DepartmentFilterable {
  department?: Department | "all";
}
