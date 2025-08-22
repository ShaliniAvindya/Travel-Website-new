const express = require('express');
const nodemailer = require('nodemailer');
const ContactSubmission = require('../models/ContactSubmission'); 
const router = express.Router();
require('dotenv').config(); 

// Configure Nodemailer with SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == '465', 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send Contact Email
const sendContactEmail = async ({ name, email, phone, subject, message }) => {
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
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">New Contact Inquiry</h1>
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
              ${phone ? `
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="color: #1f2937;">Phone:</strong> ${phone}
                </td>
              </tr>` : ''}
              ${subject ? `
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="color: #1f2937;">Subject:</strong> ${subject}
                </td>
              </tr>` : ''}
              <tr>
                <td style="padding: 10px 0;">
                  <strong style="color: #1f2937;">Message:</strong>
                  <p style="margin: 0; color: #4b5563;">${message}</p>
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
    subject: `New Contact Inquiry: ${subject || 'No Subject'} from ${name}`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions); 
};

router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }

  try {
    const newSubmission = new ContactSubmission({
      name,
      email,
      phone: phone || '',
      subject: subject || '',
      message,
    });
    await newSubmission.save();

    await sendContactEmail({ name, email, phone, subject, message });

    res.status(200).json({ success: true, message: 'Thank you for contacting us! We have received your message.' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ success: false, message: 'Error: Unable to submit your message.', error: error.message });
  }
});

// Fetch all contact inquiries
router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await ContactSubmission.find().sort({ submittedAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch inquiries.', error: error.message });
  }
});

// Delete a specific inquiry by ID
router.delete('/inquiries/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const inquiry = await ContactSubmission.findByIdAndDelete(id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }
    res.status(200).json({ success: true, message: 'Inquiry deleted successfully.' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ success: false, message: 'Error deleting inquiry.', error: error.message });
  }
});

// Reply to an inquiry
router.post('/reply', async (req, res) => {
  const { email, subject, replyMessage, inquiryId } = req.body;

  if (!email || !subject || !replyMessage || !inquiryId) {
    return res.status(400).json({ success: false, message: 'Email, subject, reply message, and inquiry ID are required.' });
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
                Thank you for reaching out to us. Below is our response to your inquiry:
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

    await ContactSubmission.findByIdAndUpdate(inquiryId, {
      reply: {
        subject,
        message: replyMessage,
        sentAt: new Date(),
      },
    });

    res.status(200).json({ success: true, message: 'Reply sent successfully.' });
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({ success: false, message: 'Failed to send reply.', error: error.message });
  }
});

module.exports = router;
