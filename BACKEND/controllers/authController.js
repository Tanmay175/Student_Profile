import User from "../models/User.js";
import StudentProfile from "../models/StuProfile.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import generateToken from "../utils/generateToken.js";
import OTP from "../models/OTP.js";
import sendEmail from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, batch, rollNo } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User exists" });

    if (role === "student") {
      if (!rollNo || !rollNo.trim())
        return res.status(400).json({ message: "Roll number is required for students" });
      if (!batch)
        return res.status(400).json({ message: "Batch (year of passout) is required for students" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      batch: role === "student" ? batch : undefined,
      rollNo: role === "student" ? rollNo.trim() : undefined,
    });

    if (role === "student") {
      await StudentProfile.create({
        userId: user._id,
        name: user.name,
        batch: user.batch,
        rollNo: user.rollNo,
      });
    }

    res.status(201).json({
      _id: user._id,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Both fields are required" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "New password must be at least 6 characters" });

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account found with this email" });

    await OTP.deleteMany({ email });

    const otp = crypto.randomInt(100000, 999999).toString();
    await OTP.create({ email, otp });

    await sendEmail({
      to: email,
      subject: "StuTrack — Password Reset OTP",
      html: `
        <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="margin-bottom:8px">🔐 Password Reset</h2>
          <p>Use the OTP below to reset your StuTrack password. It expires in <strong>10 minutes</strong>.</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:8px;text-align:center;padding:20px;background:#f3f4f6;border-radius:8px;margin:20px 0">
            ${otp}
          </div>
          <p style="color:#6b7280;font-size:13px">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const record = await OTP.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid or expired OTP" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await OTP.deleteMany({ email });

    res.json({ message: "Password reset successful ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};