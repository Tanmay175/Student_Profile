// Extracts LeetCode username from any valid URL format:
// https://leetcode.com/Tanmay/
// https://leetcode.com/u/Tanmay/
export const getLeetcodeUsername = (url) => {
  if (!url) return "";
  const clean = url.replace(/\/$/, "");
  const withU = clean.split("leetcode.com/u/")[1];
  if (withU) return withU.split("/")[0];
  const withoutU = clean.split("leetcode.com/")[1];
  if (withoutU) return withoutU.split("/")[0];
  return "";
};

export const getGithubUsername = (url) => {
  if (!url) return "";
  return url.replace(/\/$/, "").split("github.com/")[1]?.split("/")[0] || "";
};

export const DEFAULT_AVATAR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23dfe5e7'/%3E%3Ccircle cx='100' cy='75' r='38' fill='%23b0bec5'/%3E%3Cellipse cx='100' cy='185' rx='65' ry='50' fill='%23b0bec5'/%3E%3C/svg%3E`;