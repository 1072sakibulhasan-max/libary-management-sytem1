# Premier University Library Backend & Full-Stack Integration

## Project Structure

This is now a **full-stack application** combining:
- **Frontend**: Static HTML, CSS, and JavaScript pages (existing)
- **Backend**: Node.js + Express API server with MongoDB database (new)

```
├── server.js              # Main Express server entrypoint
├── seed.js                # Database seeding with default data
├── package.json           # Node.js dependencies
├── .env.example           # Environment configuration template
├── config/
│   └── db.js              # MongoDB connection configuration
├── middleware/
│   └── auth.js            # JWT authentication & role-based access
├── models/                # MongoDB Mongoose schemas
│   ├── User.js
│   ├── Book.js
│   ├── Issue.js
│   ├── FileMaterial.js
│   ├── Notice.js
│   └── Feedback.js
├── routes/                # Express API endpoints
│   ├── auth.js            # Authentication (login, register, verify token)
│   ├── books.js           # Book CRUD, catalog search
│   ├── issues.js          # Book borrowing and return tracking
│   ├── files.js           # Educational material uploads
│   ├── notices.js         # Notifications and announcements
│   ├── feedback.js        # User feedback collection
│   └── users.js           # User listing (admin only)
└── [Frontend HTML/CSS/JS]
    ├── index.html         # Login portal (integrated with API)
    ├── home.html
    ├── admin.html         # Admin dashboard
    ├── student.html       # Student dashboard
    ├── teacher.html       # Teacher dashboard
    ├── lib.js             # Unified library with API integration
    └── ... [other pages]
```

## Prerequisites

- **Node.js** v14+ and npm
- **MongoDB** server running locally or remote connection string
- **MongoDB Community**: https://www.mongodb.com/try/download/community

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB connection string:
```ini
MONGO_URI=mongodb://127.0.0.1:27017/premier_library
JWT_SECRET=your-super-secret-key-change-this
PORT=5000
```

### 3. Start MongoDB
**Windows (if installed as service):**
```bash
# MongoDB should start automatically
# Or manually:
mongod
```

**Mac/Linux:**
```bash
brew services start mongodb-community
# or
mongod
```

### 4. Start the Server
Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## Features

### Authentication
- Secure JWT-based user authentication
- Password hashing with bcryptjs
- Roles: Admin, Teacher, Student, Idea Contributor, QA Tester
- Session persistence across page refreshes

### Book Management
- Complete CRUD operations for library books
- Search & filtering by category, availability status
- Book availability tracking
- PDF attachment support for physical books

### Issue & Return System
- Issue book to students with automatic stock decrement
- Track due dates and overdue books
- Return books with automatic stock increment
- Issue history and return status tracking

### File Management
- Upload course materials (PDFs, documents)
- Role-based file access (all users or teachers only)
- File download with original filename preservation

### Notices & Announcements
- Post library announcements
- Admin-only creation and deletion
- Chronological display

### Feedback & Contact
- User feedback collection system
- Contact form submissions
- Admin view all feedback and messages

### User Management
- Admin can list all registered users with roles
- User statistics: issued books, activity tracking

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login (returns JWT token)
- `GET /api/auth/me` - Verify current session (requires token)

### Books
- `GET /api/books` - List all books
- `GET /api/books/{id}` - Get book details
- `POST /api/books` - Create book (admin only)
- `PUT /api/books/{id}` - Update book (admin only)
- `DELETE /api/books/{id}` - Delete book (admin only)

### Issues
- `GET /api/issues` - List issues (filtered by user if student)
- `POST /api/issues` - Issue a book (admin/teacher)
- `PUT /api/issues/{id}/return` - Return a book (admin/teacher)

### Files
- `GET /api/files` - List accessible files
- `POST /api/files` - Upload file (teacher/admin)
- `DELETE /api/files/{id}` - Delete file (uploader or admin)

### Notices
- `GET /api/notices` - List all notices
- `POST /api/notices` - Create notice (teacher/admin)
- `DELETE /api/notices/{id}` - Delete notice (admin only)

### Feedback
- `POST /api/feedback` - Submit feedback (public)
- `GET /api/feedback` - List feedback (admin only)

### Users
- `GET /api/users` - List all users (admin only)

## Default Test Accounts

All passwords are seeded automatically. Test with:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| teacher1 | teach123 | Teacher |
| student | 1234 | Student |
| idea_guy | idea123 | Student (Idea Contributor) |
| tester1 | test123 | Student (QA Tester) |

After first MongoDB connection, these accounts are created automatically.

## Frontend Integration

The existing frontend pages now communicate with the backend through the unified `lib.js` library:

