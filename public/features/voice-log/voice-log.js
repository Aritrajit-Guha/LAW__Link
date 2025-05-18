let audioBlob, videoBlob, photoDataURL;
let mediaRecorder, chunks = [], stream = null;
let videoRecorder, videoChunks = [];

navigator.geolocation.getCurrentPosition(position => {
  document.getElementById('latitude').innerText = position.coords.latitude;
  document.getElementById('longitude').innerText = position.coords.longitude;
  document.getElementById('geoStatus').innerText = "Location fetched";
});

document.getElementById('startRecord').onclick = async () => {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.start();
  chunks = [];

  mediaRecorder.ondataavailable = e => chunks.push(e.data);
  mediaRecorder.onstop = () => {
    audioBlob = new Blob(chunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(audioBlob);
    document.getElementById('audioPlayback').src = url;
    document.getElementById('audioPlayback').style.display = 'block';
    document.getElementById('audioAttachment').src = url;
    document.getElementById('audioAttachment').style.display = 'block';
  };

  document.getElementById('startRecord').disabled = true;
  document.getElementById('stopRecord').disabled = false;
  document.getElementById('status').innerText = "Recording...";
};

document.getElementById('stopRecord').onclick = () => {
  mediaRecorder.stop();
  stream.getTracks().forEach(track => track.stop());
  document.getElementById('status').innerText = "Recording saved";
  document.getElementById('stopRecord').disabled = true;
};

document.getElementById('startVideo').onclick = async () => {
  stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  const video = document.getElementById('videoPreview');
  video.srcObject = stream;
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

  document.getElementById('photoAttachment').src = photoDataURL;
  document.getElementById('photoAttachment').style.display = 'block';
};

document.getElementById('startVideoRecord').onclick = () => {
  videoChunks = [];
  videoRecorder = new MediaRecorder(stream);
  videoRecorder.start();

  videoRecorder.ondataavailable = e => videoChunks.push(e.data);
  videoRecorder.onstop = () => {
    videoBlob = new Blob(videoChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(videoBlob);
    document.getElementById('videoRecording').src = url;
    document.getElementById('videoRecording').style.display = 'block';
    document.getElementById('videoAttachment').src = url;
    document.getElementById('videoAttachment').style.display = 'block';
  };

  document.getElementById('startVideoRecord').disabled = true;
  document.getElementById('stopVideoRecord').disabled = false;
};

document.getElementById('stopVideoRecord').onclick = () => {
  videoRecorder.stop();
};

document.getElementById('stopVideo').onclick = () => {
  stream.getTracks().forEach(track => track.stop());
  document.getElementById('videoPreview').style.display = 'none';
  document.getElementById('capturePhoto').disabled = true;
  document.getElementById('stopVideo').disabled = true;
};

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

  const res = await fetch('/api/generate-complaint', {
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
};

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
