const express = require('express');
const router = express.Router();
const Inquiry = require('../models/inquirySubmission'); // Path to your Inquiry model
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter using .env variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == '465', // true if port is 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper function to send inquiry email to Admin
const sendInquiryEmail = async (inquiryData) => {
  // Destructure the fields you want in the email
  const { name, email, phone_number, travel_date, traveller_count, message } = inquiryData;

  const mailOptions = {
    from: `"${name}" <${email}>`, // "John Doe" <john@gmail.com>
    to: process.env.SMTP_USER,    // admin email from your .env or another email
    subject: `New Inquiry from ${name}`,
    html: `
      <h2>New Travel Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone_number}</p>
      <p><strong>Travel Date:</strong> ${travel_date}</p>
      <p><strong>Traveller Count:</strong> ${traveller_count}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// POST /api/inquiries
// Create a new inquiry + send email
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone_number,
      travel_date,
      traveller_count,
      message,
      tour_id,
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone_number || !travel_date || !traveller_count) {
      return res
        .status(400)
        .json({ message: 'Missing required fields. Please fill them all.' });
    }

    // 1) Create a new Inquiry in MongoDB
    const newInquiry = new Inquiry({
      name,
      email,
      phone_number,
      travel_date,
      traveller_count,
      message,
      tour_id: tour_id || null,
    });
    await newInquiry.save();

    // 2) Send email notification to admin
    await sendInquiryEmail({
      name,
      email,
      phone_number,
      travel_date,
      traveller_count,
      message,
    });

    // 3) Return success
    return res.status(201).json({
      message: 'Inquiry submitted successfully!',
      inquiry: newInquiry,
    });
  } catch (error) {
    console.error('Error processing inquiry submission:', error);
    return res.status(500).json({
      message: 'Error: Unable to submit your inquiry.',
      error: error.message,
    });
  }
});

// (Optional) GET /api/inquiries
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find({});
    return res.json(inquiries);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving inquiries.',
      error: error.message,
    });
  }
});

module.exports = router;
