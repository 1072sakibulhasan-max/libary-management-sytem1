const express = require('express');
const { auth, requireRoles } = require('../middleware/auth');
const Issue = require('../models/Issue');
const Book = require('../models/Book');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'student' ? { studentId: req.user.user } : {};
    const issues = await Issue.find(query).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, requireRoles('admin', 'teacher'), async (req, res) => {
  try {
    const { studentId, studentName, bookId, issueDate, dueDate } = req.body;
    if (!studentId || !bookId || !issueDate || !dueDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const book = await Book.findById(bookId);
    if (!book || book.available < 1) {
      return res.status(400).json({ error: 'Book is not available' });
    }
    book.available -= 1;
    book.status = book.available > 0 ? 'Available' : 'Issued';
    await book.save();
    const issue = await Issue.create({
      studentId,
      studentName: studentName || studentId,
      bookId,
      bookTitle: book.title,
      issueDate: new Date(issueDate),
      dueDate: new Date(dueDate),
      returned: false,
    });
    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/return', auth, requireRoles('admin', 'teacher'), async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    if (issue.returned) return res.status(400).json({ error: 'Book already returned' });
    issue.returned = true;
    issue.returnDate = new Date();
    await issue.save();
    const book = await Book.findById(issue.bookId);
    if (book) {
      book.available += 1;
      book.status = 'Available';
      await book.save();
    }
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
