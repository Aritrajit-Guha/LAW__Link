let audioBlob, videoBlob, photoDataURL;
let mediaRecorder, chunks = [], audioStream = null;
let videoRecorder, videoChunks = [], videoStream = null;

// Dynamic backend URL for local vs online deployment
const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
    ? 'http://localhost:5000'     // Change if your local backend uses another port
    : 'https://your-backend-service.onrender.com'; // Replace with your deployed backend URL

navigator.geolocation.getCurrentPosition(
  position => {
    document.getElementById('latitude').innerText = position.coords.latitude;
    document.getElementById('longitude').innerText = position.coords.longitude;
    document.getElementById('geoStatus').innerText = "Location fetched";
  },
  error => {
    document.getElementById('geoStatus').innerText = "Location unavailable";
    console.warn('Geolocation error:', error);
  }
);

// Audio recording
document.getElementById('startRecord').onclick = async () => {
  audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(audioStream);
  mediaRecorder.start();
  chunks = [];

  mediaRecorder.ondataavailable = e => chunks.push(e.data);
  mediaRecorder.onstop = () => {
    audioBlob = new Blob(chunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(audioBlob);
    const audioPlayback = document.getElementById('audioPlayback');
    audioPlayback.src = url;
    audioPlayback.style.display = 'block';

    const audioAttachment = document.getElementById('audioAttachment');
    audioAttachment.src = url;
    audioAttachment.style.display = 'block';
  };

  document.getElementById('startRecord').disabled = true;
  document.getElementById('stopRecord').disabled = false;
  document.getElementById('status').innerText = "Recording...";
};

document.getElementById('stopRecord').onclick = () => {
  mediaRecorder.stop();
  audioStream.getTracks().forEach(track => track.stop());
  document.getElementById('status').innerText = "Recording saved";
  document.getElementById('stopRecord').disabled = true;
  document.getElementById('startRecord').disabled = false;
};

// Video preview and capture
document.getElementById('startVideo').onclick = async () => {
  videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  const video = document.getElementById('videoPreview');
  video.srcObject = videoStream;
  video.style.display = 'block';

  document.getElementById('capturePhoto').disabled = false;
  document.getElementById('stopVideo').disabled = false;
  document.getElementById('startVideoRecord').disabled = false;
};

document.getElementById('capturePhoto').onclick = () => {
  const canvas = document.getElementById('canvas');
  const video = document.getElementById('videoPreview');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  photoDataURL = canvas.toDataURL('image/png');

  const photoAttachment = document.getElementById('photoAttachment');
  photoAttachment.src = photoDataURL;
  photoAttachment.style.display = 'block';
};

document.getElementById('startVideoRecord').onclick = () => {
  videoChunks = [];
  videoRecorder = new MediaRecorder(videoStream);
  videoRecorder.start();

  videoRecorder.ondataavailable = e => videoChunks.push(e.data);
  videoRecorder.onstop = () => {
    videoBlob = new Blob(videoChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(videoBlob);

    const videoRecording = document.getElementById('videoRecording');
    videoRecording.src = url;
    videoRecording.style.display = 'block';

    const videoAttachment = document.getElementById('videoAttachment');
    videoAttachment.src = url;
    videoAttachment.style.display = 'block';
  };

  document.getElementById('startVideoRecord').disabled = true;
  document.getElementById('stopVideoRecord').disabled = false;
};

document.getElementById('stopVideoRecord').onclick = () => {
  videoRecorder.stop();
  document.getElementById('stopVideoRecord').disabled = true;
  document.getElementById('startVideoRecord').disabled = false;
};

document.getElementById('stopVideo').onclick = () => {
  videoStream.getTracks().forEach(track => track.stop());
  document.getElementById('videoPreview').style.display = 'none';

  document.getElementById('capturePhoto').disabled = true;
  document.getElementById('stopVideo').disabled = true;
  document.getElementById('startVideoRecord').disabled = true;
  document.getElementById('stopVideoRecord').disabled = true;
};

// Generate complaint with backend call using dynamic BACKEND_URL
document.getElementById('generateComplaint').onclick = async () => {
  const name = document.getElementById('victimName').value.trim();
  const incidentDate = document.getElementById('incidentDate').value;
  const description = document.getElementById('description').value.trim();
  const city = document.getElementById('city').value.trim();
  const state = document.getElementById('state').value.trim();
  const country = document.getElementById('country').value.trim();
  const pincode = document.getElementById('pincode').value.trim();

  if (!name || !incidentDate || !description || !city || !state || !country || !pincode) {
    alert("Please fill in all required fields.");
    return;
  }

  const location = `${city}, ${state}, ${country} - ${pincode}`;

  try {
    const res = await fetch(`${BACKEND_URL}/api/generate-complaint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, incidentDate, location, description })
    });

    const data = await res.json();

    if (data.success) {
      document.getElementById('complaintPreview').value = data.complaintText;
      document.getElementById('sendComplaint').disabled = false;
    } else {
      alert("Error generating complaint: " + data.error);
    }
  } catch (err) {
    alert("Network or server error generating complaint.");
    console.error(err);
  }
};

// Simulate sending complaint
document.getElementById('sendComplaint').onclick = () => {
  const finalText = document.getElementById('complaintPreview').value;
  const sendInfo = document.getElementById('sendInfo');
  sendInfo.innerHTML = `
    ✅ Complaint is ready to be submitted to local authorities.<br />
    📍 Location: ${document.getElementById('city').value}, ${document.getElementById('state').value}<br />
    📅 Date: ${document.getElementById('incidentDate').value}<br />
    📎 Attachments: Audio, ${photoDataURL ? "Photo" : "None"}, ${videoBlob ? "Video" : "None"}
  `;
  document.getElementById('sendStatus').innerText = "Complaint ready to be dispatched (mock).";
};
