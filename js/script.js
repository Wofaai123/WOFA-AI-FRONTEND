/* =====================================================
   WOFA AI — FRONTEND CHAT CONTROLLER (PRODUCTION)
   ===================================================== */

/* =========================
   CONFIG
   ========================= */
const API_BASE_URL = window.WOFA_CONFIG?.API_BASE_URL;

/* =========================
   AUTH GUARD
   ========================= */
const authToken = localStorage.getItem("token");
if (!authToken) {
  window.location.replace("login.html");
}

/* =========================
   GLOBAL STATE
   ========================= */
let isSending = false;
let lastAIMessage = "";
let speechInstance = null;
let uploadedImageBase64 = null;

/* =========================
   DOM REFERENCES
   ========================= */
const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");
const questionInput = document.getElementById("questionInput");
const imageInput = document.getElementById("imageInput");
const loadingIndicator = document.getElementById("loadingIndicator");
const logoutBtn = document.getElementById("logoutBtn");
const speakBtn = document.getElementById("speakBtn");
const clearBtn = document.getElementById("clearBtn");
const themeToggle = document.getElementById("themeToggle");

/* =========================
   THEME HANDLING
   ========================= */
(function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") document.body.classList.add("dark");
})();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  });
}

/* =========================
   UI HELPERS
   ========================= */
function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showLoading(state) {
  loadingIndicator.classList.toggle("hidden", !state);
}

/* =========================
   MESSAGE RENDERERS
   ========================= */
function renderUserMessage(text, image = null) {
  const div = document.createElement("div");
  div.className = "message user";
  div.innerHTML = text.replace(/\n/g, "<br>");

  if (image) {
    const img = document.createElement("img");
    img.src = image;
    img.alt = "Uploaded image";
    div.appendChild(img);
  }

  chatBox.appendChild(div);
  scrollToBottom();
}

function renderAIMessage(text) {
  const div = document.createElement("div");
  div.className = "message ai";
  div.innerHTML = text.replace(/\n/g, "<br>");

  chatBox.appendChild(div);
  scrollToBottom();

  lastAIMessage = text;
}

/* =========================
   API CALL (CHATGPT)
   ========================= */
async function sendChatRequest(payload) {
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    if (res.status === 401) {
      logout();
    }
    throw new Error("API request failed");
  }

  return res.json();
}

/* =========================
   SEND MESSAGE
   ========================= */
async function handleSendMessage() {
  if (isSending) return;

  const question = questionInput.value.trim();
  if (!question && !uploadedImageBase64) return;

  isSending = true;
  showLoading(true);

  renderUserMessage(
    question || "📷 Image sent",
    uploadedImageBase64
  );

  questionInput.value = "";

  try {
    const response = await sendChatRequest({
      question: question || null,
      image: uploadedImageBase64 || null,
      course: localStorage.getItem("activeCourse"),
      lesson: localStorage.getItem("activeLesson")
    });

    renderAIMessage(response.answer || "No answer generated.");
    uploadedImageBase64 = null;

  } catch (err) {
    renderAIMessage("❌ Unable to reach WOFA AI at the moment.");
  }

  showLoading(false);
  isSending = false;
}

/* =========================
   FORM SUBMIT
   ========================= */
if (chatForm) {
  chatForm.addEventListener("submit", e => {
    e.preventDefault();
    handleSendMessage();
  });
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
      uploadedImageBase64 = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* =========================
   VOICE INPUT
   ========================= */
function startVoiceInput() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice input not supported in this browser.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = e => {
    questionInput.value = e.results[0][0].transcript;
    handleSendMessage();
  };
}

document.getElementById("voiceBtn")?.addEventListener("click", startVoiceInput);

/* =========================
   TEXT TO SPEECH
   ========================= */
function speakLastAnswer() {
  if (!lastAIMessage) return;

  window.speechSynthesis.cancel();
  speechInstance = new SpeechSynthesisUtterance(lastAIMessage);
  speechInstance.lang = "en-US";
  speechInstance.rate = 0.95;

  window.speechSynthesis.speak(speechInstance);
}

speakBtn?.addEventListener("click", speakLastAnswer);

/* =========================
   CLEAR CHAT
   ========================= */
clearBtn?.addEventListener("click", () => {
  window.speechSynthesis.cancel();
  lastAIMessage = "";
  uploadedImageBase64 = null;

  chatBox.innerHTML = `
    <div class="message ai">
      <strong>Hello 👋 I’m WOFA AI</strong><br>
      Ask me anything or choose a lesson.
    </div>
  `;
});

/* =========================
   LOGOUT
   ========================= */
function logout() {
  localStorage.clear();
  window.location.replace("login.html");
}

logoutBtn?.addEventListener("click", logout);
