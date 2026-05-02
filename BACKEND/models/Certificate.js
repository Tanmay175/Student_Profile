import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Certificate title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Internship",
          "Course",
          "Workshop",
          "Hackathon",
          "Research",
          "Achievement",
          "Sports",
          "Cultural",
          "Other",
        ],
        message: "{VALUE} is not a valid category",
      },
    },
    driveLink: {
      type: String,
      required: [true, "Google Drive link is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

certificateSchema.statics.countByStudent = function (studentId) {
  return this.countDocuments({ student: studentId });
};

export default mongoose.model("Certificate", certificateSchema);