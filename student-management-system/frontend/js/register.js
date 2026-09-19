const registerForm =
    document.getElementById("registerForm");

const message =
    document.getElementById("message");

const registerTitle =
    document.getElementById("registerTitle");

const registerSubtitle =
    document.getElementById("registerSubtitle");

const studentFields =
    document.getElementById("studentFields");


// =========================
// Determine Registration Type
// =========================

const params =
    new URLSearchParams(
        window.location.search
    );

const role =
    params.get("role") === "faculty"
        ? "faculty"
        : "student";


// =========================
// Configure Page
// =========================

if (role === "faculty") {

    registerTitle.textContent =
        "Faculty Registration 👩‍🏫";

    registerSubtitle.textContent =
        "Create your faculty account";

    studentFields.style.display =
        "none";

} else {

    registerTitle.textContent =
        "Student Registration 👨‍🎓";

    registerSubtitle.textContent =
        "Create your student account";

    studentFields.style.display =
        "block";
}


// =========================
// Registration
// =========================

registerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        const confirmPassword =
            document
                .getElementById("confirmPassword")
                .value;


        // =========================
        // Password Validation
        // =========================

        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match";

            return;
        }


        if (password.length < 6) {

            message.textContent =
                "Password must be at least 6 characters";

            return;
        }


        // =========================
        // Student Data
        // =========================

        let course = "";
        let year = null;


        if (role === "student") {

            course =
                document
                    .getElementById("course")
                    .value
                    .trim();


            year =
                Number(
                    document
                        .getElementById("year")
                        .value
                );


            if (!course) {

                message.textContent =
                    "Course is required";

                return;
            }


            if (
                !Number.isInteger(year) ||
                year < 1 ||
                year > 5
            ) {

                message.textContent =
                    "Year must be between 1 and 5";

                return;
            }
        }


        message.textContent =
            "Creating account...";


        try {

            const response =
                await fetch(
                    "/api/auth/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            password,
                            role,
                            course,
                            year
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message ||
                    "Registration failed";

                return;
            }


            message.textContent =
                "Registration successful! Redirecting to login...";


            registerForm.reset();


            setTimeout(
                () => {

                    window.location.href =
                        "index.html";

                },
                1200
            );


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            message.textContent =
                "Unable to connect to server";
        }
    }
);