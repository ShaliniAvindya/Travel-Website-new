const express = require('express');
const nodemailer = require('nodemailer');
const Inquiry = require('../models/inquirySubmission');
const router = express.Router();
require('dotenv').config();

// Configure Nodemailer transporter using .env variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper function to send inquiry email to Admin
const sendInquiryEmail = async ({
  name,
  email,
  phone_number,
  travel_date,
  traveller_count,
  message,
  tour,
  final_price,
  currency,
  selected_nights_key,
  selected_nights_option,
  selected_food_category,
}) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f7fa; color: #1f2937;">
      <table align="center" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(to right, #0891b2, #06b6d4); padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">New Travel Inquiry</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding: 20px;">
            <table width="100%" style="font-size: 16px; line-height: 1.5;">
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="color: #1f2937;">Name:</strong> ${name}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="color: #1f2937;">Email:</strong> <a href="mailto:${email}" style="color: #0891b2; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="color: #1f2937;">Phone:</strong> ${phone_number}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="color: #1f2937;">Travel Date:</strong> ${new Date(travel_date).toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="color: #1f2937;">Traveller Count:</strong> ${traveller_count}
                </td>
              </tr>
              ${tour ? `
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="color: #1f2937;">Tour:</strong> ${tour}
                </td>
              </tr>` : ''}
              ${final_price ? `
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="color: #1f2937;">Final Price:</strong> ${currency} ${final_price}
                </td>
              </tr>` : ''}
              ${selected_nights_key ? `
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="color: #1f2937;">Selected Nights:</strong> ${selected_nights_key}
                </td>
              </tr>` : ''}
              ${selected_nights_option ? `
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="color: #1f2937;">Nights Option:</strong> ${selected_nights_option}
                </td>
              </tr>` : ''}
              ${selected_food_category ? `
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="color: #1f2937;">Food Category:</strong> ${selected_food_category}
                </td>
              </tr>` : ''}
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="color: #1f2937;">Message:</strong>
                  <p style="margin: 0; color: #4b5563;">${message || 'No message provided'}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background-color: #f1f5f9; padding: 15px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Sent from Maldives Paradise<br>
              <a href="mailto:info@maldivesparadise.com" style="color: #0891b2; text-decoration: none;">info@maldivesparadise.com</a> | +960 345 6789
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  const mailOptions = {
    from: `"${name}" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    subject: `New Inquiry from ${name}`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

// POST /api/inquiries
router.post('/', async (req, res) => {
  const {
    name,
    email,
    phone_number,
    travel_date,
    traveller_count,
    message,
    tour,
    final_price,
    currency,
    selected_nights_key,
    selected_nights_option,
    selected_food_category,
  } = req.body;

  if (!name || !email || !phone_number || !travel_date || !traveller_count) {
    return res.status(400).json({ message: 'Missing required fields. Please fill them all.' });
  }

  try {
    const newInquiry = new Inquiry({
      name,
      email,
      phone_number,
      travel_date,
      traveller_count,
      message,
      tour,
      final_price,
      currency,
      selected_nights_key,
      selected_nights_option,
      selected_food_category,
    });

    await newInquiry.save();

    await sendInquiryEmail({
      name,
      email,
      phone_number,
      travel_date,
      traveller_count,
      message,
      tour,
      final_price,
      currency,
      selected_nights_key,
      selected_nights_option,
      selected_food_category,
    });

    res.status(201).json({ message: 'Inquiry submitted successfully!', inquiry: newInquiry });
  } catch (error) {
    console.error('Error processing inquiry submission:', error);
    res.status(500).json({ message: 'Error: Unable to submit your inquiry.', error: error.message });
  }
});

// GET /api/inquiries
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find({});
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving inquiries.', error: error.message });
  }
});

// DELETE /api/inquiries/:id
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Inquiry.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inquiry.', error: error.message });
  }
});

// POST /api/inquiries/reply
router.post('/reply', async (req, res) => {
  const { inquiryId, email, subject, replyMessage } = req.body;

  if (!email || !subject || !replyMessage || !inquiryId) {
    return res.status(400).json({ message: 'Email, subject, reply message, and inquiry ID are required.' });
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject,
    text: replyMessage,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f7fa; color: #1f2937;">
        <table align="center" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #0891b2, #06b6d4); padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Response from Maldives Paradise</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 20px;">
              <p style="font-size: 16px; line-height: 1.5; color: #4b5563; margin: 0 0 10px;">
                Dear ${email.split('@')[0]},
              </p>
              <p style="font-size: 16px; line-height: 1.5; color: #4b5563; margin: 0 0 10px;">
                Thank you for your inquiry. Below is our response:
              </p>
              <p style="font-size: 16px; line-height: 1.5; color: #1f2937; background-color: #f1f5f9; padding: 15px; border-radius: 6px; margin: 0;">
                ${replyMessage}
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 15px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Best regards,<br>
                Maldives Paradise Team<br>
                <a href="mailto:info@maldivesparadise.com" style="color: #0891b2; text-decoration: none;">info@maldivesparadise.com</a> | +960 345 6789
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);

    await Inquiry.findByIdAndUpdate(inquiryId, {
      reply: {
        subject,
        message: replyMessage,
        sentAt: new Date(),
      },
    });

    res.status(200).json({ message: 'Reply sent successfully.' });
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({ message: 'Failed to send reply.', error: error.message });
  }
});

module.exports = router;