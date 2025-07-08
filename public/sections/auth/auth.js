let mode = "login";

const formTitle = document.getElementById("form-title");
const confirmPassword = document.getElementById("confirm-password");
const toggleText = document.getElementById("toggle-text");
const toggleLink = document.getElementById("toggle-link");
const submitBtn = document.getElementById("submit-btn");
const form = document.getElementById("authForm");

// 👇 Add: Detect current environment
const backendURL = window.location.hostname.includes("localhost")
  ? "http://localhost:5000"
  : "https://law-link.onrender.com"; // 🔁 Replace with your real backend URL

toggleLink.addEventListener("click", () => {
  if (mode === "login") {
    mode = "signup";
    formTitle.textContent = "Sign Up for LawLink";
    confirmPassword.style.display = "block";
    submitBtn.textContent = "Sign Up";
    toggleText.innerHTML = `Already have an account? <a href="#" id="toggle-link">Login</a>`;
  } else {
    mode = "login";
    formTitle.textContent = "Login to LawLink";
    confirmPassword.style.display = "none";
    submitBtn.textContent = "Login";
    toggleText.innerHTML = `Don't have an account? <a href="#" id="toggle-link">Sign Up</a>`;
  }

  document.getElementById("toggle-link").addEventListener("click", () => toggleLink.click());
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirm = document.getElementById("confirm-password").value.trim();

  if (mode === "signup" && password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  // 👇 Use full backend URL dynamically
  const res = await fetch(`${backendURL}/api/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("auth", "true");
    window.location.href = "/";
  } else {
    alert(data.message || "Something went wrong.");
  }
});
