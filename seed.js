const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Book = require('./models/Book');
const Notice = require('./models/Notice');

const defaultUsers = [
  { user: 'admin', password: 'admin123', name: 'Admin User', role: 'admin' },
  { user: 'teacher1', password: 'teach123', name: 'Dr. Rahman', role: 'teacher', section: 'CSE', batch: 'Spring 2026' },
  { user: 'student1', password: 'student123', name: 'Demo Student', role: 'student', section: 'A', batch: '46th' },
  { user: 'idea_guy1', password: 'idea123', name: 'Idea Contributor', role: 'idea_contributor', section: 'A', batch: '46th' },
  { user: 'tester1', password: 'test123', name: 'QA Tester', role: 'qa_tester', section: 'B', batch: '46th' },
];

const defaultBooks = [
  { title: 'Data Structures & Algorithms', author: 'Mark Allen Weiss', isbn: '978-0132576277', category: 'CSE', quantity: 5, available: 4, status: 'Available', addedDate: new Date('2026-01-10') },
  { title: 'Java: The Complete Reference', author: 'Herbert Schildt', isbn: '978-1260440249', category: 'CSE', quantity: 3, available: 1, status: 'Available', addedDate: new Date('2026-01-12') },
  { title: 'Operating System Concepts', author: 'Silberschatz & Galvin', isbn: '978-1118063330', category: 'CSE', quantity: 4, available: 4, status: 'Available', addedDate: new Date('2026-01-15') },
  { title: 'Engineering Mathematics', author: 'K.A. Stroud', isbn: '978-0831134709', category: 'Mathematics', quantity: 6, available: 5, status: 'Available', addedDate: new Date('2026-01-18') },
  { title: 'Digital Logic Design', author: 'Morris Mano', isbn: '978-0131989245', category: 'EEE', quantity: 4, available: 3, status: 'Available', addedDate: new Date('2026-01-20') },
  { title: 'Computer Networks', author: 'Andrew Tanenbaum', isbn: '978-0132126953', category: 'CSE', quantity: 3, available: 0, status: 'Issued', addedDate: new Date('2026-02-01') },
];

const defaultNotices = [
  { text: '📢 New books have been added this week. Check the book list!', by: 'Admin', date: new Date('2026-03-01') },
  { text: '📢 Library will remain closed on Friday due to maintenance.', by: 'Admin', date: new Date('2026-03-04') },
  { text: '📢 Students must return issued books within 14 days to avoid fines.', by: 'Admin', date: new Date('2026-03-05') },
];

const seedDefaults = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      for (const user of defaultUsers) {
        const passwordHash = await bcrypt.hash(user.password, 10);
        await User.create({ ...user, password: passwordHash });
      }
      console.log('Seeded default users');
    }

    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      await Book.insertMany(defaultBooks);
      console.log('Seeded default books');
    }

    const noticeCount = await Notice.countDocuments();
    if (noticeCount === 0) {
      await Notice.insertMany(defaultNotices);
      console.log('Seeded default notices');
    }
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

module.exports = seedDefaults;
