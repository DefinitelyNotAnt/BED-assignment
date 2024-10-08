document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const loginData = {
        "username": document.getElementById('username').value,
        "password": document.getElementById('password').value
    };
    // Send the form data using Fetch API
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        // Handle successful response
        window.location.href = `http://localhost:3000/index1.html`;
        alert('Logged in successfully!');
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
        alert('Username or password is incorrect.');
    });
});

function regUser(){
    window.location.href = `http://localhost:3000/html/regUser.html`;
}


document.getElementById('forgetPassword').addEventListener("click", function (e) {
    window.location.href = `http://localhost:3000/html/forgotPassword.html`;
});