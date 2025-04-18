import mongoose, { Schema, Document } from "mongoose";

export interface IStudentActivity extends Document {
  userId: string;
  userName: string;
  year: string;
  branch: string;
  subject: string;
  unitNumber: number;
  activityType: "notes_access" | "quiz_submission";
  quizResult?: {
    score: number;
    totalQuestions: number;
    answers: { [key: string]: string };
  };
  timestamp: Date;
}

const StudentActivitySchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    unitNumber: {
      type: Number,
      required: true,
    },
    activityType: {
      type: String,
      enum: ["notes_access", "quiz_submission"],
      required: true,
    },
    quizResult: {
      score: { type: Number },
      totalQuestions: { type: Number },
      answers: { type: Schema.Types.Mixed },
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const StudentActivity =
  mongoose.models.StudentActivity ||
  mongoose.model<IStudentActivity>("StudentActivity", StudentActivitySchema);

export default StudentActivity;