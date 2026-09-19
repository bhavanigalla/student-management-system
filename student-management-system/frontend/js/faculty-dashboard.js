const token =
    localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

const API_URL =
    "http://localhost:5000/api";

const studentsContainer =
    document.getElementById(
        "studentsContainer"
    );

const studentForm =
    document.getElementById(
        "studentForm"
    );

const studentMessage =
    document.getElementById(
        "studentMessage"
    );

const editCard =
    document.getElementById(
        "editCard"
    );

const editStudentForm =
    document.getElementById(
        "editStudentForm"
    );

const editMessage =
    document.getElementById(
        "editMessage"
    );

const cancelEditBtn =
    document.getElementById(
        "cancelEditBtn"
    );

const attendanceForm =
    document.getElementById(
        "attendanceForm"
    );

const attendanceMessage =
    document.getElementById(
        "attendanceMessage"
    );

const attendanceStudent =
    document.getElementById(
        "attendanceStudent"
    );

const updateAttendanceStudent =
    document.getElementById(
        "updateAttendanceStudent"
    );

const attendanceRecordsContainer =
    document.getElementById(
        "attendanceRecordsContainer"
    );

const updateAttendanceMessage =
    document.getElementById(
        "updateAttendanceMessage"
    );


// =========================
// Load Students
// =========================

const loadStudents = async () => {
    try {
        const response =
            await fetch(
                `${API_URL}/students`,
                {
                    method: "GET",
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            studentsContainer.textContent =
                data.message ||
                "Unable to load students";

            return;
        }

        displayStudents(
            data.students || []
        );

        populateStudentDropdown(
            data.students || []
        );

        populateUpdateAttendanceDropdown(
            data.students || []
        );

    } catch (error) {
        console.error(
            "Load students error:",
            error
        );

        studentsContainer.textContent =
            "Unable to connect to server";
    }
};


// =========================
// Display Students
// =========================

const displayStudents = (
    students
) => {
    if (students.length === 0) {
        studentsContainer.innerHTML =
            "<p>No students found.</p>";

        return;
    }

    studentsContainer.innerHTML = "";

    students.forEach(
        (student) => {
            const studentCard =
                document.createElement(
                    "div"
                );

            studentCard.className =
                "student-item";

            const infoDiv =
                document.createElement(
                    "div"
                );

            const title =
                document.createElement(
                    "h3"
                );

            title.textContent =
                student.name;

            const email =
                document.createElement(
                    "p"
                );

            email.textContent =
                `Email: ${student.email}`;

            const course =
                document.createElement(
                    "p"
                );

            course.textContent =
                `Course: ${student.course}`;

            const year =
                document.createElement(
                    "p"
                );

            year.textContent =
                `Year: ${student.year}`;

            infoDiv.appendChild(title);
            infoDiv.appendChild(email);
            infoDiv.appendChild(course);
            infoDiv.appendChild(year);

            const actions =
                document.createElement(
                    "div"
                );

            actions.className =
                "student-actions";

            const editButton =
                document.createElement(
                    "button"
                );

            editButton.className =
                "btn edit-btn";

            editButton.textContent =
                "Edit";

            editButton.addEventListener(
                "click",
                () => {
                    openEditForm(
                        student._id,
                        student.name,
                        student.email,
                        student.course,
                        student.year
                    );
                }
            );

            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.className =
                "btn delete-btn";

            deleteButton.textContent =
                "Delete";

            deleteButton.addEventListener(
                "click",
                () => {
                    deleteStudent(
                        student._id
                    );
                }
            );

            actions.appendChild(
                editButton
            );

            actions.appendChild(
                deleteButton
            );

            studentCard.appendChild(
                infoDiv
            );

            studentCard.appendChild(
                actions
            );

            studentsContainer.appendChild(
                studentCard
            );
        }
    );
};


// =========================
// Populate Mark Attendance Dropdown
// =========================

const populateStudentDropdown = (
    students
) => {
    attendanceStudent.innerHTML = `
        <option value="">
            Select student
        </option>
    `;

    students.forEach(
        (student) => {
            const option =
                document.createElement(
                    "option"
                );

            option.value =
                student._id;

            option.textContent =
                `${student.name} - ${student.course}`;

            attendanceStudent.appendChild(
                option
            );
        }
    );
};


// =========================
// Populate Update Attendance Dropdown
// =========================

const populateUpdateAttendanceDropdown = (
    students
) => {
    if (!updateAttendanceStudent) {
        return;
    }

    updateAttendanceStudent.innerHTML = `
        <option value="">
            Select student
        </option>
    `;

    students.forEach(
        (student) => {
            const option =
                document.createElement(
                    "option"
                );

            option.value =
                student._id;

            option.textContent =
                `${student.name} - ${student.course}`;

            updateAttendanceStudent.appendChild(
                option
            );
        }
    );
};


// =========================
// Add Student + Login Account
// =========================

studentForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        const name =
            document
                .getElementById(
                    "studentName"
                )
                .value
                .trim();

        const email =
            document
                .getElementById(
                    "studentEmail"
                )
                .value
                .trim();

        const course =
            document
                .getElementById(
                    "studentCourse"
                )
                .value
                .trim();

        const year =
            Number(
                document
                    .getElementById(
                        "studentYear"
                    )
                    .value
            );

        const password =
            document
                .getElementById(
                    "studentPassword"
                )
                .value;

        studentMessage.textContent =
            "Creating student account...";

        try {
            const response =
                await fetch(
                    `${API_URL}/students`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body:
                            JSON.stringify({
                                name,
                                email,
                                course,
                                year,
                                password
                            })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                studentMessage.textContent =
                    data.message ||
                    "Unable to create student";

                return;
            }

            studentMessage.textContent =
                "Student account created successfully.";

            studentForm.reset();

            await loadStudents();

        } catch (error) {
            console.error(
                "Add student error:",
                error
            );

            studentMessage.textContent =
                "Unable to connect to server";
        }
    }
);


