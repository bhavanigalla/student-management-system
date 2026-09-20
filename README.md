# 🎓 Student Management System

A full-stack **Student Management System** designed to manage students, authentication, attendance, profiles, and academic information through a secure REST API.

Built as a **portfolio project** using a Vanilla JavaScript frontend and Node.js/Express backend with MongoDB.

---

## ✨ Features

### 👨‍🎓 Student

- 🔐 Student registration and login
- 👤 View personal profile
- 📚 View course and academic information
- 📅 View attendance records
- 📊 View attendance summary
- 🎟️ JWT-based authentication

### 👨‍🏫 Faculty / Admin

- 🔐 Faculty login and registration
- 👥 View all students
- ➕ Add students
- ✏️ Edit student information
- 🗑️ Delete students
- 📅 Mark attendance
- 🔄 Update existing attendance
- 🔍 View student information
- 🛡️ Role-based access control

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| 🌐 HTML5 | Frontend structure |
| 🎨 CSS3 | Styling and responsive UI |
| ⚡ Vanilla JavaScript | Frontend functionality |
| 🟢 Node.js | Backend runtime |
| 🚀 Express.js | REST API and server |
| 🍃 MongoDB | Database |
| 📦 Mongoose | MongoDB ODM |
| 🔐 JWT | Authentication |
| 🔒 bcryptjs | Password hashing |
| 📮 Postman | API testing |
| 🐙 Git & GitHub | Version control |

---

## 🏗️ Application Architecture

The application follows a layered REST API architecture:

```text
Frontend
   ↓
REST API
   ↓
JWT Authentication Middleware
   ↓
Role Authorization Middleware
   ↓
Validation
   ↓
Controller
   ↓
Mongoose Model
   ↓
MongoDB
   ↓
JSON Response
   ↓
Frontend UI
```

---

## 📂 Project Structure

```text
student-management-system/
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── student-dashboard.js
│   │   └── faculty-dashboard.js
│   │
│   ├── index.html
│   ├── register.html
│   ├── student-dashboard.html
│   └── faculty-dashboard.html
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── attendanceController.js
│   │   └── profileController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── validateMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   └── Attendance.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── profileRoutes.js
│   │   └── testRoutes.js
│   │
│   ├── services/
│   │
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 🔐 Authentication & Security

The application uses **JWT authentication** and **bcrypt password hashing**.

### Authentication Flow

```text
User Login
    ↓
Email + Password
    ↓
Express API
    ↓
Find User
    ↓
Verify Password using bcrypt
    ↓
Generate JWT
    ↓
Return Token
    ↓
Frontend
    ↓
Protected API Requests
```

Protected requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Security Practices

- 🔒 Passwords are hashed using bcrypt
- 🎟️ JWT is used for authentication
- 🛡️ Protected routes require authentication
- 👮 Role-based authorization is implemented
- 🌱 Sensitive values are stored in environment variables
- 🚫 `.env` is excluded from Git
- 📦 `node_modules` is excluded from Git
- ✅ Server-side validation is implemented
- 🔐 Password fields are not exposed in normal responses

---

## 👥 User Roles

| Feature | Student | Faculty | Admin |
|---|:---:|:---:|:---:|
| Login | ✅ | ✅ | ✅ |
| View Own Profile | ✅ | — | — |
| View Attendance | ✅ | ✅ | ✅ |
| Add Student | ❌ | ✅ | ✅ |
| View Students | ❌ | ✅ | ✅ |
| Edit Student | ❌ | ✅ | ✅ |
| Delete Student | ❌ | ✅ | ✅ |
| Mark Attendance | ❌ | ✅ | ✅ |
| Update Attendance | ❌ | ✅ | ✅ |

---

## 📡 REST API Endpoints

### 🔑 Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### 👥 Students

```http
POST   /api/students
GET    /api/students
GET    /api/students/:id
PUT    /api/students/:id
DELETE /api/students/:id
```

### 📅 Attendance

```http
POST /api/attendance
PUT  /api/attendance/:id
GET  /api/attendance/student/:studentId
GET  /api/attendance/student/:studentId/summary
```

### 👤 Profile

```http
GET /api/profile/me
```

### ❤️ Health Check

```http
GET /api/health
```

---

## 📊 Attendance Management

Faculty/Admin users can:

- ➕ Mark student attendance
- ✏️ Update attendance records
- 📋 View attendance history
- 📈 View attendance summary

The attendance summary includes:

```text
Total Classes
Present
Absent
Attendance Percentage
```

---

## 🗄️ Database Models

### 👤 User

```text
name
email
password
role
studentId
createdAt
updatedAt
```

### 🎓 Student

```text
name
email
course
year
createdAt
updatedAt
```

### 📅 Attendance

```text
studentId
date
status
createdAt
updatedAt
```

Attendance status:

```text
present
absent
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/student-management-system.git
```

### 2️⃣ Navigate to the project

```bash
cd student-management-system
```

### 3️⃣ Install dependencies

```bash
npm install
```

### 4️⃣ Create environment file

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
```

