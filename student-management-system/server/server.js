const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const profileRoutes = require("./routes/profileRoutes");

dotenv.config();


// =========================
// Connect to MongoDB
// =========================

connectDB();


// =========================
// Create Express App
// =========================

const app = express();


// =========================
// Middleware
// =========================

app.use(cors());

app.use(express.json());


// =========================
// Serve Frontend
// =========================

app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);


// =========================
// API Routes
// =========================

app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/profile", profileRoutes);


// =========================
// Frontend Home Page
// =========================

app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );
});


// =========================
// 404 Handler
// =========================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});


// =========================
// Global Error Handler
// =========================

app.use((err, req, res, next) => {
    console.error(
        "Server error:",
        err
    );

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});


// =========================
// Start Server
// =========================

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {
        console.log(
            `Server running on http://localhost:${PORT}`
        );
    }
);