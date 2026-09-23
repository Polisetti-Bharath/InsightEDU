import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { DEPARTMENTS } from "@/types";

const studentSchema = new Schema(
  {
    studentId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    department: {
      type: String,
      required: true,
      enum: DEPARTMENTS,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

studentSchema.index({ studentId: 1 }, { unique: true });
studentSchema.index({ email: 1 }, { unique: true });
studentSchema.index({ department: 1 });
studentSchema.index({ semester: 1 });
studentSchema.index({ createdAt: -1 });
studentSchema.index({ name: "text", studentId: "text", email: "text" });

export type StudentDocument = InferSchemaType<typeof studentSchema>;

export const Student: Model<StudentDocument> =
  models.Student || model<StudentDocument>("Student", studentSchema);

export default Student;
