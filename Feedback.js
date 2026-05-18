const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: { type: String, default: 'Anonymous' },
  email: { type: String, default: '' },
  message: { type: String, required: true },
  type: { type: String, enum: ['contact', 'feedback'], default: 'feedback' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
