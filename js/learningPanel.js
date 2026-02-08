// js/learningPanel.js - WOFA AI Courses & Lessons Panel (Clean Version Feb 2026)
// Works fully without MongoDB
// Saves selected Course + Lesson titles for AI context (Groq / OpenAI / Any Backend)

document.addEventListener("DOMContentLoaded", () => {
  const coursesList = document.getElementById("coursesList");
  const chatBox = document.getElementById("chatBox");
  const questionInput = document.getElementById("questionInput");

  if (!coursesList) {
    console.error("WOFA AI Error: coursesList element not found.");
    return;
  }

  /* ───────────────────────────────────────────────
     COURSE & LESSON DATA (DO NOT CHANGE)
     ─────────────────────────────────────────────── */
  const coursesData = [
    {
      id: "bba",
      title: "Bachelor of Business Administration (BBA)",
      lessons: [
        { id: "bba101", title: "Introduction to Business" },
        { id: "bba102", title: "Principles of Management" },
        { id: "bba103", title: "Financial Accounting" },
        { id: "bba104", title: "Business Mathematics" }
      ]
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
        { id: "ent107", title: "Managing Risk in Business" }
          ]
    },
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
        { id: "act108", title: "Church Leadership & Administration in Africa" }
      ]
  },
  {
  id: "prophetic-work",
  title: "Prophetic Work & Spiritual Authority",
  lessons: [
    { id: "pw101", title: "The Seven Spirits of God (Isaiah 11:2)" },
    { id: "pw102", title: "Ways to Hear the Voice of God" },
    { id: "pw103", title: "Power (Dunamis) and Spiritual Strength" },
    { id: "pw104", title: "Meditation and Spiritual Sensitivity" },
    { id: "pw105", title: "Tithes, Offerings, and Sacrifices" },
    { id: "pw106", title: "Healing Ministry and Divine Health" },
    { id: "pw107", title: "Deliverance (Exorcism) and Spiritual Warfare" },
    { id: "pw108", title: "The Fivefold Ministries (Ephesians 4:11)" },
    { id: "pw109", title: "Prophetic Prayer and Intercession" }

      ]
    },
    {
      id: "entrepreneurship",
      title: "African Entrepreneurship & Innovation",
      lessons: [
        { id: "aei101", title: "Startup Ecosystems in Africa" },
        { id: "aei102", title: "Fintech and Mobile Money" },
        { id: "aei103", title: "Agribusiness & Value Chains" },
        { id: "aei104", title: "Women in African Business Leadership" },
        { id: "aei105", title: "Scaling Ventures in Emerging Markets" }
      ]
    },
    {
      id: "ict",
      title: "Information & Communication Technology (ICT)",
      lessons: [
        { id: "ict101", title: "Computer Fundamentals & Digital Literacy" },
        { id: "ict102", title: "Networking & Internet Technologies" },
        { id: "ict103", title: "Database Management Systems" },
        { id: "ict104", title: "Cybersecurity Basics" },
        { id: "ict105", title: "Cloud Computing & Virtualization" }
      ]
    },

     {
  id: "montessori",
  title: "Montessori Education (Ages 2–6)",
  lessons: [
    { id: "mon101", title: "Introduction to Montessori Learning" },
    { id: "mon102", title: "Practical Life Activities (Daily Skills)" },
    { id: "mon103", title: "Sensorial Activities (Learning Through Senses)" },
    { id: "mon104", title: "Montessori Numbers & Counting" },
    { id: "mon105", title: "Montessori Alphabet & Phonics" },
    { id: "mon106", title: "Montessori Storytelling and Language Development" },
    { id: "mon107", title: "Shapes, Colors, and Patterns" },
    { id: "mon108", title: "Montessori Classroom Rules & Discipline" },
    { id: "mon109", title: "Early Writing Skills (Tracing & Pencil Control)" },
    { id: "mon110", title: "Montessori Science: Plants, Animals & Nature" },
  ],
},

{
  id: "primary-education-international",
  title: "Primary Education (International Standard)",
  lessons: [
    { id: "pri101", title: "English Grammar Basics (Nouns, Verbs, Adjectives)" },
    { id: "pri102", title: "Reading Comprehension and Story Analysis" },
    { id: "pri103", title: "Creative Writing (Paragraph Writing)" },
    { id: "pri104", title: "Mathematics: Addition, Subtraction, Multiplication, Division" },
    { id: "pri105", title: "Fractions and Decimals for Primary Level" },
    { id: "pri106", title: "Basic Science: Human Body and Health" },
    { id: "pri107", title: "Basic Science: Plants and Animals" },
    { id: "pri108", title: "Social Studies: Community and Citizenship" },
    { id: "pri109", title: "Geography: Continents, Oceans and Maps" },
    { id: "pri110", title: "ICT for Kids: Computer Basics and Typing Skills" },
    { id: "pri111", title: "Moral Education and Good Behaviour" },
    { id: "pri112", title: "Creative Arts: Drawing, Coloring and Craftwork" },
  ],
},

