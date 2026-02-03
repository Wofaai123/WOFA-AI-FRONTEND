const API_BASE = "https://wofa-ai-backend.onrender.com/api";

/* =========================
   EMAIL / PASSWORD LOGIN
   ========================= */
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Email and password required");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = "index.html";

  } catch (err) {
    alert("Server error");
    console.error(err);
  }
}

/* =========================
   GOOGLE LOGIN HANDLER
   ========================= */
async function handleGoogleLogin(response) {
  try {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken: response.credential
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Google login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = "index.html";

  } catch (err) {
    console.error("Google login error:", err);
    alert("Google login failed");
  }
}
