const User = require("../models/User");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            "name email role studentId"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let student = null;

        // Preferred method:
        // Use the direct User -> Student relationship
        if (user.studentId) {
            student = await Student.findById(user.studentId)
                .select("name email course year");
        }

        // Backward compatibility:
        // If studentId is not linked yet, use email matching.
        if (!student) {
            student = await Student.findOne({
                email: user.email
            }).select("name email course year");
        }

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        const attendance = await Attendance.find({
            studentId: student._id
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
                    ((present / totalClasses) * 100).toFixed(2)
                );

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            profile: {
                id: student._id,
                name: student.name,
                email: student.email,
                course: student.course,
                year: student.year,
                attendance: {
                    totalClasses,
                    present,
                    absent,
                    percentage
                }
            }
        });
    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    getMyProfile
};