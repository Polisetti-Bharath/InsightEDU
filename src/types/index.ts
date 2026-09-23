export type UserRole = "admin" | "faculty";

export const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "MECH"] as const;

export type Department = (typeof DEPARTMENTS)[number];

export type Grade = "O" | "A+" | "A" | "B" | "C" | "F";

export interface StudentDTO {
  id: string;
  studentId: string;
  name: string;
  email: string;
  department: Department;
  semester: number;
  createdAt: string;
}

export interface SubjectDTO {
  id: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  createdAt: string;
}

export interface MarksDTO {
  id: string;
  studentId: string;
  studentName: string;
  studentDisplayId: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  createdAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

export interface DashboardMetrics {
  totalStudents: number;
  totalSubjects: number;
  totalMarksEntries: number;
  classAverage: number;
  highestScore: number;
  lowestScore: number;
  passPercentage: number;
}

export interface SubjectAverage {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  averageScore: number;
}

export interface GradeDistributionBucket {
  grade: Grade;
  count: number;
}

export interface DepartmentPerformance {
  department: Department;
  averageScore: number;
  studentCount: number;
}

export interface PassFailRatio {
  passed: number;
  failed: number;
  passPercentage: number;
}

export interface StudentRanking {
  rank: number;
  studentId: string;
  studentDisplayId: string;
  name: string;
  department: Department;
  averageScore: number;
}

export interface WeakStudent {
  studentId: string;
  studentDisplayId: string;
  name: string;
  department: Department;
  averageScore: number;
}

export interface SubjectFailureAnalysis {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  totalEntries: number;
  failedCount: number;
  failureRate: number;
}
