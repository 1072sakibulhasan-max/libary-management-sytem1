const express = require('express');
const { auth, requireRoles } = require('../middleware/auth');
const Notice = require('../models/Notice');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, requireRoles('teacher', 'admin'), async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const notice = await Notice.create({ text, by: req.user.name || req.user.user, date: new Date() });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, requireRoles('admin'), async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    await notice.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
