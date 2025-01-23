const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('./passport'); 
const tourRoutes = require('./routes/tourRoutes');
const bodyParser = require("body-parser");
const contactRoutes = require('./routes/contactRoutes'); 

const app = express();
app.use(bodyParser.json());
app.use('/api/contact', contactRoutes);

// Use CORS for cross-origin requests
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Middleware to parse JSON data
app.use(express.json());

// Enable session for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/tours', tourRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://shalini:Shalini%40LWD%40HL@cluster0.grvd0.mongodb.net/travel-website', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB connect successful'))
  .catch((err) => console.error('DB connection error:', err));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