// =========================
// Open Edit Form
// =========================

const openEditForm = (
    id,
    name,
    email,
    course,
    year
) => {
    document.getElementById(
        "editStudentId"
    ).value = id;

    document.getElementById(
        "editStudentName"
    ).value = name;

    document.getElementById(
        "editStudentEmail"
    ).value = email;

    document.getElementById(
        "editStudentCourse"
    ).value = course;

    document.getElementById(
        "editStudentYear"
    ).value = year;

    editMessage.textContent = "";

    editCard.style.display =
        "block";

    editCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
};


// =========================
// Update Student
// =========================

editStudentForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        const id =
            document.getElementById(
                "editStudentId"
            ).value;

        const name =
            document.getElementById(
                "editStudentName"
            ).value.trim();

        const email =
            document.getElementById(
                "editStudentEmail"
            ).value.trim();

        const course =
            document.getElementById(
                "editStudentCourse"
            ).value.trim();

        const year =
            Number(
                document.getElementById(
                    "editStudentYear"
                ).value
            );

        editMessage.textContent =
            "Updating student...";

        try {
            const response =
                await fetch(
                    `${API_URL}/students/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body:
                            JSON.stringify({
                                name,
                                email,
                                course,
                                year
                            })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                editMessage.textContent =
                    data.message ||
                    "Unable to update student";

                return;
            }

            editMessage.textContent =
                "Student updated successfully.";

            await loadStudents();

            setTimeout(
                () => {
                    editCard.style.display =
                        "none";
                },
                700
            );

        } catch (error) {
            console.error(
                "Update student error:",
                error
            );

            editMessage.textContent =
                "Unable to connect to server";
        }
    }
);


// =========================
// Cancel Edit
// =========================

cancelEditBtn.addEventListener(
    "click",
    () => {
        editStudentForm.reset();

        editMessage.textContent = "";

        editCard.style.display =
            "none";
    }
);


// =========================
// Delete Student
// =========================

const deleteStudent = async (
    id
) => {
    const confirmed =
        confirm(
            "Are you sure you want to delete this student and their login account?"
        );

    if (!confirmed) {
        return;
    }

    try {
        const response =
            await fetch(
                `${API_URL}/students/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            alert(
                data.message ||
                "Unable to delete student"
            );

            return;
        }

        alert(
            "Student and login account deleted successfully."
        );

        await loadStudents();

    } catch (error) {
        console.error(
            "Delete student error:",
            error
        );

        alert(
            "Unable to connect to server"
        );
    }
};


