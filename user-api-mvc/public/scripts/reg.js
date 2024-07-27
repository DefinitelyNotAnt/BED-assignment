// ==============================================================
// ======================  Register Form  ==========================
// ==============================================================
var userId;

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
        console.log('Success:', data);
        if (data == "User Taken"){
            alert("User Taken.");
        }
        else{
            createProfile(data.userId);
        }
        
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
        alert('Your password needs to be 8 characters long');
    });
});

const createProfile = (id) => {
    const newData = {
        "userid": id
    }
    console.log(newData);
    fetch('http://localhost:3000/profiles', {
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
        console.log("Changed");
        // Handle successful response
        // console.log('Success:', data);
        alert('Registered Successfully!')
        window.location.href = `http://localhost:3000/index.html`;
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });
}