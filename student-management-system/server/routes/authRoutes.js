const express = require("express");

const {
    register,
    login
} = require("../controllers/authController");

const validateRequiredFields = require("../middleware/validateMiddleware");

const router = express.Router();

// Register
router.post(
    "/register",
    validateRequiredFields(["name", "email", "password"]),
    register
);

// Login
router.post(
    "/login",
    validateRequiredFields(["email", "password"]),
    login
);

module.exports = router;
