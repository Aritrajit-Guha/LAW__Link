// Redirect unauthenticated users to login
if (window.location.pathname === "/" && localStorage.getItem("auth") !== "true") {
  window.location.href = "/sections/auth/auth.html";
}

// Normal site enhancements
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (currentPath === linkPath || (currentPath.startsWith(linkPath) && linkPath !== '/')) {
      link.classList.add('active');
    }
  });

  const fadeElements = document.querySelectorAll('.fade-in');
  const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('appear');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  fadeElements.forEach(el => appearOnScroll.observe(el));

  setupSOSButton(); // ✅ Ensure it's called after DOM ready
});

// ============ SOS TRACKING LOGIC ============ //

let trackingStarted = false;
let watchId = null;
let sosBtn = null;
let holdTimer = null;

let trackId = localStorage.getItem("lawlink_track_id");
let userId = localStorage.getItem("lawlink_user_id");

if (!userId) {
  userId = crypto.randomUUID();
  localStorage.setItem("lawlink_user_id", userId);
}
if (!trackId) {
  trackId = crypto.randomUUID();
  localStorage.setItem("lawlink_track_id", trackId);
}

const startLiveTracking = async () => {
  if (trackingStarted) return;
  trackingStarted = true;

  console.log("🚨 SOS Triggered — Live tracking started.");

  watchId = navigator.geolocation.watchPosition(
    async position => {
      const { latitude: lat, longitude: long } = position.coords;
      const timestamp = Date.now();

      const payload = { userId, trackId, lat, long, timestamp };

      try {
        await fetch("/api/update-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        console.log("📍 Location sent");
      } catch (err) {
        console.error("❌ Failed to send location:", err.message);
      }
    },
    error => {
      console.error("Geolocation error:", error.message);
    },
    { enableHighAccuracy: true }
  );

  const baseUrl = window.location.origin;
  const trackingUrl = `${baseUrl}/features/live-track/index.html?id=${trackId}`;

  const linkDiv = document.getElementById("sos-link-display");
  if (linkDiv) {
    linkDiv.innerHTML = `
      <p>📡 Tracking Link (share with emergency contact):</p>
      <a href="${trackingUrl}" target="_blank">${trackingUrl}</a>
      <br><br>
      <button id="sendSmsBtn" style="margin-top: 10px;">📤 Share via SMS</button>
    `;

    try {
      await navigator.clipboard.writeText(trackingUrl);
      console.log("🔗 Link copied to clipboard!");
    } catch (e) {
      console.warn("⚠️ Clipboard failed:", e.message);
    }

    const smsBtn = document.getElementById("sendSmsBtn");
    if (smsBtn) {
      smsBtn.addEventListener("click", () => {
        const message = `🚨 Emergency! Track my live location: ${trackingUrl}`;
        const recipients = ["+917908122256", "+919932025868"]; // Update as needed
        const smsLink = `sms:${recipients.join(",")}?body=${encodeURIComponent(message)}`;
        window.location.href = smsLink;
      });
    }
  } else {
    console.warn("📭 sos-link-display not found in DOM.");
  }
};

const setupSOSButton = () => {
  sosBtn = document.getElementById("sos-button");
  if (!sosBtn) {
    console.warn("⚠️ SOS button not found in DOM.");
    return;
  }

  const triggerTracking = () => {
    if (!trackingStarted) {
      startLiveTracking();
    }
  };

  sosBtn.addEventListener("mousedown", () => {
    holdTimer = setTimeout(triggerTracking, 4000);
  });

  sosBtn.addEventListener("mouseup", () => clearTimeout(holdTimer));
  sosBtn.addEventListener("mouseleave", () => clearTimeout(holdTimer));
  sosBtn.addEventListener("touchstart", () => {
    holdTimer = setTimeout(triggerTracking, 4000);
  });
  sosBtn.addEventListener("touchend", () => clearTimeout(holdTimer));

  sosBtn.addEventListener("click", () => {
    if (!trackingStarted) {
      alert("Hold the SOS button for 4 seconds to activate live tracking.");
    }
  });
};
