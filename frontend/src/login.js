const apiUrl = "http://localhost:4000";


document.getElementById("loginForm").addEventListener("submit", async(e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try{
        const response = await fetch(`${apiUrl}/api/users/authenticate_user`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        const result = await response.json()
        if(result.message === "Success"){
            console.log(document.cookie);
            location.href = 'index.html';
        }
    } catch (e) {
        console.log("Helo")
    }
})