> ⚠️ Never upload your `.env` file to GitHub.

### 5️⃣ Start the application

For development:

```bash
npm run dev
```

Or:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

---

## ❤️ API Health Check

After starting the server, open:

```text
http://localhost:5000/api/health
```

A successful response confirms that the Express server is running.

---

## 🧪 API Testing

The REST APIs can be tested using **Postman**.

### Authentication Tests

- ✅ Valid login
- ❌ Invalid email/password
- ❌ Missing credentials
- ❌ Missing JWT
- ❌ Invalid JWT
- ❌ Expired JWT

### Student Tests

- ✅ Create student
- ✅ Get students
- ✅ Get student by ID
- ✅ Update student
- ❌ Invalid student ID
- ❌ Invalid email
- ❌ Invalid year
- ❌ Missing required fields
- ❌ Non-existent student

### Attendance Tests

- ✅ Mark attendance
- ✅ Get attendance
- ✅ Get attendance summary
- ✅ Update attendance
- ❌ Invalid attendance ID
- ❌ Invalid attendance status

### Authorization Tests

- ❌ Student accessing faculty-only APIs
- ❌ Unauthenticated requests
- ❌ Invalid JWT requests

---

## 🔄 Example Request Lifecycle

For example, when a faculty member updates a student:

```text
Frontend
   ↓
PUT /api/students/:id
   ↓
JWT Authentication
   ↓
Role Authorization
   ↓
Validation
   ↓
Student Controller
   ↓
Mongoose
   ↓
MongoDB
   ↓
JSON Response
   ↓
Frontend UI
```

---

## 🚨 HTTP Status Codes

| Status Code | Meaning |
|---|---|
| `200` | Successful request |
| `201` | Resource created |
| `400` | Invalid request / validation error |
| `401` | Authentication required / invalid credentials |
| `403` | Access denied |
| `404` | Resource not found |
| `500` | Internal server error |

---

## 🎯 Project Objectives

This project demonstrates practical experience with:

- REST API development
- CRUD operations
- JWT authentication
- Role-based authorization
- MongoDB database integration
- Mongoose models
- Password hashing
- Server-side validation
- Frontend/backend integration
- Attendance management
- API testing with Postman
- Git and GitHub workflow

---

## 🚀 Future Improvements

Planned improvements include:

- 📚 Academic records management
- 📈 Detailed student analytics
- 🔎 Student search and filtering
- 📄 Report generation
- 🧪 Automated API tests
- 📮 Complete Postman collection
- 👤 More granular admin permissions
- 🎨 Further UI improvements

---

## 📌 Project Status

| Module | Status |
|---|:---:|
| Project Setup | ✅ |
| MongoDB Integration | ✅ |
| JWT Authentication | ✅ |
| Role Authorization | ✅ |
| Student CRUD | ✅ |
| Attendance Management | ✅ |
| Attendance Updates | ✅ |
| Student Profile | ✅ |
| REST APIs | ✅ |
| Postman Testing | 🟡 |
| Documentation | ✅ |

---

## 👨‍💻 Author

### Student Management System

A full-stack portfolio project demonstrating authentication, authorization, CRUD operations, database integration, REST API development, and frontend/backend integration.

---

## ⭐ Project

If you find this project useful, feel free to explore the code and improve it further.

**Built with ❤️ using JavaScript, Node.js, Express.js and MongoDB.**
