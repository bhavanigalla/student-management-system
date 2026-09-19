const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Student = require("../models/Student");


// =========================
// Generate JWT Token
// =========================

const generateToken = (user) => {

    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:
                process.env.JWT_EXPIRES_IN || "1d"
        }
    );
};


// =========================
// Register
// =========================

const register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role,
            course,
            year
        } = req.body;


        // =========================
        // Basic Validation
        // =========================

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required"
            });
        }


        if (name.trim() === "") {

            return res.status(400).json({
                success: false,
                message:
                    "Name is required"
            });
        }


        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters"
            });
        }


        // =========================
        // Role Validation
        // =========================

        if (
            role !== "student" &&
            role !== "faculty"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid registration role"
            });
        }


        // =========================
        // Email Validation
        // =========================

        const normalizedEmail =
            email.trim().toLowerCase();


        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(normalizedEmail)) {

            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid email address"
            });
        }


        // =========================
        // Check Existing User
        // =========================

        const existingUser =
            await User.findOne({
                email: normalizedEmail
            });


        if (existingUser) {

            return res.status(400).json({
                success: false,
                message:
                    "An account with this email already exists"
            });
        }


        // =========================
        // Hash Password
        // =========================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // =========================
        // Student Registration
        // =========================

        if (role === "student") {

            if (
                typeof course !== "string" ||
                course.trim() === ""
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Course is required for student registration"
                });
            }


            if (
                !Number.isInteger(year) ||
                year < 1 ||
                year > 5
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Year must be between 1 and 5"
                });
            }


            const existingStudent =
                await Student.findOne({
                    email: normalizedEmail
                });


            if (existingStudent) {

                return res.status(400).json({
                    success: false,
                    message:
                        "A student with this email already exists"
                });
            }


            const student =
                await Student.create({
                    name: name.trim(),
                    email: normalizedEmail,
                    course: course.trim(),
                    year
                });


            try {

                const user =
                    await User.create({
                        name: name.trim(),
                        email: normalizedEmail,
                        password: hashedPassword,
                        role: "student",
                        studentId: student._id
                    });


                return res.status(201).json({

                    success: true,

                    message:
                        "Student registration successful",

                    data: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        studentId: user.studentId
                    }

                });

            } catch (userError) {

                await Student.findByIdAndDelete(
                    student._id
                );

                throw userError;
            }
        }


        // =========================
        // Faculty Registration
        // =========================

        if (role === "faculty") {

            const user =
                await User.create({
                    name: name.trim(),
                    email: normalizedEmail,
                    password: hashedPassword,
                    role: "faculty"
                });


            return res.status(201).json({

                success: true,

                message:
                    "Faculty registration successful",

                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }

            });
        }

    } catch (error) {

        console.error(
            "Register error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Internal server error"
        });
    }
};


// =========================
// Login
// =========================

const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required"
            });
        }


        const normalizedEmail =
            email.trim().toLowerCase();


        const user =
            await User.findOne({
                email: normalizedEmail
            })
            .select("+password");


        if (!user) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });
        }


        if (!user.password) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });
        }


        const isPasswordValid =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordValid) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });
        }


        const token =
            generateToken(user);


        return res.status(200).json({

            success: true,

            message:
                "Login successful",

            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                studentId: user.studentId,
                token
            }

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Internal server error"
        });
    }
};


// =========================
// Export
// =========================

module.exports = {
    register,
    login
};