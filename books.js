const express = require('express');
const { auth, requireRoles } = require('../middleware/auth');
const Book = require('../models/Book');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ addedDate: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, requireRoles('admin'), async (req, res) => {
  try {
    const data = req.body;
    data.available = data.available ?? data.quantity ?? 1;
    data.status = data.available > 0 ? 'Available' : 'Issued';
    const book = await Book.create(data);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, requireRoles('admin'), async (req, res) => {
  try {
    const data = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    Object.assign(book, data);
    book.available = Math.min(book.available ?? book.quantity, book.quantity);
    book.status = book.available > 0 ? 'Available' : 'Issued';
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, requireRoles('admin'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    await book.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
