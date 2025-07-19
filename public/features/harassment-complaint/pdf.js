document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('download-pdf-btn');
    const complaintTextEl = document.getElementById('generated-complaint');
  
    if (downloadBtn && complaintTextEl) {
      downloadBtn.addEventListener('click', async () => {
        const complaintText = complaintTextEl.textContent.trim();
  
        if (!complaintText) {
          alert('Please generate a complaint before downloading.');
          return;
        }
  
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
  
        // Break long text into multiple lines
        const lines = doc.splitTextToSize(complaintText, 180);
        doc.text(lines, 15, 20);
  
        doc.save('Legal_Complaint_LawLink.pdf');
      });
    }
  });
  