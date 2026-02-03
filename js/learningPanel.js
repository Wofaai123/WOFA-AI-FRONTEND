// =========================
// API BASE (Render backend)
// =========================
const API_BASE = "https://wofa-ai-backend.onrender.com/api";

// =========================
// DOM ELEMENTS
// =========================
const coursesList = document.getElementById("coursesList");
const lessonsList = document.getElementById("lessonsList");

// =========================
// STATE
// =========================
let activeCourseId = null;
let activeLessonId = null;

// =========================
// LOAD COURSES
// =========================
async function loadCourses() {
  coursesList.innerHTML = "<li>Loading courses...</li>";
  lessonsList.innerHTML = "";

  try {
    const res = await fetch(`${API_BASE}/courses`);
    const courses = await res.json();

    coursesList.innerHTML = "";

    if (!courses.length) {
      coursesList.innerHTML = "<li>No courses available</li>";
      return;
    }

    courses.forEach(course => {
      const li = document.createElement("li");
      li.textContent = course.title;

      li.onclick = () => selectCourse(course._id, li);
      coursesList.appendChild(li);
    });

  } catch (err) {
    coursesList.innerHTML = "<li>Failed to load courses</li>";
    console.error(err);
  }
}

// =========================
// SELECT COURSE → LOAD LESSONS
// =========================
async function selectCourse(courseId, element) {
  activeCourseId = courseId;

  // highlight active course
  document
    .querySelectorAll(".course-list li")
    .forEach(li => li.classList.remove("active"));

  element.classList.add("active");

  lessonsList.innerHTML = "<li>Loading lessons...</li>";

  try {
    const res = await fetch(`${API_BASE}/lessons/${courseId}`);
    const lessons = await res.json();

    lessonsList.innerHTML = "";

    if (!lessons.length) {
      lessonsList.innerHTML = "<li>No lessons yet</li>";
      return;
    }

    lessons.forEach(lesson => {
      const li = document.createElement("li");
      li.textContent = lesson.title;

      li.onclick = () => selectLesson(lesson._id, li);
      lessonsList.appendChild(li);
    });

  } catch (err) {
    lessonsList.innerHTML = "<li>Failed to load lessons</li>";
    console.error(err);
  }
}

// =========================
// SELECT LESSON
// =========================
function selectLesson(lessonId, element) {
  activeLessonId = lessonId;

  document
    .querySelectorAll(".lesson-list li")
    .forEach(li => li.classList.remove("active"));

  element.classList.add("active");

  // Store for chat context
  localStorage.setItem("activeLessonId", lessonId);

  // Visual confirmation in chat
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML += `
    <div class="message ai">
      📘 Lesson selected.<br>
      You can now ask questions about this lesson.
    </div>
  `;
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", loadCourses);
