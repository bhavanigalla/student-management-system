const token = localStorage.getItem("token");

const message = document.getElementById("message");

const profileCard = document.getElementById("profileCard");
const attendanceCard = document.getElementById("attendanceCard");

if (!token) {
    window.location.href = "index.html";
}

const loadProfile = async () => {
    try {
        const response = await fetch(
            "http://localhost:5000/api/profile/me",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message;
            return;
        }

        const profile = data.profile;

        document.getElementById("name").textContent = profile.name;
        document.getElementById("email").textContent = profile.email;
        document.getElementById("course").textContent = profile.course;
        document.getElementById("year").textContent = profile.year;

        document.getElementById("totalClasses").textContent =
            profile.attendance.totalClasses;

        document.getElementById("present").textContent =
            profile.attendance.present;

        document.getElementById("absent").textContent =
            profile.attendance.absent;

        document.getElementById("percentage").textContent =
            profile.attendance.percentage;

        message.style.display = "none";

        profileCard.style.display = "block";
        attendanceCard.style.display = "block";

    } catch (error) {
        console.error("Profile error:", error);

        message.textContent =
            "Unable to connect to server";
    }
};

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "index.html";
});

loadProfile();