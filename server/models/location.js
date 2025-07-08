const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  userId: { type: String, required: true },         // A unique ID for this session/user
  trackId: { type: String, required: true, unique: true }, // The sharable ID for tracking
  currentLocation: {
    lat: Number,
    long: Number,
    timestamp: Number
  },
  path: [
    {
      lat: Number,
      long: Number,
      timestamp: Number
    }
  ],
  emergencyContacts: [
    {
      name: String,
      phone: String
    }
  ]
});

module.exports = mongoose.model('Location', locationSchema);
