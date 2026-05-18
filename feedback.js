const express = require('express');
const { auth, requireRoles } = require('../middleware/auth');
const Feedback = require('../models/Feedback');

const router = express.Router();

router.get('/', auth, requireRoles('admin'), async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ date: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, message, type = 'feedback' } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    const fb = await Feedback.create({ name: name || 'Anonymous', email: email || '', message, type, date: new Date() });
    res.status(201).json(fb);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
