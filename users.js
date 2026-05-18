const express = require('express');
const { auth, requireRoles } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/', auth, requireRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
