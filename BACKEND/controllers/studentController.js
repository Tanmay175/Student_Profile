import StudentProfile from "../models/StuProfile.js";

export const createProfile = async (req, res) => {
  try {
    const { linkedin, github, leetcode } = req.body;

    const profile = await StudentProfile.create({
      userId: req.user._id,
      resume: req.file ? req.file.path : "",
      linkedin,
      github,
      leetcode,
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  const profile = await StudentProfile.findOne({ userId: req.user._id });
  res.json(profile);
};

export const updateProfile = async (req, res) => {
  const profile = await StudentProfile.findOne({ userId: req.user._id });

  if (!profile) return res.status(404).json({ message: "Not found" });

  const { linkedin, github, leetcode } = req.body;

  if (linkedin) profile.linkedin = linkedin;
  if (github) profile.github = github;
  if (leetcode) profile.leetcode = leetcode;
  if (req.file) profile.resume = req.file.path;

  await profile.save();

  res.json(profile);
};