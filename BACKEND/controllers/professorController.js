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

export const getAllStudents = async (req, res) => {
  try {
        console.log("HIT GET ALL STUDENTS");

    const students = await User.find({ role: "student" }).select("-password");

    const result = await Promise.all(
      students.map(async (student) => {
        const profile = await StudentProfile.findOne({
          userId: student._id,
        });

        console.log(students);

        return {
          student,
          profile: profile || {
            github: "",
            leetcode: "",
            profilePhoto: "",
          },
        };
      })
    );

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getStudentsByBatchWithProfiles = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
      batch: req.params.batch,
    }).select("-password");

    const result = await Promise.all(
      students.map(async (student) => {
        const profile = await StudentProfile.findOne({ userId: student._id });
        return {
          student,
          profile: profile || { github: "", leetcode: "", profilePhoto: "" },
        };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// DELETE STUDENT (professor only)
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findById(id);
    if (!student || student.role !== "student")
      return res.status(404).json({ message: "Student not found" });

    // Delete profile and user
    await StudentProfile.deleteOne({ userId: id });
    await User.deleteOne({ _id: id });

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};