const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://lawlink:Dhakichiku7@cluster0.r3a6s17.mongodb.net/lawlink?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI); // Removed deprecated options
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
