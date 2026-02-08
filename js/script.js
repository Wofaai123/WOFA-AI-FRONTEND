/* ==========================================================
   WOFA AI FRONTEND SCRIPT.JS (Feb 2026 - Groq Version)
   - Authentication Removed
   - Backend AI Support
   - Courses/Lessons Optional
   - Smart Tutor Mode (Kids + Adult)
   - Voice Input + Voice Output
   - Auto Speak After Typing
   - Sentence-by-sentence Reading
   - Outline-First Teaching Mode (7+ outlines required)
   - Auto Teach When Lesson Clicked
   - NO EMOJIS IN TEACHING
   ========================================================== */

/* =========================
   GLOBAL STATE
   ========================= */
let lastAIMessageElement = null;
let isThinking = false;
let autoSpeakEnabled = true;

// Speech state
let speechUtterance = null;
let speechSentences = [];
let speechIndex = 0;
let isPaused = false;

/* =========================
   DOM ELEMENTS
   ========================= */
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("questionInput");
const darkToggle = document.getElementById("darkToggle");

/* =========================
   CONFIG
   ========================= */
const API_BASE_URL =
  window.WOFA_CONFIG?.API_BASE_URL || "https://wofa-ai-backend.onrender.com/api";

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

function sanitizeHTML(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* =========================
   API POST HELPER
   ========================= */
async function apiPost(endpoint, payload) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

/* =========================
   TEXT SPLITTER (SENTENCE MODE)
   ========================= */
function splitIntoSentences(text) {
  if (!text) return [];

  const cleaned = text
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return [];

  return cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleaned];
}

/* =========================
   GET LEARNING CONTEXT
   ========================= */
function getLearningContext() {
  return {
    course: localStorage.getItem("wofaActiveCourse") || null,
    lesson: localStorage.getItem("wofaActiveLesson") || null
  };
}

/* =========================
   DETECT CHILD / MONTESSORI MODE
   ========================= */
function isKidsMode(course, lesson) {
  const text = `${course || ""} ${lesson || ""}`.toLowerCase();

  return (
    text.includes("montessori") ||
    text.includes("primary") ||
    text.includes("kids") ||
    text.includes("children") ||
    text.includes("ages 3") ||
    text.includes("ages 6") ||
    text.includes("ages 12")
  );
}

/* =========================
   OUTLINE-FIRST PROMPT BUILDER
   (NO EMOJIS)
   ========================= */
function buildOutlineFirstPrompt(userQuestion, course, lesson) {
  const kidsMode = isKidsMode(course, lesson);

  const topic = lesson || course || userQuestion || "General Topic";

  if (kidsMode) {
    return `
You are WOFA AI, a Montessori-style teacher.

TOPIC: ${topic}

RULES (VERY IMPORTANT):
1. First create at least 7 outlines (number them 1 to 7 or more).
2. After the outlines, teach EACH outline clearly one by one.
3. Use very simple English.
4. Use short sentences.
5. Use examples children understand.
6. Do NOT use emojis.
7. End with 3 simple practice questions.
8. End with encouragement.

Student Question:
${userQuestion || "Teach this topic clearly."}
    `;
  }

  return `
You are WOFA AI, a smart educational tutor.

TOPIC: ${topic}

RULES (VERY IMPORTANT):
1. Before answering, create at least 7 outlines (number them).
2. Then teach ALL outlines one by one in detail.
3. Use step-by-step teaching.
4. Use examples, analogies, and exercises.
5. Make the explanation simple but professional.
6. Do NOT use emojis.
7. End with a short summary.
8. End with 5 practice questions.

Student Question:
${userQuestion || "Teach this topic clearly."}
  `;
}

/* =========================
   ADD USER MESSAGE
   ========================= */
function addUserMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message user";
  msg.innerHTML = sanitizeHTML(text).replace(/\n/g, "<br>");

  chatBox.appendChild(msg);
  scrollChatToBottom();
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
   SPEECH ENGINE (LINE BY LINE)
   ========================= */
function stopSpeaking() {
  window.speechSynthesis.cancel();
  speechSentences = [];
  speechIndex = 0;
  isPaused = false;
}

function pauseSpeaking() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
    isPaused = true;
  }
}

function resumeSpeaking() {
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    isPaused = false;
  }
}

/* =========================
   SPEAK NEXT SENTENCE
   ========================= */
