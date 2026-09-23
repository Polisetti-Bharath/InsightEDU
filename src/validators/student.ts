import { z } from "zod";
import { DEPARTMENTS } from "@/types";

export const studentSchema = z.object({
  studentId: z
    .string()
    .trim()
    .min(3, "Student ID must be at least 3 characters")
    .max(20, "Student ID must be at most 20 characters"),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  department: z.enum(DEPARTMENTS, {
    message: "Select a valid department",
  }),
  semester: z.coerce
    .number()
    .int("Semester must be a whole number")
    .min(1, "Semester must be between 1 and 8")
    .max(8, "Semester must be between 1 and 8"),
});

export type StudentInput = z.infer<typeof studentSchema>;

export const studentUpdateSchema = studentSchema.partial();
export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>;
