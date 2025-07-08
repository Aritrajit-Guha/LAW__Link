// script.js
import { v4 as uuidv4 } from 'https://cdn.skypack.dev/uuid';

document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.getElementById("mapContainer");
  const trackInput = document.getElementById("trackIdInput");
  const trackButton = document.getElementById("trackBtn");
  const startButton = document.getElementById("startTrackingBtn");
  const trackIdDisplay = document.getElementById("generatedTrackId");

  let map, marker, pathLine, refreshInterval;

  // ✅ Dynamic backend URL
  const isLocalhost = window.location.hostname === "localhost";
  const BACKEND_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://law-link.onrender.com";

  // === Load Location On Map ===
  const loadLocationOnMap = async (trackId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/live-location/${trackId}`);
      const data = await res.json();

      if (!data.success) {
        console.warn(data.message || "Location data not found.");
        return;
      }

      const { currentLocation, path } = data;

      if (!map) {
        map = L.map("mapContainer").setView([currentLocation.lat, currentLocation.long], 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors"
        }).addTo(map);
      }

      if (marker) {
        marker.setLatLng([currentLocation.lat, currentLocation.long]);
      } else {
        marker = L.marker([currentLocation.lat, currentLocation.long]).addTo(map);
      }

      if (pathLine) {
        map.removeLayer(pathLine);
      }

      const pathCoords = path.map(loc => [loc.lat, loc.long]);
      pathLine = L.polyline(pathCoords, { color: "lime", weight: 4 }).addTo(map);

      map.setView([currentLocation.lat, currentLocation.long], 15);
    } catch (err) {
      console.error("Error fetching live location:", err);
    }
  };

  // === Start New Tracking ===
  startButton.addEventListener("click", () => {
    const trackId = uuidv4();
    localStorage.setItem("trackId", trackId);

    startButton.disabled = true;
    startButton.textContent = "Starting...";

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      const timestamp = Date.now();

      const body = {
        userId: "aritra123",
        trackId,
        lat,
        long,
        timestamp,
        emergencyContacts: [
          { name: "Mom", phone: "+91XXXXXXXXXX" },
          { name: "Friend", phone: "+91YYYYYYYYYY" }
        ]
      };

      try {
        const res = await fetch(`${BACKEND_URL}/api/update-location`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        const result = await res.json();

        if (result.success) {
          trackIdDisplay.textContent = trackId;

          await navigator.clipboard.writeText(trackId);
          alert("📋 Track ID copied to clipboard!");

          if (refreshInterval) clearInterval(refreshInterval);
          await loadLocationOnMap(trackId);
          refreshInterval = setInterval(() => loadLocationOnMap(trackId), 5000);
        } else {
          alert("❌ Failed to start tracking.");
        }
      } catch (err) {
        console.error("Start tracking error:", err);
        alert("⚠️ Error starting tracking.");
      } finally {
        startButton.disabled = false;
        startButton.textContent = "Generate & Start Tracking";
      }
    }, () => {
      alert("⚠️ Location access denied.");
      startButton.disabled = false;
      startButton.textContent = "Generate & Start Tracking";
    });
  });

  // === Start Tracking via Manual ID ===
  trackButton.addEventListener("click", async () => {
    const trackId = trackInput.value.trim() || localStorage.getItem("trackId");

    if (!trackId) {
      alert("Please enter or start with a Track ID.");
      return;
    }

    if (refreshInterval) clearInterval(refreshInterval);
    await loadLocationOnMap(trackId);
    refreshInterval = setInterval(() => loadLocationOnMap(trackId), 5000);
  });
});
