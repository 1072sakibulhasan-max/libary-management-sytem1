const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  text: { type: String, required: true },
  by: { type: String, default: 'Admin' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
