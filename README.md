# 🎓 StuTrack — Student Profile Management System

> A full-stack platform to manage, track, and compare student technical profiles.

---

## ✨ Features

### 👨‍🎓 Student
- 🔐 JWT Authentication
- 👤 Create & edit profile
- 🖼️ Upload profile photo
- 📄 Resume link support
- 🏆 Upload certificates
- 🔑 Change password
- 📊 GitHub & LeetCode stats

### 👨‍🏫 Professor
- 👀 View all students
- 🎯 Filter by batch
- 📈 Batch leaderboard
- 📂 View detailed student profiles

### ⚙️ System
- ☁️ Cloudinary image uploads
- 🚀 Cached GitHub & LeetCode APIs
- 🛡️ Role-based access control
- 📱 Responsive UI

---

# 🛠️ Tech Stack

| Frontend | Backend | Database | Others |
|---|---|---|---|
| React 19 | Node.js | MongoDB | JWT |
| Vite | Express 5 | Mongoose | Cloudinary |
| Tailwind CSS | REST APIs |  | Multer |
| DaisyUI |  |  | Axios |

---

# 📂 Project Structure

```bash
Student_Profile/
│
├── BACKEND/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
│
└── FRONTEND/
    └── src/
        ├── components/
        ├── pages/
        ├── routes/
        └── services/
```

---

# 🚀 Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Tanmay175/Student_Profile.git
cd Student_Profile
```

---

# 🔙 Backend Setup

```bash
cd BACKEND
npm install
```

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

CLIENT_URL=http://localhost:5173

CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret

GITHUB_TOKEN=your_github_token
```

Run backend:

```bash
npm run dev
```

---

# 🌐 Frontend Setup

```bash
cd FRONTEND
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

---

# 📊 Leaderboard Scoring

| Source | Points |
|---|---|
| 🟢 LeetCode Easy | 1 |
| 🟡 LeetCode Medium | 3 |
| 🔴 LeetCode Hard | 5 |
| 📦 GitHub Repo | 3 |
| 👥 GitHub Follower | 1 |
| 🏅 Certificate | 2 |

---

# 📸 Screenshots

```md
Add screenshots here
```

---

# 🔗 APIs Used

- GitHub REST API
- alfa-leetcode-api
- Cloudinary

---

# 🧠 Future Improvements

- 🌙 Dark Mode
- 📧 Email Verification
- 📈 Analytics Dashboard
- 📄 Resume PDF Upload
- 🔔 Notifications

---

# 🤝 Contributing

```bash
git checkout -b feature-name
git commit -m "Added feature"
git push origin feature-name
```

---

# 👨‍💻 Author

## Tanmay Saha

- GitHub: :contentReference[oaicite:0]{index=0}
- Repository: :contentReference[oaicite:1]{index=1}

---

# 📜 License

MIT License
