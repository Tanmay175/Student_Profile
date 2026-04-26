import StudentProfile from "../models/StuProfile.js";
import User from "../models/User.js";   // ✅ ADD THIS

// ✅ CREATE PROFILE
export const createProfile = async (req, res) => {
  try {
    const { linkedin, github, leetcode } = req.body;

    const resume = req.files?.resume?.[0]?.path || "";
    const profilePhoto = req.files?.profilePhoto?.[0]?.path || "";

    const profile = await StudentProfile.create({
      userId: req.user._id,
      resume,
      profilePhoto,
      linkedin,
      github,
      leetcode,
      name:req.user.name,
      batch:req.user.batch
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      userId: req.user._id,
    });

    const user = await User.findById(req.user._id);

    if (!profile) {
      return res.json(null);
    }

    res.json({
      ...profile._doc,
      name: user.name,
      batch: user.batch,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({ message: "Not found" });
    }

    const { linkedin, github, leetcode} = req.body;

    if (linkedin) profile.linkedin = linkedin;
    if (github) profile.github = github;
    if (leetcode) profile.leetcode = leetcode;
    if (name) profile.name = name;
    if (batch) profile.batch = batch;

    // 🔥 HANDLE FILES
    if (req.files?.resume) {
      profile.resume = req.files.resume[0].path;
    }

    if (req.files?.profilePhoto) {
      profile.profilePhoto = req.files.profilePhoto[0].path;
    }

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.log("ERROR 👉", error); 
  res.status(500).json({ message: error.message });
  }
};