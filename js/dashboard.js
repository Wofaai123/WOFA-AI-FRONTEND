const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

// frontend/js/dashboard.js

async function loadProgress() {
  const container = document.getElementById("dashboard");

  try {
    const data = await apiGet("/progress/summary");

    if (!data || !data.completedLessons) {
      container.innerHTML = "<p>No progress yet.</p>";
      return;
    }

    container.innerHTML = `
      <h3>Completed Lessons: ${data.completedLessons}</h3>
      <ul class="progress-list">
        ${data.lessons
          .map(
            p => `<li class="completed">✔ ${p.lesson.title}</li>`
          )
          .join("")}
      </ul>
    `;
  } catch (err) {
    container.innerHTML =
      "<p>⚠️ Unable to load progress. Please log in.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadProgress);
