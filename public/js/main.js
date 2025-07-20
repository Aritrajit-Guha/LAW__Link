// Redirect unauthenticated users to login
if (window.location.pathname === "/" && localStorage.getItem("auth") !== "true") {
  window.location.href = "/sections/auth/auth.html";
}

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (currentPath === linkPath || (currentPath.startsWith(linkPath) && linkPath !== '/')) {
      link.classList.add('active');
    }
  });

  // ✅ Role-based homepage change
  const auth = localStorage.getItem("auth");
  const role = localStorage.getItem("authRole");
  const consultBtn = document.querySelector('.cta-buttons .btn.secondary');

  if (auth === "true" && role === "advocate" && consultBtn) {
    consultBtn.textContent = "Go to Dashboard";
    consultBtn.href = "/features/advocate-dashboard/advocate-dashboard.html"; // Change link
  }

  setupSOSButton(); // ✅ Run after DOM is loaded
});


// ============ SOS TRACKING LOGIC ============ //

let trackingStarted = false;
let watchId = null;
let holdTimer = null;

let userId = localStorage.getItem("lawlink_user_id");
if (!userId) {
  userId = crypto.randomUUID();
  localStorage.setItem("lawlink_user_id", userId);
}

const BACKEND_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://law-link.onrender.com";

const startLiveTracking = async () => {
  if (trackingStarted) return;
  trackingStarted = true;

  const trackId = crypto.randomUUID();
  localStorage.setItem("lawlink_track_id", trackId);

  console.log("🚨 SOS Triggered — Live tracking started with ID:", trackId);

  const baseUrl = window.location.origin;
  const trackingUrl = `${baseUrl}/features/live-track/index.html?id=${trackId}`;

  const linkDiv = document.getElementById("sos-link-display");
  if (linkDiv) {
    linkDiv.innerHTML = `
      <p>📡 <strong>Live Tracking ID:</strong> <span style="color:limegreen;">${trackId}</span></p>
      <p>🔗 <a href="${trackingUrl}" target="_blank">${trackingUrl}</a></p>
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
        const message = `🚨 Emergency Alert!\nTrack my live location: ${trackingUrl}\nTrack ID: ${trackId}`;
        const recipients = ["+919734743058", "+918250316944", "+919134084200", "+918250404128", "+918348814332"];
        const smsLink = `sms:${recipients.join(",")}?body=${encodeURIComponent(message)}`;
        window.location.href = smsLink;
      });
    }
  }

  watchId = navigator.geolocation.watchPosition(
    async position => {
      const { latitude: lat, longitude: long } = position.coords;
      const timestamp = Date.now();

      const payload = { userId, trackId, lat, long, timestamp };

      try {
        await fetch(`${BACKEND_URL}/api/update-location`, {
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
};

const setupSOSButton = () => {
  const sosBtn = document.getElementById("sos-button");
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
