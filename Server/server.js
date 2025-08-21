const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('./passport'); 

const tourRoutes = require('./routes/tourRoutes');
const bodyParser = require("body-parser");
const contactRoutes = require('./routes/contactRoutes'); 
const inquireRoutes = require('./routes/inquiryRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true 
}));

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

app.options("*", cors());
app.use('/api/tours', tourRoutes);
app.use('/api/inquiries', inquireRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://shalini:Shalini%40TravelDB@cluster0.73bmkzy.mongodb.net/TravelDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB connect successful'))
  .catch((err) => console.error('DB connection error:', err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
