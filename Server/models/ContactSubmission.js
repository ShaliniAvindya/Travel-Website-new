const mongoose = require('mongoose');

const contactSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' }, 
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  reply: {
    subject: { type: String },
    message: { type: String },
    sentAt: { type: Date },
  },
});

module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema);
