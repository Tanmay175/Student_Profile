import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import professorRoutes from "./routes/professorRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ FIX: restrict CORS to your frontend URL only
app.use(cors({
  origin: ["http://localhost:5173", process.env.CLIENT_URL].filter(Boolean),
  credentials: true,
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/professor", professorRoutes);
app.use("/api/certificates", certificateRoutes);

// ✅ In-memory cache: { username -> { data, fetchedAt } }
const leetcodeCache = new Map();
const githubCache = new Map();
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

app.get("/api/leetcode/:username", async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) return res.status(400).json({ error: "Username required" });

    // Check cache
    const cached = leetcodeCache.get(username);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      return res.json({ ...cached.data, fromCache: true });
    }

    // Fetch solved count with difficulty breakdown
    const response = await fetch(
      `https://alfa-leetcode-api.onrender.com/${username}/solved`
    );
    if (!response.ok) return res.status(response.status).json({ error: "LeetCode API failed" });

    const data = await response.json();

    // Store in cache
    leetcodeCache.set(username, { data, fetchedAt: Date.now() });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch LeetCode data" });
  }
});

// ✅ GitHub cache proxy to avoid rate limits on frontend
app.get("/api/github/:username", async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) return res.status(400).json({ error: "Username required" });

    // Check cache
    const cached = githubCache.get(username);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      return res.json({ ...cached.data, fromCache: true });
    }

    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        "User-Agent": "StudentProfileApp",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    });

    if (!response.ok) return res.status(response.status).json({ error: "GitHub API failed" });

    const data = await response.json();

    // Store in cache
    githubCache.set(username, { data, fetchedAt: Date.now() });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});