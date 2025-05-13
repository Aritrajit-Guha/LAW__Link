document.getElementById('generate-complaint-btn').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const incidentDate = document.getElementById('incident-date').value;
  const location = document.getElementById('location').value;
  const description = document.getElementById('description').value;

  // Check if any required fields are empty
  if (!name || !incidentDate || !location || !description) {
    alert('Please fill in all fields.');
    return;
  }

  const complaintData = {
    name,
    incidentDate,
    location,
    description
  };

  // Dynamic base URL depending on environment
  const baseURL = window.location.hostname.includes('localhost')
    ? 'http://localhost:5000'
    : 'https://law-link.onrender.com'; // 🔁 Replace this with your actual backend URL

  try {
    const response = await fetch(`${baseURL}/api/generate-complaint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(complaintData)
    });

    const result = await response.json();
    if (result.success) {
      const complaintText = result.complaintText;
      document.getElementById('generated-complaint').textContent = complaintText;
      document.getElementById('download-pdf-btn').style.display = 'block'; // Show the download button
    } else {
      alert('Error generating complaint.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error generating complaint.');
  }
});
