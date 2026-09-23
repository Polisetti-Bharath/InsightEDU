import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const marksSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    internalMarks: {
      type: Number,
      required: true,
      min: 0,
      max: 40,
    },
    externalMarks: {
      type: Number,
      required: true,
      min: 0,
      max: 60,
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

marksSchema.index({ studentId: 1 });
marksSchema.index({ subjectId: 1 });
marksSchema.index({ studentId: 1, subjectId: 1 }, { unique: true });
marksSchema.index({ createdAt: -1 });

export type MarksDocument = InferSchemaType<typeof marksSchema>;

export const Marks: Model<MarksDocument> =
  models.Marks || model<MarksDocument>("Marks", marksSchema);

export default Marks;
