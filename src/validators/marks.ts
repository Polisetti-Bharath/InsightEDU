import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const marksSchema = z.object({
  studentId: z.string().regex(objectIdRegex, "Select a valid student"),
  subjectId: z.string().regex(objectIdRegex, "Select a valid subject"),
  internalMarks: z.coerce
    .number()
    .min(0, "Internal marks must be between 0 and 40")
    .max(40, "Internal marks must be between 0 and 40"),
  externalMarks: z.coerce
    .number()
    .min(0, "External marks must be between 0 and 60")
    .max(60, "External marks must be between 0 and 60"),
});

export type MarksInput = z.infer<typeof marksSchema>;

export const marksUpdateSchema = marksSchema.partial();
export type MarksUpdateInput = z.infer<typeof marksUpdateSchema>;
