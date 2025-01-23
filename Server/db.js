const express = require('express');
const mongoose = require('mongoose');
const app = express();

// MongoDB connection URI
const uri = 'mongodb+srv://shalini:Shalini%40LWD%40HL@cluster0.grvd0.mongodb.net/travel-website';

// Function to connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(uri); 
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); 
  }
}

connectDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