{
  id: "secondary-education-africa",
  title: "Secondary School Education (Africa - WAEC/BECE/SHS)",
  lessons: [
    { id: "sec101", title: "English Language: Grammar, Comprehension & Essay Writing" },
    { id: "sec102", title: "Mathematics: Algebra, Geometry & Statistics" },
    { id: "sec103", title: "Integrated Science: Biology, Chemistry & Physics Basics" },
    { id: "sec104", title: "Social Studies: Governance, Culture & Development" },
    { id: "sec105", title: "ICT: Microsoft Office, Internet, and Digital Literacy" },
    { id: "sec106", title: "Economics: Demand & Supply, Inflation and GDP" },
    { id: "sec107", title: "Government: Constitution and Political Systems" },
    { id: "sec108", title: "History: African Civilizations and Colonialism" },
    { id: "sec109", title: "Elective Mathematics: Trigonometry and Calculus Intro" },
    { id: "sec110", title: "Biology: Cells, Reproduction and Ecology" },
    { id: "sec111", title: "Chemistry: Periodic Table and Chemical Reactions" },
    { id: "sec112", title: "Physics: Motion, Energy and Electricity" },
    { id: "sec113", title: "Literature: Poetry, Drama and Prose Analysis" },
    { id: "sec114", title: "Business Management: Entrepreneurship and Accounting Basics" },
  ],
},

