const advocates = [
  {
    name: "Adv. Rina Sharma",
    photo: "1.jpeg",
    field: "family",
    phone: "+91-9876543210",
    whatsapp: "+91-9876543210",
    location: "Kolkata, West Bengal",
    winRate: "87%",
    experience: "12 years",
    pastCases: "Handled over 200 family dispute cases.",
    practicePlace: "Kolkata High Court"
  },
  {
    name: "Adv. Arjun Mehta",
    photo: "2.jpg",
    field: "property",
    phone: "+91-9123456789",
    whatsapp: "+91-9123456789",
    location: "Delhi",
    winRate: "81%",
    experience: "10 years",
    pastCases: "Over 150+ land/property dispute settlements.",
    practicePlace: "Delhi Civil Court"
  },
  {
    name: "Adv. Shreya Nair",
    photo: "3.jpg",
    field: "criminal",
    phone: "+91-9988776655",
    whatsapp: "+91-9988776655",
    location: "Mumbai, Maharashtra",
    winRate: "90%",
    experience: "14 years",
    pastCases: "Defended 300+ criminal cases.",
    practicePlace: "Bombay High Court"
  },
  {
    name: "Adv. Amrita Das",
    photo: "4.jpg",
    field: "labor",
    phone: "+91-9001122334",
    whatsapp: "+91-9001122334",
    location: "Bhubaneswar, Odisha",
    winRate: "78%",
    experience: "9 years",
    pastCases: "Worked with major unions and rights organizations.",
    practicePlace: "Labour Tribunal, Odisha"
  },
  {
    name: "Adv. Dinesh Kapoor",
    photo: "5.jpeg",
    field: "cyber",
    phone: "+91-8500123456",
    whatsapp: "+91-8500123456",
    location: "Bangalore, Karnataka",
    winRate: "89%",
    experience: "11 years",
    pastCases: "Resolved 250+ cyber fraud and data theft cases.",
    practicePlace: "Cyber Crime Cell, Bangalore"
  },
  {
    name: "Adv. Neeraj Verma",
    photo: "6.jpg",
    field: "harassment",
    phone: "+91-8080808080",
    whatsapp: "+91-8080808080",
    location: "Lucknow, UP",
    winRate: "85%",
    experience: "13 years",
    pastCases: "Specialist in workplace harassment and abuse.",
    practicePlace: "Lucknow District Court"
  },
  {
    name: "Adv. Paresh Menon",
    photo: "7.jpg",
    field: "family",
    phone: "+91-9223344556",
    whatsapp: "+91-9223344556",
    location: "Chennai, Tamil Nadu",
    winRate: "92%",
    experience: "15 years",
    pastCases: "Divorce and child custody expert.",
    practicePlace: "Madras High Court"
  },
  {
    name: "Adv. Rohit Ghosh",
    photo: "8.jpg",
    field: "criminal",
    phone: "+91-9988772211",
    whatsapp: "+91-9988772211",
    location: "Kolkata, WB",
    winRate: "84%",
    experience: "8 years",
    pastCases: "Handled several high-profile criminal trials.",
    practicePlace: "Kolkata Sessions Court"
  },
  {
    name: "Adv. Arjun Jain",
    photo: "9.jpeg",
    field: "labor",
    phone: "+91-9090909090",
    whatsapp: "+91-9090909090",
    location: "Indore, MP",
    winRate: "80%",
    experience: "10 years",
    pastCases: "Labor law and industrial disputes specialist.",
    practicePlace: "Industrial Court, Indore"
  },
  {
    name: "Adv. Mohit Rathi",
    photo: "10.jpeg",
    field: "cyber",
    phone: "+91-8787878787",
    whatsapp: "+91-8787878787",
    location: "Hyderabad, Telangana",
    winRate: "88%",
    experience: "7 years",
    pastCases: "Cyber security and ethical hacking certified.",
    practicePlace: "Cybercrime Tribunal, Hyderabad"
  },
  {
    name: "Adv. Sahil Ahmed",
    photo: "11.jpg",
    field: "property",
    phone: "+91-7666554433",
    whatsapp: "+91-7666554433",
    location: "Ahmedabad, Gujarat",
    winRate: "83%",
    experience: "9 years",
    pastCases: "Property title disputes and registration specialist.",
    practicePlace: "Ahmedabad Civil Court"
  },
  {
    name: "Adv. Kabir Thakur",
    photo: "12.jpeg",
    field: "harassment",
    phone: "+91-7555223344",
    whatsapp: "+91-7555223344",
    location: "Pune, Maharashtra",
    winRate: "91%",
    experience: "12 years",
    pastCases: "Gender rights and workplace equality advocate.",
    practicePlace: "Pune Magistrate Court"
  }
];

const resultBox = document.getElementById("result");
const matcherForm = document.getElementById("matcherForm");
const legalIssueSelect = document.getElementById("legalIssue");

function displayAdvocates(filtered = advocates) {
  resultBox.innerHTML = "";

  filtered.forEach((adv) => {
    const card = document.createElement("div");
    card.className = "advocate-card";
    card.innerHTML = `
      <img src="/features/advocate-matcher/${adv.photo}" alt="${adv.name}" class="advocate-photo"/>
      <div class="advocate-info">
        <h2>${adv.name}</h2>
        <p><strong>📍 Location:</strong> ${adv.location}</p>
        <p><strong>📞 Phone:</strong> ${adv.phone}</p>
        <p><strong>💼 Field:</strong> ${adv.field.charAt(0).toUpperCase() + adv.field.slice(1)}</p>
        <a href="https://wa.me/${adv.whatsapp.replace(/\D/g, '')}" target="_blank">📱 WhatsApp</a>
        <div class="advocate-extra">
          <p><strong>Experience:</strong> ${adv.experience}</p>
          <p><strong>Win Rate:</strong> ${adv.winRate}</p>
          <p><strong>Past Cases:</strong> ${adv.pastCases}</p>
          <p><strong>Practice Place:</strong> ${adv.practicePlace}</p>
        </div>
      </div>
    `;
    resultBox.appendChild(card);
  });
}

// Initial render
displayAdvocates();

matcherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const issue = legalIssueSelect.value;
  const filtered = issue ? advocates.filter((a) => a.field === issue) : advocates;
  displayAdvocates(filtered);
});
