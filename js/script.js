/* ==========================================================
   WOFA AI SCRIPT.JS (2026 AUTONOMOUS AI TUTOR VERSION)
   - Courses/Lessons optional
   - Smart teaching mode
   - Image support
   - Voice support
   - No barriers
   - Professional stability
   ========================================================== */

/* =========================
   AUTH GUARD
   ========================= */
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

/* =========================
   API BASE
   ========================= */
const API_BASE = "https://wofa-ai-backend.onrender.com/api";

/* =========================
   GLOBAL STATE
   ========================= */
let lastAIMessageElement = null;
let lastUploadedImage = null;
let speechUtterance = null;
let isThinking = false;

/* =========================
   DOM ELEMENTS
   ========================= */
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("questionInput");
const imageInput = document.getElementById("imageInput");
const darkToggle = document.getElementById("darkToggle");

/* =========================
   THEME (DARK MODE)
   ========================= */
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

(function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.body.classList.add("dark");
})();

if (darkToggle) darkToggle.onclick = toggleDarkMode;

/* =========================
   UTILITIES
   ========================= */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function scrollChatToBottom() {
  if (!chatBox) return;
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* =========================
   VOICE OUTPUT (TALK MODE)
   ========================= */
function speakText(text) {
  if (!text) return;

  window.speechSynthesis.cancel();

  speechUtterance = new SpeechSynthesisUtterance(text);
  speechUtterance.lang = "en-US";
  speechUtterance.rate = 0.95;
  speechUtterance.pitch = 1;

  window.speechSynthesis.speak(speechUtterance);
}

function readLastAnswer() {
  if (!lastAIMessageElement) {
    alert("No AI answer yet.");
    return;
  }

  const cleanText = lastAIMessageElement.innerText
    .replace("🔊 Listen", "")
    .trim();

  speakText(cleanText);
}

function stopSpeaking() {
  window.speechSynthesis.cancel();
}

/* =========================
   THINKING INDICATOR
   ========================= */
function showThinking() {
  removeThinking();

  const msg = document.createElement("div");
  msg.className = "message ai thinking";
  msg.id = "thinking-indicator";
  msg.innerHTML = "WOFA AI is thinking<span class='dots'>...</span>";

  chatBox.appendChild(msg);
  scrollChatToBottom();
}

function removeThinking() {
  const el = document.getElementById("thinking-indicator");
  if (el) el.remove();
}

/* =========================
   ADD USER MESSAGE
   ========================= */
function addUserMessage(text, images = []) {
  const msg = document.createElement("div");
  msg.className = "message user";
  msg.innerHTML = text.replace(/\n/g, "<br>");

  images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.style.maxWidth = "240px";
    img.style.borderRadius = "12px";
    img.style.marginTop = "8px";
    msg.appendChild(img);
  });

  chatBox.appendChild(msg);
  scrollChatToBottom();
}

/* =========================
   ADD AI MESSAGE (TYPING EFFECT)
   ========================= */
async function typeAIMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message ai";
  chatBox.appendChild(msg);

  let i = 0;
  const speed = 12;

  while (i < text.length) {
    msg.innerHTML = text.slice(0, i).replace(/\n/g, "<br>");
    i++;
    scrollChatToBottom();
    await sleep(speed);
  }

  // Save last AI message
  lastAIMessageElement = msg;

  // Add listen button
  const speakBtn = document.createElement("button");
  speakBtn.className = "speak-btn";
  speakBtn.textContent = "🔊 Listen";
  speakBtn.onclick = readLastAnswer;
  msg.appendChild(speakBtn);

  scrollChatToBottom();
}

/* =========================
   SMART TUTOR INTRO
   ========================= */
function tutorWelcomeIfNeeded() {
  const alreadyWelcomed = localStorage.getItem("welcomed");

  if (!alreadyWelcomed) {
    localStorage.setItem("welcomed", "true");

    const intro = document.createElement("div");
    intro.className = "message ai";
    intro.innerHTML = `
      <strong>Welcome to WOFA AI 🎓</strong><br><br>
      I can teach you ANYTHING from Montessori → University → PhD.<br><br>
      ✅ You can ask any question<br>
      ✅ You can select courses/lessons (optional)<br>
      ✅ I can explain step-by-step like a real teacher<br><br>
      <em>Start by asking me anything!</em>
    `;
    chatBox.appendChild(intro);
    scrollChatToBottom();
  }
}

