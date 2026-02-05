// js/learningPanel.js - Modern Clickable Courses & Lessons (Feb 2026)
// African-focused + Theology (Christian & Islamic separated) + ICT, Computer Science, Coding, Robotics

document.addEventListener("DOMContentLoaded", () => {
  const coursesList = document.getElementById("coursesList");
  const chatBox = document.getElementById("chatBox");
  const questionInput = document.getElementById("questionInput");

  // Early exit if critical element missing
  if (!coursesList) {
    console.error("coursesList element not found in DOM");
    return;
  }

  // ───────────────────────────────────────────────
  // COURSE & LESSON DATA (organized, African-centric)
  // ───────────────────────────────────────────────
  const coursesData = [
    {
      id: "theology-christian",
      title: "Theology – Christian Studies",
      lessons: [
        { id: "act101", title: "Biblical Interpretation in African Cultures" },
        { id: "act102", title: "Liberation Theology (Post-Colonial Africa)" },
        { id: "act103", title: "African Church History" },
        { id: "act104", title: "Contextual Christian Ethics in Africa" },
        { id: "act105", title: "Missions and Evangelism in African Contexts" },
        { id: "act106", title: "Prophecy and African Prophets" },
        { id: "act107", title: "Poverty, Justice & Biblical Themes" },
        { id: "act108", title: "Church Leadership & Administration in Africa" },
      ],
    },
    {
      id: "theology-islamic",
      title: "Theology – Islamic Studies",
      lessons: [
        { id: "isa101", title: "Spread of Islam in Africa (Historical)" },
        { id: "isa102", title: "Sufism and Spiritual Traditions in West Africa" },
        { id: "isa103", title: "Sharia Application in African Societies" },
        { id: "isa104", title: "Contemporary Muslim Issues in Africa" },
        { id: "isa105", title: "Interfaith Dialogue: Christian-Muslim Relations" },
        { id: "isa106", title: "Islamic Ethics and Social Justice" },
      ],
    },
    {
      id: "african-spirituality",
      title: "African Indigenous Spirituality & Interfaith",
      lessons: [
        { id: "ais101", title: "Traditional African Religions & Cosmology" },
        { id: "ais102", title: "Ancestor Veneration & Rituals" },
        { id: "ais103", title: "Syncretism: Christianity, Islam & Indigenous Faiths" },
        { id: "ais104", title: "Spirituality, Environment & Sustainability" },
        { id: "ais105", title: "Peacebuilding Through Interfaith Dialogue" },
      ],
    },
    {
      id: "bba",
      title: "Bachelor of Business Administration (BBA)",
      lessons: [
        { id: "bba101", title: "Introduction to Business" },
        { id: "bba102", title: "Principles of Management" },
        { id: "bba103", title: "Financial Accounting" },
        { id: "bba104", title: "Business Mathematics" },
      ],
    },
    {
      id: "african-entrepreneurship",
      title: "African Entrepreneurship & Innovation",
      lessons: [
        { id: "aei101", title: "Startup Ecosystems in Africa" },
        { id: "aei102", title: "Fintech and Mobile Money" },
        { id: "aei103", title: "Agribusiness & Value Chains" },
        { id: "aei104", title: "Women in African Business Leadership" },
        { id: "aei105", title: "Scaling Ventures in Emerging Markets" },
      ],
    },
    {
      id: "ict",
      title: "Information & Communication Technology (ICT)",
      lessons: [
        { id: "ict101", title: "Computer Fundamentals & Digital Literacy" },
        { id: "ict102", title: "Networking & Internet Technologies" },
        { id: "ict103", title: "Database Management Systems" },
        { id: "ict104", title: "Cybersecurity Basics" },
        { id: "ict105", title: "Cloud Computing & Virtualization" },
      ],
    },
    // ───────────────────────────────────────────────
// BUSINESS & PRACTICAL ECONOMICS (GHANA + GLOBAL)
// ───────────────────────────────────────────────
{
  id: "business-communication",
  title: "Business Communication",
  lessons: [
    { id: "bc101", title: "Introduction to Business Communication" },
    { id: "bc102", title: "Formal Letters and Email Writing" },
    { id: "bc103", title: "Business Report Writing" },
    { id: "bc104", title: "Presentation Skills and Public Speaking" },
    { id: "bc105", title: "Negotiation and Conflict Resolution" },
    { id: "bc106", title: "Professional Communication Etiquette" },
  ],
},

{
  id: "entrepreneurship",
  title: "Entrepreneurship",
  lessons: [
    { id: "ent101", title: "What is Entrepreneurship?" },
    { id: "ent102", title: "Business Ideas and Opportunity Identification" },
    { id: "ent103", title: "Business Plan Writing" },
    { id: "ent104", title: "Startup Funding in Ghana" },
    { id: "ent105", title: "Marketing Strategies for Small Businesses" },
    { id: "ent106", title: "Customer Service and Business Growth" },
    { id: "ent107", title: "Managing Risk in Business" },
  ],
},

{
  id: "ghana-law-constitution",
  title: "Ghana Law & Constitution",
  lessons: [
    { id: "glc101", title: "Introduction to Ghana’s Legal System" },
    { id: "glc102", title: "The 1992 Constitution Explained" },
    { id: "glc103", title: "Fundamental Human Rights in Ghana" },
    { id: "glc104", title: "Branches of Government (Executive, Legislature, Judiciary)" },
    { id: "glc105", title: "Citizenship and National Duties" },
    { id: "glc106", title: "Rule of Law and Democracy in Ghana" },
    { id: "glc107", title: "Key Constitutional Bodies in Ghana" },
  ],
},

{
  id: "procurement",
  title: "Procurement & Supply Chain",
  lessons: [
    { id: "pro101", title: "Introduction to Procurement" },
    { id: "pro102", title: "Procurement Cycle and Procedures" },
    { id: "pro103", title: "Public Procurement Law in Ghana (Act 663 & Amendments)" },
    { id: "pro104", title: "Tendering, Bidding and Contract Award" },
    { id: "pro105", title: "Supplier Evaluation and Vendor Management" },
    { id: "pro106", title: "Ethics in Procurement" },
    { id: "pro107", title: "Logistics and Inventory Management" },
  ],
},

{
  id: "demand-supply",
  title: "Demand & Supply (Economics)",
  lessons: [
    { id: "ds101", title: "Introduction to Demand and Supply" },
    { id: "ds102", title: "Law of Demand and Demand Curve" },
    { id: "ds103", title: "Law of Supply and Supply Curve" },
    { id: "ds104", title: "Market Equilibrium" },
    { id: "ds105", title: "Factors Affecting Demand and Supply" },
    { id: "ds106", title: "Price Elasticity of Demand and Supply" },
    { id: "ds107", title: "Practical Market Examples in Ghana" },
  ],
},

{
  id: "practical-business",
  title: "Practical Business (Real-Life Skills)",
  lessons: [
    { id: "pb101", title: "Starting a Small Business in Ghana" },
    { id: "pb102", title: "How to Register a Business (GRA, Registrar General, SSNIT)" },
    { id: "pb103", title: "Pricing Strategy and Profit Calculation" },
    { id: "pb104", title: "Basic Accounting for Small Businesses" },
    { id: "pb105", title: "Sales and Customer Relationship Management" },
    { id: "pb106", title: "How to Advertise Online (WhatsApp, Facebook, Instagram)" },
    { id: "pb107", title: "Business Risk and Fraud Prevention" },
    { id: "pb108", title: "Managing Employees and Workplace Discipline" },
  ],
},

    {
      id: "computer-science",
      title: "Computer Science Fundamentals",
      lessons: [
        { id: "cs101", title: "Introduction to Programming Concepts" },
        { id: "cs102", title: "Data Structures & Algorithms" },
        { id: "cs103", title: "Operating Systems & Architecture" },
        { id: "cs104", title: "Software Engineering Principles" },
        { id: "cs105", title: "Artificial Intelligence & Machine Learning Intro" },
      ],
    },
    {
      id: "coding",
      title: "Coding & Programming",
      lessons: [
        { id: "cod101", title: "Python for Beginners" },
        { id: "cod102", title: "JavaScript & Web Development" },
        { id: "cod103", title: "Java Programming" },
        { id: "cod104", title: "Mobile App Development (Flutter/React Native)" },
        { id: "cod105", title: "Full-Stack Development Project" },
      ],
    },
    {
      id: "robotics",
      title: "Robotics Program with Basic Sciences",
      lessons: [
        { id: "rob-montessori", title: "Montessori Level: Sensory Robotics & Basic Physics (Ages 3–6)" },
        { id: "rob-primary", title: "Primary Level: Simple Machines, Logic & Intro Coding (Ages 6–12)" },
        { id: "rob-secondary", title: "Secondary Level: Electronics, Sensors, Arduino & Chemistry Basics (Ages 12–18)" },
        { id: "rob-university", title: "University Level: AI Robotics, Automation, Advanced Physics & Engineering" },
      ],
    },
    {
      id: "african-history-dev",
      title: "African History & Development",
      lessons: [
        { id: "ahd101", title: "Pre-Colonial African Societies" },
        { id: "ahd102", title: "Colonialism & Its Lasting Impact" },
        { id: "ahd103", title: "Pan-Africanism & Independence Movements" },
        { id: "ahd104", title: "Modern African Political Economy" },
      ],
    },
    {
      id: "public-health-africa",
      title: "Public Health in Africa",
      lessons: [
        { id: "pha101", title: "Tropical Diseases & Epidemiology" },
        { id: "pha102", title: "HIV/AIDS & Infectious Disease Control" },
        { id: "pha103", title: "Maternal & Child Health in Africa" },
        { id: "pha104", title: "Health Systems Strengthening" },
      ],
    },
    {
      id: "sustainable-dev-africa",
      title: "Sustainable Development in Africa",
      lessons: [
        { id: "sda101", title: "SDGs Localization in Africa" },
        { id: "sda102", title: "Climate Resilience & Adaptation" },
        { id: "sda103", title: "Renewable Energy Solutions" },
        { id: "sda104", title: "Food Security & Agriculture" },
      ],
    },
  ];

  /* ───────────────────────────────────────────────
     HELPERS
     ─────────────────────────────────────────────── */
  const scrollChatToBottom = () => {
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  };

  const clearActiveHighlights = (selector) => {
    document.querySelectorAll(selector).forEach(el => el.classList.remove("active"));
  };

  const saveSelection = (courseId, lessonId) => {
    localStorage.setItem("wofaActiveCourse", courseId);
    localStorage.setItem("wofaActiveLesson", lessonId);
  };

  /* ───────────────────────────────────────────────
     LOAD LESSON CONTENT (called when lesson clicked)
     ─────────────────────────────────────────────── */
  const loadLessonContent = (courseId, lessonId) => {
    if (!chatBox) return;

    const selectedCourse = coursesData.find(c => c.id === courseId);
    const selectedLesson = selectedCourse?.lessons.find(l => l.id === lessonId);

    if (!selectedCourse || !selectedLesson) {
      console.warn("Course or lesson not found:", courseId, lessonId);
      return;
    }

    // Save selection for next visit
    saveSelection(courseId, lessonId);

    // Add message to chat
    const message = document.createElement("div");
    message.className = "message ai";
    message.innerHTML = `
      <strong>Selected Lesson:</strong><br>
      <b>Course:</b> ${selectedCourse.title}<br>
      <b>Lesson:</b> ${selectedLesson.title}<br><br>
      I'm ready to help you learn this topic.<br>
      <em>Ask any question about it now!</em>
    `;

    chatBox.appendChild(message);
    scrollChatToBottom();

    // Auto-focus input
    questionInput?.focus();
  };

  /* ───────────────────────────────────────────────
     RESTORE LAST SELECTION (on page load)
     ─────────────────────────────────────────────── */
  const restoreLastSelection = () => {
    const savedCourse = localStorage.getItem("wofaActiveCourse");
    const savedLesson = localStorage.getItem("wofaActiveLesson");

    if (savedCourse && savedLesson) {
      loadLessonContent(savedCourse, savedLesson);
    }
  };

  /* ───────────────────────────────────────────────
     RENDER ALL COURSES & LESSONS
     ─────────────────────────────────────────────── */
  const renderCourses = () => {
    coursesList.innerHTML = "";

    coursesData.forEach(course => {
      // Course element
      const courseLi = document.createElement("li");
      courseLi.className = "course-item";
      courseLi.textContent = course.title;
      courseLi.dataset.courseId = course.id;
      courseLi.setAttribute("role", "button");
      courseLi.setAttribute("tabindex", "0");
      courseLi.setAttribute("aria-expanded", "false");

      // Toggle lessons on click (mouse + keyboard)
      const toggleLessons = () => {
        clearActiveHighlights(".course-item");
        courseLi.classList.add("active");
        courseLi.setAttribute("aria-expanded", "true");

        let lessonUl = courseLi.nextElementSibling;
        if (lessonUl && lessonUl.classList.contains("lesson-list")) {
          const isOpen = lessonUl.classList.toggle("open");
          courseLi.setAttribute("aria-expanded", isOpen);
          return;
        }

        // Create lessons list
        lessonUl = document.createElement("ul");
        lessonUl.className = "lesson-list open";
        courseLi.insertAdjacentElement("afterend", lessonUl);

        course.lessons.forEach(lesson => {
          const lessonLi = document.createElement("li");
          lessonLi.className = "lesson-item";
          lessonLi.textContent = lesson.title;
          lessonLi.dataset.lessonId = lesson.id;
          lessonLi.dataset.courseId = course.id;
          lessonLi.setAttribute("role", "button");
          lessonLi.setAttribute("tabindex", "0");

          lessonLi.addEventListener("click", (e) => {
            e.stopPropagation();
            clearActiveHighlights(".lesson-item");
            lessonLi.classList.add("active");
            loadLessonContent(course.id, lesson.id);
          });

          // Keyboard support
          lessonLi.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              lessonLi.click();
            }
          });

          lessonUl.appendChild(lessonLi);
        });
      };

      courseLi.addEventListener("click", toggleLessons);
      courseLi.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleLessons();
        }
      });

      coursesList.appendChild(courseLi);
    });
  };

  // Initialize
  renderCourses();
  restoreLastSelection();
});