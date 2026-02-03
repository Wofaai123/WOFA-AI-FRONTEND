/* =========================
   AUTH GUARD (RUN FIRST)
   ========================= */
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

/* =========================
   GLOBAL STATE
   ========================= */
let lastAIMessageElement = null; // 🔑 single source of truth
let lastUploadedImage = null;
let speechUtterance = null;

/* =========================
   DOM ELEMENTS (SAFE)
   ========================= */
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("questionInput");
const imageInput = document.getElementById("imageInput");
const learningContext = document.getElementById("learningContext");
const darkToggle = document.getElementById("darkToggle");
const talkBtn = document.getElementById("talkBtn");

if (!chatBox || !input) {
  console.warn("Chat UI not found on this page.");
}

/* =========================
   LESSON CONTEXT
   ========================= */
const activeLessonId = localStorage.getItem("activeLessonId");
if (learningContext && activeLessonId) {
  learningContext.innerText = "📘 You are studying a lesson";
}

/* =========================
   DARK MODE
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
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
})();

if (darkToggle) {
  darkToggle.onclick = toggleDarkMode;
}

/* =========================
   UTIL
   ========================= */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* =========================
   VOICE OUTPUT (TALK + LISTEN)
   ========================= */
function speakText(text) {
  if (!text) {
    alert("No AI answer to read yet.");
    return;
  }

  window.speechSynthesis.cancel();

  speechUtterance = new SpeechSynthesisUtterance(text);
  speechUtterance.lang = "en-US";
  speechUtterance.rate = 0.95;
  speechUtterance.pitch = 1;

  window.speechSynthesis.speak(speechUtterance);
}

/* 🔊 TALK BUTTON — SAME ENGINE AS LISTEN */
function readLastAnswer() {
  if (!lastAIMessageElement) {
    alert("No AI answer to read yet.");
    return;
  }

  const text = lastAIMessageElement.innerText
    .replace("🔊 Listen", "")
    .trim();

  speakText(text);
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
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeThinking() {
  const thinking = document.getElementById("thinking-indicator");
  if (thinking) thinking.remove();
}

/* =========================
   ADD USER MESSAGE
   ========================= */
function addUserMessage(text, images = []) {
  const msg = document.createElement("div");
  msg.className = "message user";
  msg.innerHTML = text.replace(/\n/g, "<br>");

  images.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    msg.appendChild(img);
  });

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* =========================
   TYPE AI MESSAGE (REALISTIC)
   ========================= */
async function typeAIMessage(text, images = []) {
  const msg = document.createElement("div");
  msg.className = "message ai";
  chatBox.appendChild(msg);

  let i = 0;
  const speed = 12;

  while (i < text.length) {
    msg.innerHTML = text.slice(0, i).replace(/\n/g, "<br>");
    i++;
    chatBox.scrollTop = chatBox.scrollHeight;
    await sleep(speed);
  }

  images.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    msg.appendChild(img);
  });

  // 🔑 SAVE LAST AI MESSAGE
  lastAIMessageElement = msg;

  // Enable Talk button
  if (talkBtn) {
    talkBtn.disabled = false;
  }

  // 🔊 INLINE LISTEN BUTTON (same source as Talk)
  const speakBtn = document.createElement("button");
  speakBtn.textContent = "🔊 Listen";
  speakBtn.className = "speak-btn";
  speakBtn.onclick = readLastAnswer;
  msg.appendChild(speakBtn);
}

/* =========================
   SEND QUESTION
   ========================= */
async function sendQuestion() {
  const question = input.value.trim();
  if (!question && !lastUploadedImage) return;

  addUserMessage(
    question || "📷 Image uploaded",
    lastUploadedImage ? [lastUploadedImage] : []
  );

  input.value = "";
  showThinking();

  try {
    const res = await fetch(
      "https://wofa-ai-backend.onrender.com/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          question: question || "Explain the uploaded image",
          image: lastUploadedImage,
          lessonId: activeLessonId
        })
      }
    );

    const data = await res.json();
    await sleep(500);

    removeThinking();
    await typeAIMessage(data.answer, data.images || []);

    lastUploadedImage = null;

  } catch (err) {
    removeThinking();
    await typeAIMessage("❌ Unable to connect to WOFA AI.");
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
      addUserMessage(
        "📷 Image uploaded. Ask me to explain it.",
        [reader.result]
      );
    };
    reader.readAsDataURL(file);
  });
}

/* =========================
   VOICE INPUT (SPEECH → TEXT)
   ========================= */
function startVoiceInput() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice input not supported in this browser.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.start();

  recognition.onresult = e => {
    input.value = e.results[0][0].transcript;
    sendQuestion();
  };

  recognition.onerror = () => {
    alert("Voice input failed. Try again.");
  };
}

/* =========================
   CLEAR CHAT
   ========================= */
function clearChat() {
  stopSpeaking();
  lastAIMessageElement = null;
  lastUploadedImage = null;

  if (talkBtn) {
    talkBtn.disabled = true;
  }

  chatBox.innerHTML = `
    <div class="message ai">
      Hello 👋 I’m <b>WOFA AI</b>.<br>
      Ask a question, speak, or upload an image.
    </div>
  `;
}

/* =========================
   LOGOUT (NAV)
   ========================= */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("activeLessonId");
  window.location.href = "login.html";
}
