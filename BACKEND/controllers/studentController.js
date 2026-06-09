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
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      const label = field === "rollNo" ? "roll number" : field;
      return res.status(400).json({ message: `A profile with this ${label} already exists` });
    }
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
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      const label = field === "rollNo" ? "roll number" : field;
      return res.status(400).json({ message: `A profile with this ${label} already exists` });
    }
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
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      const label = field === "rollNo" ? "roll number" : field;
      return res.status(400).json({ message: `A profile with this ${label} already exists` });
    }
    res.status(500).json({ message: error.message });
  }
};
// GET MY RANK IN BATCH
// Rank = position in batch sorted by LeetCode solved count (simple, fast, no external API call needed)
// We rank by leetcode URL presence as a proxy — for real scoring we'd need the API
// Instead: rank by number of filled profile fields (robust offline ranking)
export const getMyRank = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user?.batch) return res.status(400).json({ message: "Batch not set" });

    // Get all students in same batch
    const batchUsers = await User.find({ role: "student", batch: user.batch }).select("_id");
    const userIds = batchUsers.map((u) => u._id);

    // Get all their profiles
    const profiles = await StudentProfile.find({ userId: { $in: userIds } });

    // Score = count of filled fields (github, leetcode, linkedin, resume, bio, profilePhoto)
    const scoreProfile = (p) => {
      if (!p) return 0;
      return [p.github, p.leetcode, p.linkedin, p.resume, p.bio, p.profilePhoto]
        .filter(Boolean).length;
    };

    const myProfile = profiles.find((p) => p.userId.toString() === req.user._id.toString());
    const myScore = scoreProfile(myProfile);

    // Sort descending; rank = how many have strictly higher score + 1
    const rank = profiles.filter((p) => scoreProfile(p) > myScore).length + 1;

    res.json({ rank, total: batchUsers.length, score: myScore });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      const label = field === "rollNo" ? "roll number" : field;
      return res.status(400).json({ message: `A profile with this ${label} already exists` });
    }
    res.status(500).json({ message: error.message });
  }
};