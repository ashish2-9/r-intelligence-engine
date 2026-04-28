export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("rintelligence_user");
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user) {
  if (typeof window === "undefined") return;
  localStorage.setItem("rintelligence_user", JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("rintelligence_user");
  localStorage.removeItem("rintelligence_latest_analysis");
}

export function getStoredAnalysis() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("rintelligence_latest_analysis");
  return raw ? JSON.parse(raw) : null;
}

export function setStoredAnalysis(result) {
  if (typeof window === "undefined") return;
  localStorage.setItem("rintelligence_latest_analysis", JSON.stringify(result));
}
