let mode = "login";

const formTitle = document.getElementById("form-title");
const confirmPassword = document.getElementById("confirm-password");
const toggleText = document.getElementById("toggle-text");
const submitBtn = document.getElementById("submit-btn");
const form = document.getElementById("authForm");

// Detect environment
const backendURL = window.location.hostname.includes("localhost")
  ? "http://localhost:5000"
  : "https://law-link.onrender.com";

// Switch mode function (Fix: No stacking event listeners now)
function switchMode() {
  mode = mode === "login" ? "signup" : "login";

  formTitle.textContent = mode === "signup" ? "Sign Up for LawLink" : "Login to LawLink";
  confirmPassword.style.display = mode === "signup" ? "block" : "none";
  submitBtn.textContent = mode === "signup" ? "Sign Up" : "Login";

  toggleText.innerHTML = mode === "signup"
    ? `Already have an account? <a href="#" id="toggle-link">Login</a>`
    : `Don't have an account? <a href="#" id="toggle-link">Sign Up</a>`;

  // Reattach event listener cleanly
  document.getElementById("toggle-link").addEventListener("click", (e) => {
    e.preventDefault();
    switchMode();
  });
}

// Initial setup
document.getElementById("toggle-link").addEventListener("click", (e) => {
  e.preventDefault();
  switchMode();
});

// Handle form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirm = document.getElementById("confirm-password").value.trim();

  if (mode === "signup" && password !== confirm) {
    alert("❌ Passwords do not match.");
    return;
  }

  // Disable button & show loader
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loader"></span> Processing...';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const res = await fetch(`${backendURL}/api/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    const data = await res.json();

    if (res.ok && data.success) {
      localStorage.setItem("auth", "true");
      alert(`✅ ${mode === "signup" ? "Signup" : "Login"} successful!`);
      window.location.href = "/";
    } else {
      alert(`❌ ${data.message || "Something went wrong."}`);
    }
  } catch (err) {
    if (err.name === "AbortError") {
      alert("⚠️ Request timed out. Please check your network.");
    } else {
      alert("❌ Network error: " + err.message);
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = mode === "signup" ? "Sign Up" : "Login";
  }
});