// =========================
// Mark Attendance
// =========================

attendanceForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        const studentId =
            attendanceStudent.value;

        const date =
            document.getElementById(
                "attendanceDate"
            ).value;

        const status =
            document.getElementById(
                "attendanceStatus"
            ).value;

        attendanceMessage.textContent =
            "Marking attendance...";

        try {
            const response =
                await fetch(
                    `${API_URL}/attendance`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body:
                            JSON.stringify({
                                studentId,
                                date,
                                status
                            })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                attendanceMessage.textContent =
                    data.message ||
                    "Unable to mark attendance";

                return;
            }

            attendanceMessage.textContent =
                "Attendance marked successfully.";

            attendanceForm.reset();

            /*
             * If the same student is selected
             * in Update Attendance section,
             * reload the records.
             */
            if (
                updateAttendanceStudent &&
                updateAttendanceStudent.value ===
                    studentId
            ) {
                await loadAttendanceRecords(
                    studentId
                );
            }

        } catch (error) {
            console.error(
                "Attendance error:",
                error
            );

            attendanceMessage.textContent =
                "Unable to connect to server";
        }
    }
);


// =========================
// Load Attendance Records
// =========================

const loadAttendanceRecords = async (
    studentId
) => {
    if (!attendanceRecordsContainer) {
        return;
    }

    if (!studentId) {
        attendanceRecordsContainer.innerHTML = `
            <p>
                Select a student to load attendance records.
            </p>
        `;

        return;
    }

    attendanceRecordsContainer.innerHTML = `
        <p>
            Loading attendance records...
        </p>
    `;

    if (updateAttendanceMessage) {
        updateAttendanceMessage.textContent =
            "";
    }

    try {
        const response =
            await fetch(
                `${API_URL}/attendance/student/${studentId}`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            attendanceRecordsContainer.innerHTML = `
                <p>
                    ${data.message || "Unable to load attendance records"}
                </p>
            `;

            return;
        }

        displayAttendanceRecords(
            data.attendance || []
        );

    } catch (error) {
        console.error(
            "Load attendance records error:",
            error
        );

        attendanceRecordsContainer.innerHTML = `
            <p>
                Unable to connect to server
            </p>
        `;
    }
};


// =========================
// Display Attendance Records
// =========================

