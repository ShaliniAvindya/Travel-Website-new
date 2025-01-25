const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Import the routes
const tourRoutes = require('./routes/tourRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb+srv://shalini:Shalini%40LWD%40HL@cluster0.grvd0.mongodb.net/travel-website', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => {
  console.log('MongoDB connection error:', err);
  process.exit(1);  // Exit process if MongoDB connection fails
});

// Set up the routes
app.use('/api/tours', tourRoutes);

// Serve static files (like images) from 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});