document.addEventListener("DOMContentLoaded", tutorWelcomeIfNeeded);

/* =========================
   GET OPTIONAL CONTEXT
   ========================= */
function getLearningContext() {
  return {
    course: localStorage.getItem("activeCourse") || null,
    lesson: localStorage.getItem("activeLesson") || null
  };
}

/* =========================
   AUTONOMOUS QUESTION BUILDER
   If user says nothing but selected a course,
   AI can still teach.
   ========================= */
function buildSmartQuestion(userQuestion) {
  const { course, lesson } = getLearningContext();

  if (userQuestion) return userQuestion;

  // If user uploaded image but no question
  if (lastUploadedImage) {
    return "Explain the uploaded image clearly step-by-step like a teacher.";
  }

  // If user selected course and lesson but typed nothing
  if (course && lesson) {
    return `Teach me this lesson: ${lesson}. Start from beginner level and explain step-by-step with examples and exercises.`;
  }

  // If user selected course only
  if (course && !lesson) {
    return `Teach me the course topic "${course}". Start from the basics and build gradually with examples and practice questions.`;
  }

  // fallback
  return "Teach me something valuable today in a clear step-by-step way.";
}

/* =========================
   SEND QUESTION (BEST AI TUTOR ENGINE)
   ========================= */
async function sendQuestion() {
  if (isThinking) return;

  const userQuestion = input.value.trim();
  const { course, lesson } = getLearningContext();

  // If nothing typed and no image and no context
  if (!userQuestion && !lastUploadedImage && !course) {
    alert("Type a question or select a course.");
    return;
  }

  // Show user message (if empty but image exists)
  addUserMessage(
    userQuestion || (lastUploadedImage ? "📷 Image uploaded" : "📘 Start teaching me"),
    lastUploadedImage ? [lastUploadedImage] : []
  );

  input.value = "";
  isThinking = true;
  showThinking();

  const finalQuestion = buildSmartQuestion(userQuestion);

  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        question: finalQuestion,
        course,
        lesson,
        image: lastUploadedImage || null
      })
    });

    const data = await res.json();

    removeThinking();
    isThinking = false;

    if (!res.ok) {
      await typeAIMessage(data.message || "❌ Something went wrong.");
      return;
    }

    await typeAIMessage(data.answer || "⚠️ No response generated.");

    lastUploadedImage = null;

  } catch (err) {
    removeThinking();
    isThinking = false;
    await typeAIMessage("❌ Unable to connect to WOFA AI backend. Check internet or server.");
  }
}

/* =========================
   IMAGE UPLOAD
   ========================= */
if (imageInput) {
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      lastUploadedImage = reader.result;

      addUserMessage("📷 Image uploaded successfully. Ask me to explain it.", [
        reader.result
      ]);
    };

    reader.readAsDataURL(file);
  });
}

/* =========================
   VOICE INPUT (SPEECH TO TEXT)
   ========================= */
function startVoiceInput() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice input not supported in this browser.");
    return;
  }

  const rec = new webkitSpeechRecognition();
  rec.lang = "en-US";
  rec.continuous = false;
  rec.interimResults = false;

  rec.start();

  rec.onresult = e => {
    input.value = e.results[0][0].transcript;
    sendQuestion();
  };

  rec.onerror = () => {
    alert("Voice input failed. Try again.");
  };
}

/* =========================
   ENTER KEY SEND SUPPORT
   ========================= */
if (input) {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendQuestion();
    }
  });
}

/* =========================
   CLEAR CHAT
   ========================= */
function clearChat() {
  stopSpeaking();
  lastAIMessageElement = null;
  lastUploadedImage = null;

  chatBox.innerHTML = `
    <div class="message ai">
      <strong>Chat cleared 🧹</strong><br><br>
      Ask me anything or select a course & lesson (optional).<br>
      I’m ready to teach you again 🎓
    </div>
  `;
}

/* =========================
   LOGOUT
   ========================= */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("activeCourse");
  localStorage.removeItem("activeLesson");

  window.location.href = "login.html";
}
