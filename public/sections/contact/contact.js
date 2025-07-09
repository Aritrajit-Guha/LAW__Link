document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    if (name.value.trim() && email.value.trim() && message.value.trim()) {
      feedback.textContent = "✅ Your message has been sent!";
      feedback.style.display = "block";
      feedback.style.color = "#00ffae";

      name.value = "";
      email.value = "";
      message.value = "";
    } else {
      feedback.textContent = "⚠️ Please fill in all fields.";
      feedback.style.display = "block";
      feedback.style.color = "#ff7675";
    }
  });
});
