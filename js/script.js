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
let lastAIMessageElement = null;
let lastUploadedImage = null;
let speechUtterance = null;

/* =========================
   DOM ELEMENTS
   ========================= */
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("questionInput");
const imageInput = document.getElementById("imageInput");
const darkToggle = document.getElementById("darkToggle");
const talkBtn = document.getElementById("talkBtn");

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
    msg.appendChild(img);
  });

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* =========================
   TYPE AI MESSAGE
   ========================= */
async function typeAIMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message ai";
  chatBox.appendChild(msg);

  let i = 0;
  while (i < text.length) {
    msg.innerHTML = text.slice(0, i);
    i++;
    await sleep(12);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  lastAIMessageElement = msg;

  if (talkBtn) talkBtn.disabled = false;

  const speakBtn = document.createElement("button");
  speakBtn.className = "speak-btn";
  speakBtn.textContent = "🔊 Listen";
  speakBtn.onclick = readLastAnswer;
  msg.appendChild(speakBtn);
}

/* =========================
   SEND QUESTION (GPT LESSON ENGINE)
   ========================= */
async function sendQuestion() {
  const question = input.value.trim();
  const course = localStorage.getItem("activeCourse");
  const lesson = localStorage.getItem("activeLesson");

  if (!course || !lesson) {
    alert("Please select a course and lesson first.");
    return;
  }

  if (!question && !lastUploadedImage) {
    alert("Type a question or upload an image.");
    return;
  }

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
          question: question || null,
          course,
          lesson
        })
      }
    );

    const data = await res.json();
    removeThinking();
    await typeAIMessage(data.answer || "No response generated.");

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
      addUserMessage("📷 Image uploaded", [reader.result]);
    };
    reader.readAsDataURL(file);
  });
}

/* =========================
   VOICE INPUT
   ========================= */
function startVoiceInput() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice input not supported.");
    return;
  }

  const rec = new webkitSpeechRecognition();
  rec.lang = "en-US";
  rec.start();

  rec.onresult = e => {
    input.value = e.results[0][0].transcript;
    sendQuestion();
  };
}

/* =========================
   CLEAR CHAT
   ========================= */
function clearChat() {
  stopSpeaking();
  lastAIMessageElement = null;
  lastUploadedImage = null;
  if (talkBtn) talkBtn.disabled = true;

  chatBox.innerHTML = `
    <div class="message ai">
      Hello 👋 I’m <b>WOFA AI</b>.<br>
      Select a course and lesson to begin.
    </div>
  `;
}

/* =========================
   LOGOUT
   ========================= */
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
