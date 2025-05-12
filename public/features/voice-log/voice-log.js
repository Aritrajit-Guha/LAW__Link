let mediaRecorder;
let chunks = [];

document.getElementById("startRecord").onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  chunks = [];

  mediaRecorder.ondataavailable = e => chunks.push(e.data);
  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const audio = document.getElementById("audioPlayback");
    audio.src = url;
    audio.style.display = 'block';

    // Optional: Save to disk
    const a = document.createElement("a");
    a.href = url;
    a.download = "voice-log.webm";
    a.click();
  };

  mediaRecorder.start();
  document.getElementById("status").textContent = "Recording...";
  document.getElementById("startRecord").disabled = true;
  document.getElementById("stopRecord").disabled = false;
};

document.getElementById("stopRecord").onclick = () => {
  mediaRecorder.stop();
  document.getElementById("status").textContent = "Recording saved.";
  document.getElementById("startRecord").disabled = false;
  document.getElementById("stopRecord").disabled = true;
};
