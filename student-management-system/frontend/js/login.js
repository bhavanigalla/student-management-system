const loginForm =
    document.getElementById("loginForm");

const message =
    document.getElementById("message");

const studentLoginBtn =
    document.getElementById("studentLoginBtn");

const facultyLoginBtn =
    document.getElementById("facultyLoginBtn");

const loginTypeMessage =
    document.getElementById("loginTypeMessage");

const studentRegisterSection =
    document.getElementById(
        "studentRegisterSection"
    );


// =========================
// Current Login Type
// =========================

let loginType = "student";


// =========================
// Student Login Mode
// =========================

studentLoginBtn.addEventListener(
    "click",
    () => {

        loginType = "student";

        loginTypeMessage.textContent =
            "Student Login 👨‍🎓";

        studentLoginBtn.style.background =
            "#2563eb";

        facultyLoginBtn.style.background =
            "#6b7280";

        studentRegisterSection.style.display =
            "block";

        message.textContent = "";

    }
);


// =========================
// Faculty Login Mode
// =========================

facultyLoginBtn.addEventListener(
    "click",
    () => {

        loginType = "faculty";

        loginTypeMessage.textContent =
            "Faculty Login 👩‍🏫";

        facultyLoginBtn.style.background =
            "#2563eb";

        studentLoginBtn.style.background =
            "#6b7280";

        studentRegisterSection.style.display =
            "none";

        message.textContent = "";

    }
);


// =========================
// Login
// =========================

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        message.textContent =
            "Logging in...";


        try {

            const response =
                await fetch(
                    "/api/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message ||
                    "Login failed";

                return;
            }


            const user =
                data.data;


            // =========================
            // Check Selected Login Type
            // =========================

            if (
                loginType === "student" &&
                user.role !== "student"
            ) {

                message.textContent =
                    "Please use Faculty Login for this account 👩‍🏫";

                return;
            }


            if (
                loginType === "faculty" &&
                user.role !== "faculty" &&
                user.role !== "admin"
            ) {

                message.textContent =
                    "Please use Student Login for this account 👨‍🎓";

                return;
            }


            // =========================
            // Save Login Information
            // =========================

            localStorage.setItem(
                "token",
                user.token
            );


            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            message.textContent =
                "Login successful! Redirecting...";


            // =========================
            // Redirect
            // =========================

            if (user.role === "student") {

                window.location.href =
                    "student-dashboard.html";

            } else if (
                user.role === "faculty" ||
                user.role === "admin"
            ) {

                window.location.href =
                    "faculty-dashboard.html";
            }


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            message.textContent =
                "Unable to connect to server";
        }
    }
);