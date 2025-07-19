// ✅ Toggle individual question answers
document.querySelectorAll(".question").forEach(q => {
  q.addEventListener("click", () => {
    const answer = q.nextElementSibling;
    answer.style.display = answer.style.display === "block" ? "none" : "block";
  });
});

// ✅ Combined Search + Filter Logic
const searchBar = document.getElementById("searchBar");
const sectionFilter = document.getElementById("sectionFilter");
const noResultsMessage = document.getElementById("noResults");

function applySearchAndFilter() {
  const query = searchBar.value.toLowerCase();
  const selectedSection = sectionFilter.value;
  let anyMatch = false;

  document.querySelectorAll(".faq-section").forEach(section => {
    const sectionId = section.getAttribute("data-section");
    const matchesFilter = selectedSection === "all" || sectionId === selectedSection;
    let sectionHasMatch = false;

    section.querySelectorAll(".faq").forEach(faq => {
      const questionText = faq.querySelector(".question").textContent.toLowerCase();
      const matchesQuery = questionText.includes(query);
      const shouldShow = matchesFilter && matchesQuery;

      faq.style.display = shouldShow ? "block" : "none";
      if (shouldShow) sectionHasMatch = true;
    });

    const header = document.querySelector(`.section-header[data-section="${sectionId}"]`);
    section.style.display = sectionHasMatch ? "block" : "none";
    if (header) header.style.display = sectionHasMatch ? "block" : "none";

    anyMatch = anyMatch || sectionHasMatch;
  });

  if (noResultsMessage) {
    noResultsMessage.style.display = anyMatch ? "none" : "block";
  }
}

searchBar.addEventListener("input", applySearchAndFilter);
sectionFilter.addEventListener("change", applySearchAndFilter);

// ✅ Section card click toggle (show one section, hide others)
document.querySelectorAll(".section-card").forEach(card => {
  card.addEventListener("click", () => {
    const sectionId = card.dataset.section;
    const section = document.querySelector(`.faq-section[data-section="${sectionId}"]`);
    const isVisible = section.style.display === "block";

    document.querySelectorAll(".faq-section").forEach(sec => {
      sec.style.display = "none";
      sec.querySelectorAll(".faq").forEach(faq => faq.style.display = "none");
    });

    if (!isVisible) {
      section.style.display = "block";
      section.querySelectorAll(".faq").forEach(faq => faq.style.display = "block");
    }
  });
});

// ✅ Backend base URL (auto switch between local & render)
const BASE_URL = location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://law-link.onrender.com";

// ✅ Ask a Question — Submit to backend
const form = document.getElementById("questionForm");
const status = document.getElementById("submitStatus");

if (form && status) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const question = document.getElementById("userQuestion").value.trim();

    if (question) {
      try {
        const res = await fetch(`${BASE_URL}/api/questions/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: question })
        });

        if (res.ok) {
          status.textContent = "✔️ Question submitted successfully!";
          status.style.color = "green";
          status.style.display = "block";

          form.reset();
          fetchQuestionCount();
          setLastUpdatedTimestamp();

          setTimeout(() => {
            status.style.display = "none";
          }, 4000);
        } else {
          status.textContent = "❌ Submission failed.";
          status.style.color = "red";
          status.style.display = "block";
        }
      } catch (err) {
        status.textContent = "❌ Server error.";
        status.style.color = "red";
        status.style.display = "block";
      }
    }
  });
}

// ✅ Clickable image for random facts
const factImage = document.getElementById("factImage");
const factsList = document.getElementById("factsList");

const facts = [
  "⚖️ 68% of women in India are unaware of their legal rights.",
  "📚 Knowing your rights boosts confidence and safety.",
  "🧕 Many workplace violations go unreported due to lack of awareness.",
  "📱 Cyber harassment cases are rising, but laws can protect victims.",
  "🏛️ Government schemes for women often go unused due to lack of information.",
  "💬 Educated women are 3x more likely to report abuse or injustice.",
  "🔒 Women in India are protected under Article 15, which prohibits discrimination on the basis of sex.",
  "🎓 The Right to Education Act ensures free education for girls up to age 14.",
  "🩺 Maternity Benefit Act ensures 26 weeks of paid maternity leave.",
  "📱 Report cybercrime on the National Cyber Crime Reporting Portal.",
  "💼 Organizations must have Internal Complaints Committees for harassment cases.",
  "📢 Beti Bachao Beti Padhao promotes education for girls.",
  "💡 23% of Indian women (15–49) have experienced physical violence.",
  "🚨 Dial 112 for emergency police help anywhere in India.",
  "🌐 Internet Saathi program empowered 30 million rural women digitally.",
  "🏥 Janani Suraksha Yojana helps pregnant women get hospital care.",
  "👩‍⚖️ Fast-track courts exist for crimes against women.",
  "🚺 Women aged 18+ have full voting rights in India.",
  "📊 Educating girls boosts national GDP and improves health.",
  "🛡️ POSH Act 2013 ensures workplace safety.",
  "📚 Knowledge is your strongest shield. Empower yourself!"
];

function displayRandomFacts() {
  const selected = new Set();
  while (selected.size < 4) {
    selected.add(facts[Math.floor(Math.random() * facts.length)]);
  }
  factsList.innerHTML = [...selected].map(f => `<li>${f}</li>`).join("");
}

if (factImage && factsList) {
  factImage.addEventListener("click", displayRandomFacts);
  displayRandomFacts(); // Initial
}

// ✅ Collapse all sections and questions on load
function collapseAllFAQs() {
  document.querySelectorAll(".faq-section").forEach(section => {
    section.style.display = "none";
    section.querySelectorAll(".faq").forEach(faq => {
      faq.style.display = "none";
    });
  });

  document.querySelectorAll(".toggle-icon").forEach(icon => {
    icon.textContent = "⬇️";
  });
}

// ✅ Set last updated timestamp
function setLastUpdatedTimestamp() {
  const now = new Date();
  const formatted = now.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const el = document.getElementById('faqLastUpdated');
  if (el) el.textContent = formatted;
}

// ✅ Fetch question count from backend
async function fetchQuestionCount() {
  try {
    const res = await fetch(`${BASE_URL}/api/questions/count`);
    const data = await res.json();
    const el = document.getElementById('questionCount');
    if (el) el.textContent = data.count;
  } catch (err) {
    console.error('Failed to load count', err);
    const el = document.getElementById('questionCount');
    if (el) el.textContent = 'Error';
  }
}

// ✅ Fetch last updated time
async function fetchLastUpdated() {
  try {
    const res = await fetch(`${BASE_URL}/api/questions/last-updated`);
    const data = await res.json();
    const formatted = new Date(data.lastUpdated).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    document.getElementById('faqLastUpdated').textContent = formatted;
  } catch (err) {
    document.getElementById('faqLastUpdated').textContent = "Unavailable";
  }
}

// ✅ On page load
document.addEventListener("DOMContentLoaded", () => {
  collapseAllFAQs();
  fetchQuestionCount();
  fetchLastUpdated();
});
