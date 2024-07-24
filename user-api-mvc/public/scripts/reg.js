// ==============================================================
// ======================  Login Form  ==========================
// ==============================================================

document.getElementById('regForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
  
    // Gather form data
    const newData = {
        "username": document.getElementById('username').value,
        "password": document.getElementById('password').value,
        "confirmPassword": document.getElementById('confirmPassword').value,
        "email": document.getElementById('email').value
    };
    console.log(newData);
    // Send the form data using Fetch API
    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        // Handle successful response
        // console.log('Success:', data);
        // Logs in immediately
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            // Handle successful response
            // console.log('Success:', data);
            window.location.href = `http://localhost:3000/index1.html`;
            alert('Logged in successfully!');
        })
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
        alert('Your password needs to be 8 characters long');
    });
  });