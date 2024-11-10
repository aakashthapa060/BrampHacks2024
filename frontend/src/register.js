const apiUrl = "http://localhost:4000";

// Register User
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    try {
        const response = await fetch(`${apiUrl}/api/users/create-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Registration successful");
        } else {
            alert(data.message || "Registration failed");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during registration.");
    }
});