const displayAttendanceRecords = (
    records
) => {
    if (!attendanceRecordsContainer) {
        return;
    }

    if (records.length === 0) {
        attendanceRecordsContainer.innerHTML = `
            <p>
                No attendance records found for this student.
            </p>
        `;

        return;
    }

    attendanceRecordsContainer.innerHTML = "";

    records.forEach(
        (record) => {
            const recordCard =
                document.createElement(
                    "div"
                );

            recordCard.className =
                "student-item";

            const recordInfo =
                document.createElement(
                    "div"
                );

            const dateLabel =
                document.createElement(
                    "p"
                );

            dateLabel.textContent =
                "Date";

            const dateInput =
                document.createElement(
                    "input"
                );

            dateInput.type =
                "date";

            dateInput.value =
                formatDateForInput(
                    record.date
                );

            dateInput.className =
                "attendance-edit-date";

            const statusLabel =
                document.createElement(
                    "p"
                );

            statusLabel.textContent =
                "Status";

            const statusSelect =
                document.createElement(
                    "select"
                );

            statusSelect.className =
                "attendance-edit-status";

            statusSelect.innerHTML = `
                <option value="present">
                    Present
                </option>

                <option value="absent">
                    Absent
                </option>
            `;

            statusSelect.value =
                record.status;

            recordInfo.appendChild(
                dateLabel
            );

            recordInfo.appendChild(
                dateInput
            );

            recordInfo.appendChild(
                statusLabel
            );

            recordInfo.appendChild(
                statusSelect
            );

            const actions =
                document.createElement(
                    "div"
                );

            actions.className =
                "student-actions";

            const updateButton =
                document.createElement(
                    "button"
                );

            updateButton.type =
                "button";

            updateButton.className =
                "btn edit-btn";

            updateButton.textContent =
                "Update Attendance";

            updateButton.addEventListener(
                "click",
                () => {
                    updateAttendance(
                        record._id,
                        dateInput.value,
                        statusSelect.value,
                        updateButton
                    );
                }
            );

            actions.appendChild(
                updateButton
            );

            recordCard.appendChild(
                recordInfo
            );

            recordCard.appendChild(
                actions
            );

            attendanceRecordsContainer.appendChild(
                recordCard
            );
        }
    );
};


// =========================
// Format Date for Input
// =========================

const formatDateForInput = (
    dateValue
) => {
    if (!dateValue) {
        return "";
    }

    const date =
        new Date(dateValue);

    if (Number.isNaN(
        date.getTime()
    )) {
        return "";
    }

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


// =========================
// Update Attendance
// =========================

const updateAttendance = async (
    attendanceId,
    date,
    status,
    button
) => {
    if (!attendanceId) {
        return;
    }

    if (!date) {
        if (updateAttendanceMessage) {
            updateAttendanceMessage.textContent =
                "Please select a date.";
        }

        return;
    }

    if (
        !["present", "absent"]
            .includes(status)
    ) {
        if (updateAttendanceMessage) {
            updateAttendanceMessage.textContent =
                "Please select a valid attendance status.";
        }

        return;
    }

    if (button) {
        button.disabled = true;
        button.textContent =
            "Updating...";
    }

    if (updateAttendanceMessage) {
        updateAttendanceMessage.textContent =
            "Updating attendance...";
    }

    try {
        const response =
            await fetch(
                `${API_URL}/attendance/${attendanceId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify({
                            date,
                            status
                        })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            if (updateAttendanceMessage) {
                updateAttendanceMessage.textContent =
                    data.message ||
                    "Unable to update attendance";
            }

            return;
        }

        if (updateAttendanceMessage) {
            updateAttendanceMessage.textContent =
                "Attendance updated successfully.";
        }

        /*
         * Reload the selected student's records
         * so the latest database values are visible.
         */
        if (
            updateAttendanceStudent &&
            updateAttendanceStudent.value
        ) {
            await loadAttendanceRecords(
                updateAttendanceStudent.value
            );
        }

    } catch (error) {
        console.error(
            "Update attendance error:",
            error
        );

        if (updateAttendanceMessage) {
            updateAttendanceMessage.textContent =
                "Unable to connect to server";
        }

    } finally {
        if (button) {
            button.disabled = false;
            button.textContent =
                "Update Attendance";
        }
    }
};


// =========================
// Attendance Student Change
// =========================

if (updateAttendanceStudent) {
    updateAttendanceStudent.addEventListener(
        "change",
        () => {
            loadAttendanceRecords(
                updateAttendanceStudent.value
            );
        }
    );
}


// =========================
// Logout
// =========================

document
    .getElementById(
        "logoutBtn"
    )
    .addEventListener(
        "click",
        () => {
            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "index.html";
        }
    );


// =========================
// Initial Load
// =========================

loadStudents();