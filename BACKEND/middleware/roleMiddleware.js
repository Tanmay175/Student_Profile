export const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Student only" });
  }
  next();
};

export const isProfessor = (req, res, next) => {
  if (req.user.role !== "professor") {
    return res.status(403).json({ message: "Professor only" });
  }
  next();
};