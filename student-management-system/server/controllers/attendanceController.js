const mongoose = require("mongoose");

const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

const markAttendance = async (req, res) => {
    try {
        const { studentId, date, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        if (!["present", "absent"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be present or absent"
            });
        }

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const attendance = await Attendance.create({
            studentId,
            date: date || new Date(),
            status
        });

        return res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            attendance
        });
    } catch (error) {
        console.error("Mark attendance error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getStudentAttendance = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const attendance = await Attendance.find({
            studentId
        }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            message: "Attendance fetched successfully",
            attendance
        });
    } catch (error) {
        console.error("Get attendance error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAttendanceSummary = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const attendance = await Attendance.find({
            studentId
        });

        const totalClasses = attendance.length;

        const present = attendance.filter(
            (record) => record.status === "present"
        ).length;

        const absent = attendance.filter(
            (record) => record.status === "absent"
        ).length;

        const percentage =
            totalClasses === 0
                ? 0
                : Number(
                      (
                          (present / totalClasses) *
                          100
                      ).toFixed(2)
                  );

        return res.status(200).json({
            success: true,
            message:
                "Attendance summary fetched successfully",
            summary: {
                totalClasses,
                present,
                absent,
                percentage
            }
        });
    } catch (error) {
        console.error(
            "Attendance summary error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, date } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance ID"
            });
        }

        if (
            status !== undefined &&
            !["present", "absent"].includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Status must be present or absent"
            });
        }

        if (date !== undefined) {
            const parsedDate = new Date(date);

            if (Number.isNaN(parsedDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid attendance date"
                });
            }
        }

        const attendance =
            await Attendance.findById(id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message:
                    "Attendance record not found"
            });
        }

        if (status !== undefined) {
            attendance.status = status;
        }

        if (date !== undefined) {
            attendance.date = new Date(date);
        }

        await attendance.save();

        return res.status(200).json({
            success: true,
            message:
                "Attendance updated successfully",
            attendance
        });
    } catch (error) {
        console.error(
            "Update attendance error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    markAttendance,
    getStudentAttendance,
    getAttendanceSummary,
    updateAttendance
};