import StudentProfile from "../models/StuProfile.js";
import User from "../models/User.js";

// Helper: convert Google Drive share link to embed link
const toDriveEmbed = (link) => {
  if (!link) return "";
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match
    ? `https://drive.google.com/file/d/${match[1]}/preview`
    : link;
};

// CREATE PROFILE
export const createProfile = async (req, res) => {
  try {
    const { linkedin, github, leetcode, bio, rollNo, resumeLink } = req.body;

    const profilePhoto = req.files?.profilePhoto?.[0]?.path || "";

    const profile = await StudentProfile.create({
      userId: req.user._id,
      profilePhoto,
      linkedin,
      github,
      leetcode,
      bio,
      rollNo,
      resume: resumeLink ? toDriveEmbed(resumeLink) : "",
      name: req.user.name,
      batch: req.user.batch,
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    const user = await User.findById(req.user._id);

    if (!profile) return res.json(null);

    res.json({
      ...profile._doc,
      name: user.name,
      batch: user.batch,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });

    if (!profile) return res.status(404).json({ message: "Not found" });

    const { linkedin, github, leetcode, name, batch, bio, rollNo, resumeLink } = req.body;

    if (linkedin) profile.linkedin = linkedin;
    if (github) profile.github = github;
    if (leetcode) profile.leetcode = leetcode;
    if (name) profile.name = name;
    if (batch) profile.batch = batch;
    if (bio !== undefined) profile.bio = bio;
    if (rollNo !== undefined) profile.rollNo = rollNo;

    // ✅ Resume is now a Google Drive link, not a file upload
    if (resumeLink !== undefined && resumeLink !== "") {
      profile.resume = toDriveEmbed(resumeLink);
    }

    // Only profilePhoto still goes through Cloudinary
    if (req.files?.profilePhoto) {
      profile.profilePhoto = req.files.profilePhoto[0].path;
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};