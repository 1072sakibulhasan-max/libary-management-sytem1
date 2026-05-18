const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();
const router = express.Router();

const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

router.post('/register', async (req, res) => {
  try {
    const { user, password, name, role = 'student', section, batch, specialRole } = req.body;
    if (!user || !password || !name) {
      return res.status(400).json({ error: 'Username, password and name are required' });
    }
    const existing = await User.findOne({ user });
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const created = await User.create({ user, password: hashed, name, role, section, batch, specialRole });
    const token = createToken(created);
    return res.json({ token, user: { user: created.user, name: created.name, role: created.role, section: created.section, batch: created.batch, specialRole: created.specialRole } });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { user, password } = req.body;
    if (!user || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const found = await User.findOne({ user });
    if (!found) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, found.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = createToken(found);
    return res.json({ token, user: { user: found.user, name: found.name, role: found.role, section: found.section, batch: found.batch, specialRole: found.specialRole } });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.json({ user });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
