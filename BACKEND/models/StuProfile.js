import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: String,
    linkedin: String,
    github: String,
    leetcode: String,
  },
  { timestamps: true }
);

export default mongoose.model("StudentProfile", studentProfileSchema);