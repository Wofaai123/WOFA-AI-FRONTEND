// api.js - WOFA AI Frontend API Helper (Auto Local + Production)

const API_BASE =
  window.location.hostname.includes("localhost")
    ? "http://localhost:5000/api"
    : "https://wofa-ai-backend.onrender.com/api";

/* =========================
   POST REQUEST HELPER
   ========================= */
async function apiPost(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  return res.json();
}

/* =========================
   GET REQUEST HELPER
   ========================= */
async function apiGet(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET"
  });

  return res.json();
}