{
  id: "ashanti-empire",
  title: "The Ashanti Empire (Ghana History & Civilization)",
  lessons: [
    { id: "ash101", title: "Origins of the Ashanti Kingdom" },
    { id: "ash102", title: "The Golden Stool and Ashanti Spiritual Beliefs" },
    { id: "ash103", title: "Osei Tutu and the Formation of the Empire" },
    { id: "ash104", title: "Komfo Anokye and Religious Authority" },
    { id: "ash105", title: "Ashanti Political System and Governance" },
    { id: "ash106", title: "Ashanti Military Power and Wars" },
    { id: "ash107", title: "Ashanti Economy: Trade, Gold and Markets" },
    { id: "ash108", title: "Ashanti Culture: Festivals, Language and Traditions" },
    { id: "ash109", title: "Ashanti and European Contact (British & Dutch)" },
    { id: "ash110", title: "The Anglo-Ashanti Wars Explained" },
    { id: "ash111", title: "Yaa Asantewaa and the War of 1900" },
    { id: "ash112", title: "Decline of the Ashanti Empire and Colonial Rule" },
    { id: "ash113", title: "Modern Ashanti Influence in Ghana Today" },
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
        { id: "bc106", title: "Professional Communication Etiquette" }
      ]
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
        { id: "glc107", title: "Key Constitutional Bodies in Ghana" }
      ]
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
        { id: "pro107", title: "Logistics and Inventory Management" }
      ]
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
        { id: "ds107", title: "Practical Market Examples in Ghana" }
      ]
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
        { id: "pb108", title: "Managing Employees and Workplace Discipline" }
      ]
    },
    {
      id: "computer-science",
      title: "Computer Science Fundamentals",
      lessons: [
        { id: "cs101", title: "Introduction to Programming Concepts" },
        { id: "cs102", title: "Data Structures & Algorithms" },
        { id: "cs103", title: "Operating Systems & Architecture" },
        { id: "cs104", title: "Software Engineering Principles" },
        { id: "cs105", title: "Artificial Intelligence & Machine Learning Intro" }
      ]
    },
    {
      id: "coding",
      title: "Coding & Programming",
      lessons: [
        { id: "cod101", title: "Python for Beginners" },
        { id: "cod102", title: "JavaScript & Web Development" },
        { id: "cod103", title: "Java Programming" },
        { id: "cod104", title: "Mobile App Development (Flutter/React Native)" },
        { id: "cod105", title: "Full-Stack Development Project" }
      ]
    },
    {
      id: "robotics",
      title: "Robotics Program with Basic Sciences",
      lessons: [
        { id: "rob-montessori", title: "Montessori Level: Sensory Robotics & Basic Physics (Ages 3–6)" },
        { id: "rob-primary", title: "Primary Level: Simple Machines, Logic & Intro Coding (Ages 6–12)" },
        { id: "rob-secondary", title: "Secondary Level: Electronics, Sensors, Arduino & Chemistry Basics (Ages 12–18)" },
        { id: "rob-university", title: "University Level: AI Robotics, Automation, Advanced Physics & Engineering" }
      ]
    },
    {
      id: "african-history-dev",
      title: "African History & Development",
      lessons: [
        { id: "ahd101", title: "Pre-Colonial African Societies" },
        { id: "ahd102", title: "Colonialism & Its Lasting Impact" },
        { id: "ahd103", title: "Pan-Africanism & Independence Movements" },
        { id: "ahd104", title: "Modern African Political Economy" }
      ]
    },
    {
      id: "public-health-africa",
      title: "Public Health in Africa",
      lessons: [
        { id: "pha101", title: "Tropical Diseases & Epidemiology" },
        { id: "pha102", title: "HIV/AIDS & Infectious Disease Control" },
        { id: "pha103", title: "Maternal & Child Health in Africa" },
        { id: "pha104", title: "Health Systems Strengthening" }
      ]
    },
    {
      id: "sustainable-dev-africa",
      title: "Sustainable Development in Africa",
      lessons: [
        { id: "sda101", title: "SDGs Localization in Africa" },
        { id: "sda102", title: "Climate Resilience & Adaptation" },
        { id: "sda103", title: "Renewable Energy Solutions" },
        { id: "sda104", title: "Food Security & Agriculture" }
      ]
    }
  ];

  /* ───────────────────────────────────────────────
     UTILITY HELPERS
     ─────────────────────────────────────────────── */
  function scrollChatToBottom() {
    if (!chatBox) return;
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function clearActive(selector) {
    document.querySelectorAll(selector).forEach((el) => el.classList.remove("active"));
  }

  function saveSelection(courseTitle, lessonTitle) {
    localStorage.setItem("wofaActiveCourse", courseTitle);
    localStorage.setItem("wofaActiveLesson", lessonTitle);
  }

  function getSavedSelection() {
    return {
      course: localStorage.getItem("wofaActiveCourse"),
      lesson: localStorage.getItem("wofaActiveLesson")
    };
  }

  /* ───────────────────────────────────────────────
     DISPLAY SELECTED LESSON MESSAGE
     ─────────────────────────────────────────────── */
  function showLessonSelected(courseTitle, lessonTitle) {
    if (!chatBox) return;

    const message = document.createElement("div");
    message.className = "message ai";
    message.innerHTML = `
      <strong>Selected Lesson:</strong><br>
      <b>Course:</b> ${courseTitle}<br>
      <b>Lesson:</b> ${lessonTitle}<br><br>
      I'm ready to help you learn this topic.<br>
      <em>Ask any question about it now!</em>
    `;

    chatBox.appendChild(message);
    scrollChatToBottom();

    if (questionInput) questionInput.focus();
  }

  /* ───────────────────────────────────────────────
     RENDER COURSES & LESSONS
     ─────────────────────────────────────────────── */
  function renderCourses() {
    coursesList.innerHTML = "";

    coursesData.forEach((course) => {
      const courseLi = document.createElement("li");
      courseLi.className = "course-item";
      courseLi.textContent = course.title;
      courseLi.setAttribute("role", "button");
      courseLi.setAttribute("tabindex", "0");
      courseLi.setAttribute("aria-expanded", "false");

      const lessonUl = document.createElement("ul");
      lessonUl.className = "lesson-list";

      course.lessons.forEach((lesson) => {
        const lessonLi = document.createElement("li");
        lessonLi.className = "lesson-item";
        lessonLi.textContent = lesson.title;
        lessonLi.setAttribute("role", "button");
        lessonLi.setAttribute("tabindex", "0");

        function selectLesson() {
          clearActive(".lesson-item");
          lessonLi.classList.add("active");

          saveSelection(course.title, lesson.title);
          showLessonSelected(course.title, lesson.title);
        }

        lessonLi.addEventListener("click", (e) => {
          e.stopPropagation();
          selectLesson();
        });

        lessonLi.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectLesson();
          }
        });

        lessonUl.appendChild(lessonLi);
      });

      function toggleLessons() {
        clearActive(".course-item");
        courseLi.classList.add("active");

        const isOpen = lessonUl.classList.toggle("open");
        courseLi.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }

      courseLi.addEventListener("click", toggleLessons);

      courseLi.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleLessons();
        }
      });

      coursesList.appendChild(courseLi);
      coursesList.appendChild(lessonUl);
    });
  }

  /* ───────────────────────────────────────────────
     RESTORE LAST SELECTION
     ─────────────────────────────────────────────── */
  function restoreSelection() {
    const saved = getSavedSelection();

    if (saved.course && saved.lesson) {
      showLessonSelected(saved.course, saved.lesson);
    }
  }

  renderCourses();
  restoreSelection();
});
