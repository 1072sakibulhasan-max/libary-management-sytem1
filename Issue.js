const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, default: '' },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  bookTitle: { type: String, required: true },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  returned: { type: Boolean, default: false },
  returnDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);
