/* =========================
   API BASE
   ========================= */
const API_BASE = "https://wofa-ai-backend.onrender.com/api";

/* =========================
   DOM ELEMENTS
   ========================= */
const coursesList = document.getElementById("coursesList");
const lessonsList = document.getElementById("lessonsList");
const chatBox = document.getElementById("chatBox");

/* =========================
   STATE
   ========================= */
let activeCourseId = null;
let activeLessonId = null;

/* =========================
   LOAD COURSES
   ========================= */
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

      li.addEventListener("click", () => toggleCourse(course._id, li));
      coursesList.appendChild(li);
    });

  } catch (err) {
    coursesList.innerHTML = "<li>Failed to load courses</li>";
    console.error(err);
  }
}

/* =========================
   TOGGLE COURSE (EXPAND/COLLAPSE)
   ========================= */
async function toggleCourse(courseId, element) {
  const isSameCourse = activeCourseId === courseId;

  // Reset all courses
  document
    .querySelectorAll(".course-list li")
    .forEach(li => li.classList.remove("active"));

  lessonsList.classList.remove("open");
  lessonsList.innerHTML = "";

  if (isSameCourse) {
    activeCourseId = null;
    return;
  }

  activeCourseId = courseId;
  element.classList.add("active");

  lessonsList.innerHTML = "<li>Loading lessons...</li>";
  lessonsList.classList.add("open");

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

      li.addEventListener("click", e => {
        e.stopPropagation(); // prevent collapsing course
        selectLesson(lesson._id, li);
      });

      lessonsList.appendChild(li);
    });

  } catch (err) {
    lessonsList.innerHTML = "<li>Failed to load lessons</li>";
    console.error(err);
  }
}

/* =========================
   SELECT LESSON
   ========================= */
function selectLesson(lessonId, element) {
  activeLessonId = lessonId;

  document
    .querySelectorAll(".lesson-list li")
    .forEach(li => li.classList.remove("active"));

  element.classList.add("active");

  localStorage.setItem("activeLessonId", lessonId);

  if (chatBox) {
    chatBox.innerHTML += `
      <div class="message ai">
        📘 Lesson selected.<br>
        Ask questions about this lesson.
      </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

/* =========================
   INIT
   ========================= */
document.addEventListener("DOMContentLoaded", loadCourses);
