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
  origin: process.env.CLIENT_URL || "https://travel-website-new.vercel.app",
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

app.use(express.json());

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.options("*", cors());

// ✅ Test route
app.get("/api/test", (req,res) => {
  res.json({ message: "🚀 API backend is running!" });
});

// Routes
app.use('/api/tours', tourRoutes);
app.use('/api/inquiries', inquireRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);

// MongoDB
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined!");
}
mongoose.connect(process.env.MONGODB_URI, {})
  .then(()=>console.log("DB connect successful"))
  .catch(err=>console.error("DB connection error:", err));

module.exports = app;