### Key Methods in PULib
```javascript
// Authentication
PULib.loginAccount({user, password})
PULib.registerAccount({user, password, name, role})
PULib.logout()

// Books
PULib.fetchBooks()
PULib.fetchBookById(id)
PULib.createBook(data)
PULib.updateBook(id, data)
PULib.deleteBook(id)

// Book Issues
PULib.fetchIssues()
PULib.issueBook({studentId, bookId, issueDate, dueDate})
PULib.returnIssue(id)

// Files
PULib.fetchFiles()
PULib.uploadFile({title, category, fileName, fileData})
PULib.deleteFile(id)

// Notices & Feedback
PULib.fetchNotices()
PULib.createNotice(text)
PULib.sendFeedback({name, email, message})

// Data Sync
PULib.syncData() // Fetch all data from backend
```

### Fallback Mode
If the backend is unavailable, the frontend gracefully falls back to:
- localStorage for data persistence
- Local session storage for authentication
- Default seed data for initial catalog

This ensures the app remains functional even without the API server.

## Environment Variables

```ini
# MongoDB connection string
# Local: mongodb://127.0.0.1:27017/premier_library
# MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/premier_library
MONGO_URI=mongodb://127.0.0.1:27017/premier_library

# JWT secret for token signing (use a strong random string)
JWT_SECRET=your-secret-key-here

# Server port (default: 5000)
PORT=5000
```

## Database Design

### User Collection
```javascript
{
  _id: ObjectId,
  user: String (unique),
  password: String (hashed),
  name: String,
  role: String (enum: admin, teacher, student, idea_contributor, qa_tester),
  section: String,
  batch: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Book Collection
```javascript
{
  _id: ObjectId,
  title: String,
  author: String,
  isbn: String,
  category: String,
  quantity: Number,
  available: Number,
  status: String (Available/Issued),
  fileName: String,
  fileData: String (base64),
  addedDate: Date
}
```

### Issue Collection
```javascript
{
  _id: ObjectId,
  studentId: String,
  studentName: String,
  bookId: ObjectId (ref Book),
  bookTitle: String,
  issueDate: Date,
  dueDate: Date,
  returned: Boolean,
  returnDate: Date
}
```

### FileMaterial Collection
```javascript
{
  _id: ObjectId,
  title: String,
  category: String,
  course: String,
  access: String (all/teachers),
  fileName: String,
  fileSize: Number,
  fileData: String (base64),
  uploadedBy: String,
  uploadedDate: Date
}
```

### Notice Collection
```javascript
{
  _id: ObjectId,
  text: String,
  by: String,
  date: Date
}
```

### Feedback Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  message: String,
  type: String (contact/feedback),
  date: Date
}
```

## Troubleshooting

### MongoDB Connection Error
```
MongooseError: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running. Start with `mongod` or check system service.

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change `PORT` in `.env` or kill process using port 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### JWT Token Expired
The frontend automatically handles token refresh on `401` responses. Re-login if needed.

### CORS Issues
Ensure `cors` middleware is properly configured in `server.js` (already done).

## Development Tips

### Use Nodemon for Auto-Reload
```bash
npm run dev
```
Automatically restarts server when files change.

### Check MongoDB Data
```bash
mongodb // or use MongoDB Compass GUI
use premier_library
db.books.find()
db.users.find()
```

### Test API with curl
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"user":"student","password":"1234"}'

# Get books
curl http://localhost:5000/api/books

# Create book (requires token)
curl -X POST http://localhost:5000/api/books \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

## Deployment

### Deploy to Heroku
1. Create `Procfile`:
```
web: node server.js
```

2. Set environment variables:
```bash
heroku config:set MONGO_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret
```

3. Deploy:
```bash
git push heroku main
```

### Deploy to DigitalOcean/AWS
Similar process: set environment variables, run `npm install && npm start`.

## Security Notes

- ✅ Passwords are hashed with bcryptjs (salt: 10)
- ✅ JWT tokens expire in 7 days
- ✅ Role-based access control on all protected routes
- ✅ CORS enabled for frontend integration
- ⚠️ Change `JWT_SECRET` in production
- ⚠️ Use HTTPS in production
- ⚠️ Validate and sanitize all inputs
- ⚠️ Use MongoDB Atlas with network access restrictions

## Contributing

When adding new features:
1. Create new Mongoose schema in `models/`
2. Create route file in `routes/`
3. Add auth middleware for protected endpoints
4. Update `lib.js` with new PULib methods
5. Integrate in frontend pages (admin.html, student.html, etc.)

## License

Project developed by Loop Infinity team for Premier University Library Management System.

---

**Questions or Issues?** Contact the development team or refer to the code comments for implementation details.
