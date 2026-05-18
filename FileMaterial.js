const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: '' },
  course: { type: String, default: '' },
  access: { type: String, enum: ['all', 'teachers'], default: 'all' },
  fileName: { type: String, default: '' },
  fileSize: { type: Number, default: 0 },
  fileData: { type: String, default: '' },
  uploadedBy: { type: String, default: '' },
  uploadedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('FileMaterial', fileSchema);
