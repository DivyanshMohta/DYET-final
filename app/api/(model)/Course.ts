import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  year: string;
  branch: string;
  subjects: {
    name: string;
    notesFileUrl: string; // URL to the Cloudinary-stored PDF
    publicId: string; // Cloudinary public ID for management
    quiz: {
      question: string;
      options: string[];
      answer: string;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema(
  {
    year: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    subjects: [
      {
        name: {
          type: String,
          required: true,
        },
        notesFileUrl: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        quiz: {
          type: [
            {
              question: {
                type: String,
                required: true,
              },
              options: {
                type: [String],
                required: true,
              },
              answer: {
                type: String,
                required: true,
              },
            },
          ],
          default: [], // Set default as empty array
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
export default Course;