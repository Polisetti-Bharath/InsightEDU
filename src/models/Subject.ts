import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const subjectSchema = new Schema(
  {
    subjectCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

subjectSchema.index({ subjectCode: 1 }, { unique: true });
subjectSchema.index({ createdAt: -1 });
subjectSchema.index({ subjectName: "text", subjectCode: "text" });

export type SubjectDocument = InferSchemaType<typeof subjectSchema>;

export const Subject: Model<SubjectDocument> =
  models.Subject || model<SubjectDocument>("Subject", subjectSchema);

export default Subject;
