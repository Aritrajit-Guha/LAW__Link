document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".feature-card");

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transition = "transform 0.3s ease";
        card.style.transform = "translateY(-8px)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
      });
    });

    // 🔒 Role-based redirect for Advocate Matcher
    const authRole = localStorage.getItem("authRole");
    const matcherCard = document.querySelectorAll(".feature-card")[1]; // second card is Advocate Matcher

    if (authRole === "advocate" && matcherCard) {
      
      matcherCard.onclick = () => {
        window.location.href = "/features//advocate-dashboard/advocate-dashboard.html";
      };
    }
  });