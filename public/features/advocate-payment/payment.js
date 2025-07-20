
console.log("Payment.js loaded!");

// Read advocate data from URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const nname = urlParams.get('name') || 'Unknown Advocate';
const field = urlParams.get('field') || 'Unknown Field';
const advlocation = urlParams.get('location') || 'Unknown Location';
const photo = urlParams.get('photo') || 'default.png';
const fee = parseFloat(urlParams.get('fee')) || 500;

// Set advocate details on the page
document.getElementById('advocateName').textContent = nname;
document.getElementById('advocateField').textContent = field;
document.getElementById('advocateLocation').textContent = advlocation;
document.getElementById('advocatePhoto').src = `/features/advocate-matcher/${photo}`;
document.getElementById('advocateLocationInvoice').textContent = advlocation;

// Fee breakdown
const platformFee = 50.00;
const cgst = +(fee * 0.09).toFixed(2);
const sgst = +(fee * 0.09).toFixed(2);
const total = (fee + platformFee + cgst + sgst).toFixed(2);

// Update HTML with calculated values
document.getElementById('advocateFee').textContent = fee.toFixed(2);
document.getElementById('platformFee').textContent = platformFee.toFixed(2);
document.getElementById('cgst').textContent = cgst.toFixed(2);
document.getElementById('sgst').textContent = sgst.toFixed(2);
document.getElementById('totalFee').textContent = total;

// Generate a random invoice number
const invoiceId = 'INV-' + Math.floor(100000 + Math.random() * 900000);
document.getElementById('invoiceId').textContent = invoiceId;

// Set billing date
const billingDate = new Date().toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});
document.getElementById('billingDate').textContent = billingDate;
