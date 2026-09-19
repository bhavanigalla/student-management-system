const express = require("express");

const {
    markAttendance,
    getStudentAttendance,
    getAttendanceSummary,
    updateAttendance
} = require("../controllers/attendanceController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    authorizeRoles("faculty", "admin"),
    markAttendance
);

router.put(
    "/:id",
    protect,
    authorizeRoles("faculty", "admin"),
    updateAttendance
);

router.get(
    "/student/:studentId",
    protect,
    authorizeRoles("faculty", "admin"),
    getStudentAttendance
);

router.get(
    "/student/:studentId/summary",
    protect,
    authorizeRoles("faculty", "admin"),
    getAttendanceSummary
);

module.exports = router;