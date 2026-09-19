const express = require("express");

const {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// =========================
// Create Student
// Faculty/Admin only
// =========================

router.post(
    "/",
    protect,
    authorizeRoles("faculty", "admin"),
    createStudent
);

// =========================
// Get All Students
// Faculty/Admin only
// =========================

router.get(
    "/",
    protect,
    authorizeRoles("faculty", "admin"),
    getStudents
);

// =========================
// Get Student By ID
// Faculty/Admin only
// =========================

router.get(
    "/:id",
    protect,
    authorizeRoles("faculty", "admin"),
    getStudentById
);

// =========================
// Update Student
// Faculty/Admin only
// =========================

router.put(
    "/:id",
    protect,
    authorizeRoles("faculty", "admin"),
    updateStudent
);

// =========================
// Delete Student
// Faculty/Admin only
// =========================

router.delete(
    "/:id",
    protect,
    authorizeRoles("faculty", "admin"),
    deleteStudent
);

module.exports = router;