const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student', 'idea_contributor', 'qa_tester'], default: 'student' },
  section: { type: String, default: '' },
  batch: { type: String, default: '' },
  specialRole: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
