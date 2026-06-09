import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import professorRoutes from "./routes/professorRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://student-profile-six.vercel.app",
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/professor", professorRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/notifications", notificationRoutes);

const leetcodeCache = new Map();
const githubCache = new Map();
const CACHE_TTL_MS = 2 * 60 * 60 * 1000;

app.get("/api/leetcode/:username", async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) return res.status(400).json({ error: "Username required" });
    const cached = leetcodeCache.get(username);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return res.json({ ...cached.data, fromCache: true });
    const response = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`);
    if (!response.ok) return res.status(response.status).json({ error: "LeetCode API failed" });
    const data = await response.json();
    leetcodeCache.set(username, { data, fetchedAt: Date.now() });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch LeetCode data" });
  }
});

app.get("/api/github/:username", async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) return res.status(400).json({ error: "Username required" });
    const cached = githubCache.get(username);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return res.json({ ...cached.data, fromCache: true });
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        "User-Agent": "StuTrackApp",
        ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
      },
    });
    if (!response.ok) return res.status(response.status).json({ error: "GitHub API failed" });
    const data = await response.json();
    githubCache.set(username, { data, fetchedAt: Date.now() });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
