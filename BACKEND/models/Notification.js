import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["batch", "personal"], required: true },
    batch: { type: String, default: null },         // if type = batch
    toStudent: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // if type = personal
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // who has read it
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