function speakNextSentence() {
  if (speechIndex >= speechSentences.length) {
    stopSpeaking();
    return;
  }

  const line = speechSentences[speechIndex].trim();
  if (!line) {
    speechIndex++;
    speakNextSentence();
    return;
  }

  speechUtterance = new SpeechSynthesisUtterance(line);
  speechUtterance.lang = "en-US";
  speechUtterance.rate = 0.95;
  speechUtterance.pitch = 1;

  speechUtterance.onend = () => {
    if (!isPaused) {
      speechIndex++;
      speakNextSentence();
    }
  };

  speechUtterance.onerror = () => {
    speechIndex++;
    speakNextSentence();
  };

  window.speechSynthesis.speak(speechUtterance);
}

/* =========================
   SPEAK LINE BY LINE (START)
   ========================= */
function speakLineByLine(text) {
  stopSpeaking();

  speechSentences = splitIntoSentences(text);
  speechIndex = 0;
  isPaused = false;

  speakNextSentence();
}

/* =========================
   READ LAST ANSWER
   ========================= */
function readLastAnswer() {
  if (!lastAIMessageElement) {
    alert("No AI answer yet.");
    return;
  }

  const cleanText = lastAIMessageElement.innerText
    .replace("Listen", "")
    .trim();

  speakLineByLine(cleanText);
}

/* =========================
   AI MESSAGE (TYPING EFFECT)
   ========================= */
async function typeAIMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message ai";
  chatBox.appendChild(msg);

  const safeText = sanitizeHTML(text);

  let i = 0;
  const speed = 10;

  while (i < safeText.length) {
    msg.innerHTML = safeText.slice(0, i).replace(/\n/g, "<br>");
    i++;
    scrollChatToBottom();
    await sleep(speed);
  }

  lastAIMessageElement = msg;

  const speakBtn = document.createElement("button");
  speakBtn.className = "speak-btn";
  speakBtn.textContent = "Listen";
  speakBtn.onclick = readLastAnswer;

  msg.appendChild(speakBtn);
  scrollChatToBottom();

  if (autoSpeakEnabled) {
    const cleanText = msg.innerText.replace("Listen", "").trim();
    speakLineByLine(cleanText);
  }
}

/* =========================
   VOICE INPUT (SPEECH TO TEXT)
   ========================= */
function startVoiceInput() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice input is not supported in this browser.");
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
   SEND QUESTION TO BACKEND
   ========================= */
async function sendQuestion(forceAutoTeach = false) {
  if (isThinking) return;

  const userQuestion = input.value.trim();
  const { course, lesson } = getLearningContext();

  if (!userQuestion && !course && !lesson) {
    alert("Type a question or select a course/lesson.");
    return;
  }

  if (!userQuestion && forceAutoTeach) {
    addUserMessage(`Start teaching: ${lesson || course}`);
  } else {
    addUserMessage(userQuestion || "Start teaching");
  }

  input.value = "";
  isThinking = true;
  showThinking();

  const finalPrompt = buildOutlineFirstPrompt(userQuestion, course, lesson);

  try {
    const data = await apiPost("/chat", {
      question: finalPrompt,
      course,
      lesson
    });

    removeThinking();
    isThinking = false;

    await typeAIMessage(data.answer || "No response generated.");

  } catch (err) {
    removeThinking();
    isThinking = false;

    await typeAIMessage(
      "WOFA AI cannot respond right now. Please check your internet or backend server."
    );
  }
}

/* =========================
   AUTO TEACH WHEN LESSON CLICKED
   ========================= */
window.autoTeachLesson = function(courseTitle, lessonTitle) {
  localStorage.setItem("wofaActiveCourse", courseTitle || "");
  localStorage.setItem("wofaActiveLesson", lessonTitle || "");

  sendQuestion(true);
};

/* =========================
   ENTER KEY SUPPORT
   ========================= */
if (input) {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendQuestion(false);
    }
  });
}

/* =========================
   CLEAR CHAT
   ========================= */
function clearChat() {
  stopSpeaking();
  lastAIMessageElement = null;

  chatBox.innerHTML = `
    <div class="message ai">
      <strong>Chat cleared</strong><br><br>
      Ask any question or select a course and lesson.<br>
      I am ready to teach again.
    </div>
  `;
}

/* =========================
   WELCOME MESSAGE
   ========================= */
function tutorWelcomeIfNeeded() {
  const alreadyWelcomed = localStorage.getItem("welcomed");

  if (!alreadyWelcomed) {
    localStorage.setItem("welcomed", "true");

    const intro = document.createElement("div");
    intro.className = "message ai";
    intro.innerHTML = `
      <strong>Welcome to WOFA AI</strong><br><br>
      I can teach you from Montessori to University and beyond.<br><br>
      Select a course and lesson to begin automatic teaching.<br>
      Or type a question and press Enter.
    `;

    chatBox.appendChild(intro);
    scrollChatToBottom();
  }
}

document.addEventListener("DOMContentLoaded", tutorWelcomeIfNeeded);
