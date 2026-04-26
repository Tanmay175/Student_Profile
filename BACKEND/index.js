import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import professorRoutes from "./routes/professorRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/professor", professorRoutes);

app.get("/api/leetcode/:username", async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: "Username required" });
    }

    const response = await fetch(
      `https://alfa-leetcode-api.onrender.com/${username}`
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "LeetCode API failed" });
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.log("LeetCode Error:", error);
    res.status(500).json({ error: "Failed to fetch LeetCode data" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});