const mongoose = require("mongoose");
const Student = require("../models/Student");

// =========================
// Helper: Validate Student Data
// =========================
const validateStudentData = (name, email, course, year) => {
    if (
        typeof name !== "string" ||
        name.trim() === "" ||
        typeof course !== "string" ||
        course.trim() === "" ||
        typeof email !== "string" ||
        email.trim() === ""
    ) {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
        return false;
    }

    if (
        !Number.isInteger(year) ||
        year < 1 ||
        year > 5
    ) {
        return false;
    }

    return true;
};

// =========================
// Create Student
// =========================
const createStudent = async (req, res) => {
    try {
        const { name, email, course, year } = req.body;

        if (
            !validateStudentData(
                name,
                email,
                course,
                year
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid request data"
            });
        }

        const existingStudent = await Student.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: "Student already exists"
            });
        }

        const student = await Student.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            course: course.trim(),
            year
        });

        return res.status(201).json({
            success: true,
            message: "Student created successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                course: student.course,
                year: student.year
            }
        });
    } catch (error) {
        console.error("Create student error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// =========================
// Get All Students
// =========================
const getStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .select("name email course year");

        return res.status(200).json({
            success: true,
            message: "Students fetched successfully",
            students
        });
    } catch (error) {
        console.error("Get students error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// =========================
// Get Student By ID
// =========================
const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const student = await Student.findById(id)
            .select("name email course year");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student fetched successfully",
            student
        });
    } catch (error) {
        console.error("Get student by ID error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// =========================
// Update Student
// =========================
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, course, year } = req.body;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Validate request data
        if (
            !validateStudentData(
                name,
                email,
                course,
                year
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid request data"
            });
        }

        // Check whether student exists
        const existingStudent = await Student.findById(id);

        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Check duplicate email
        const duplicateEmail = await Student.findOne({
            email: email.trim().toLowerCase(),
            _id: { $ne: id }
        });

        if (duplicateEmail) {
            return res.status(400).json({
                success: false,
                message: "Student email already exists"
            });
        }

        // Update student
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                course: course.trim(),
                year
            },
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            student: {
                id: updatedStudent._id,
                name: updatedStudent.name,
                email: updatedStudent.email,
                course: updatedStudent.course,
                year: updatedStudent.year
            }
        });
    } catch (error) {
        console.error("Update student error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// =========================
// Delete Student
// =========================
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const student = await Student.findByIdAndDelete(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });
    } catch (error) {
        console.error("Delete student error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};