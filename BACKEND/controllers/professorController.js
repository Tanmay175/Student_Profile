import User from "../models/User.js";
import StudentProfile from "../models/StuProfile.js";

export const getBatches = async (req, res) => {
  const batches = await User.distinct("batch", { role: "student" });
  res.json(batches);
};

export const getStudentsByBatch = async (req, res) => {
  const students = await User.find({
    role: "student",
    batch: req.params.year,
  }).select("-password");

  res.json(students);
};

export const getStudentDetails = async (req, res) => {
  const student = await User.findById(req.params.id).select("-password");

  const profile = await StudentProfile.findOne({
    userId: req.params.id,
  });

  res.json({ student, profile });
};