document.addEventListener("DOMContentLoaded", () => {
  const bubbleWrapper = document.querySelector(".background");
  const bubblesContainer = document.createElement("div");
  bubblesContainer.classList.add("bubbles");

  for (let i = 0; i < 20; i++) {
    const bubble = document.createElement("div");
    const size = Math.random() * 60 + 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.bottom = `-${size}px`;
    bubble.style.animationDuration = `${10 + Math.random() * 20}s`;
    bubble.style.animationDelay = `${Math.random() * 5}s`;
    bubblesContainer.appendChild(bubble);
  }

  bubbleWrapper.appendChild(bubblesContainer);
});
