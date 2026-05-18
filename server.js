const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedDefaults = require('./seed');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const issueRoutes = require('./routes/issues');
const fileRoutes = require('./routes/files');
const noticeRoutes = require('./routes/notices');
const feedbackRoutes = require('./routes/feedback');
const userRoutes = require('./routes/users');

dotenv.config();
connectDB().then(async () => {
  await seedDefaults();
});

const app = express();
app.use(cors());
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'home.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
