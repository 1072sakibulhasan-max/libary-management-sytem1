const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, default: '' },
  category: { type: String, default: '' },
  quantity: { type: Number, default: 1 },
  available: { type: Number, default: 1 },
  status: { type: String, default: 'Available' },
  addedDate: { type: Date, default: Date.now },
  fileName: { type: String, default: '' },
  fileData: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
