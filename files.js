const express = require('express');
const { auth, requireRoles } = require('../middleware/auth');
const FileMaterial = require('../models/FileMaterial');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'student' ? { access: 'all' } : {};
    const files = await FileMaterial.find(query).sort({ uploadedDate: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, requireRoles('teacher', 'admin'), async (req, res) => {
  try {
    const { title, category, course, access, fileName, fileSize, fileData } = req.body;
    if (!title || !fileName || !fileData) {
      return res.status(400).json({ error: 'Title and file upload are required' });
    }
    const file = await FileMaterial.create({
      title,
      category,
      course,
      access: access || 'all',
      fileName,
      fileSize,
      fileData,
      uploadedBy: req.user.name || req.user.user,
      uploadedDate: new Date(),
    });
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const file = await FileMaterial.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (req.user.role !== 'admin' && file.uploadedBy !== (req.user.name || req.user.user)) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    await file.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
