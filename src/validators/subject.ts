import { z } from "zod";

export const subjectSchema = z.object({
  subjectCode: z
    .string()
    .trim()
    .toUpperCase()
    .min(2, "Subject code must be at least 2 characters")
    .max(15, "Subject code must be at most 15 characters"),
  subjectName: z
    .string()
    .trim()
    .min(2, "Subject name must be at least 2 characters")
    .max(100, "Subject name must be at most 100 characters"),
  credits: z.coerce
    .number()
    .int("Credits must be a whole number")
    .min(1, "Credits must be between 1 and 6")
    .max(6, "Credits must be between 1 and 6"),
});

export type SubjectInput = z.infer<typeof subjectSchema>;

export const subjectUpdateSchema = subjectSchema.partial();
export type SubjectUpdateInput = z.infer<typeof subjectUpdateSchema>;
