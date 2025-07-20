const advocates = [
  {
    name: "Adv. Rina Sharma",
    photo: "1.jpeg",
    field: "Family Law",
    phone: "+91-9876543210",
    whatsapp: "+91-9876543210",
    location: "Kolkata, West Bengal",
    winRate: "87%",
    experience: "12 years",
    pastCases: "Handled over 150 family law cases including domestic disputes and child custody.",
    fee: 600
  },
  {
    name: "Adv. Arjun Mehta",
    photo: "2.jpg",
    field: "Criminal Law",
    phone: "+91-9823456789",
    whatsapp: "+91-9823456789",
    location: "Delhi",
    winRate: "91%",
    experience: "10 years",
    pastCases: "Specialized in high-profile criminal defense cases.",
    fee: 750
  },
  {
    name: "Adv. Sunita Das",
    photo: "3.jpg",
    field: "Property Law",
    phone: "+91-9934567890",
    whatsapp: "+91-9934567890",
    location: "Bhubaneswar, Odisha",
    winRate: "84%",
    experience: "8 years",
    pastCases: "Land dispute resolutions and real estate legal advisory.",
    fee: 500
  },
  {
    name: "Adv. Karan Singh",
    photo: "4.jpg",
    field: "Cyber Law",
    phone: "+91-9811122233",
    whatsapp: "+91-9811122233",
    location: "Mumbai, Maharashtra",
    winRate: "88%",
    experience: "6 years",
    pastCases: "Handled cybercrime and data breach cases.",
    fee: 650
  },
  {
    name: "Adv. Meera Pillai",
    photo: "5.jpeg",
    field: "Employment Law",
    phone: "+91-9877890123",
    whatsapp: "+91-9877890123",
    location: "Chennai, Tamil Nadu",
    winRate: "90%",
    experience: "11 years",
    pastCases: "Labor disputes, wrongful termination, and workplace harassment cases.",
    fee: 550
  },
  {
    name: "Adv. Nikhil Roy",
    photo: "6.jpg",
    field: "Tax Law",
    phone: "+91-9845673210",
    whatsapp: "+91-9845673210",
    location: "Kolkata, West Bengal",
    winRate: "83%",
    experience: "9 years",
    pastCases: "Tax evasion, GST and compliance consulting.",
    fee: 700
  },
  {
    name: "Adv. Priya Malhotra",
    photo: "7.jpg",
    field: "Human Rights",
    phone: "+91-9888888888",
    whatsapp: "+91-9888888888",
    location: "Lucknow, Uttar Pradesh",
    winRate: "89%",
    experience: "7 years",
    pastCases: "Women’s rights, domestic violence and constitutional petitions.",
    fee: 600
  },
  {
    name: "Adv. Rajeev Menon",
    photo: "8.jpg",
    field: "Contract Law",
    phone: "+91-9877612345",
    whatsapp: "+91-9877612345",
    location: "Bangalore, Karnataka",
    winRate: "85%",
    experience: "10 years",
    pastCases: "Breach of contract, business law, MOU drafting.",
    fee: 650
  },
  {
    name: "Adv. Anjali Verma",
    photo: "9.jpeg",
    field: "Consumer Law",
    phone: "+91-9765432109",
    whatsapp: "+91-9765432109",
    location: "Jaipur, Rajasthan",
    winRate: "92%",
    experience: "5 years",
    pastCases: "Consumer complaints, product liability and redressal representation.",
    fee: 500
  },
  {
    name: "Adv. Sameer Khan",
    photo: "10.jpeg",
    field: "Immigration Law",
    phone: "+91-9876567890",
    whatsapp: "+91-9876567890",
    location: "Hyderabad, Telangana",
    winRate: "86%",
    experience: "6 years",
    pastCases: "Visa issues, deportation defense and green card processing.",
    fee: 850
  },
  {
    name: "Adv. Deepa Iyer",
    photo: "11.jpg",
    field: "Environmental Law",
    phone: "+91-9877654321",
    whatsapp: "+91-9877654321",
    location: "Thiruvananthapuram, Kerala",
    winRate: "88%",
    experience: "9 years",
    pastCases: "Pollution control, NGO representation, and public interest litigations.",
    fee: 620
  },
  {
    name: "Adv. Rohit Deshmukh",
    photo: "12.jpeg",
    field: "Corporate Law",
    phone: "+91-9911223344",
    whatsapp: "+91-9911223344",
    location: "Pune, Maharashtra",
    winRate: "90%",
    experience: "12 years",
    pastCases: "Mergers, acquisitions, and corporate restructuring.",
    fee: 900
  }
];

const container = document.getElementById("result");

function displayAdvocates(list) {
  container.innerHTML = ''; // clear previous results
  list.forEach((advocate, index) => {
    const card = document.createElement("div");
    card.className = "advocate-card";
    card.innerHTML = `
      <img src="/features/advocate-matcher/${advocate.photo}" alt="${advocate.name}">
      <h3>${advocate.name}</h3>
      <p><strong>Field:</strong> ${advocate.field}</p>
      <p><strong>Location:</strong> ${advocate.location}</p>
      <p><strong>Experience:</strong> ${advocate.experience}</p>
      <p><strong>Success Rate:</strong> ${advocate.winRate}</p>
      <p><strong>Fee:</strong> ₹${advocate.fee}</p>
      <button class="book-btn" data-index="${index}">📅 Book Appointment</button>
    `;
    container.appendChild(card);
  });
}

// Add event delegation for booking
container.addEventListener("click", function (e) {
  if (e.target.classList.contains("book-btn")) {
    const index = e.target.getAttribute("data-index");
    const advocate = advocates[index];
    const query = new URLSearchParams({
      name: advocate.name,
      field: advocate.field,
      location: advocate.location,
      photo: advocate.photo,
      fee: advocate.fee
    });
    window.location.href = `/features/advocate-payment/index.html?${query}`;
  }
});

// Initial load
window.onload = () => {
  displayAdvocates(advocates);
};