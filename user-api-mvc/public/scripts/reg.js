// ==============================================================
// ======================  Register Form  ==========================
// ==============================================================
var userId;
const returnbtn = document.getElementById("returnbtn");

document.getElementById('regForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    // Gather form data
    const newData = {
        "username": document.getElementById('username').value,
        "password": document.getElementById('password').value,
        "confirmPassword": document.getElementById('confirmPassword').value,
        "email": document.getElementById('email').value
    };
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
        // Handle successful response
        alert('Registered Successfully!')
        window.location.href = `http://localhost:3000/index.html`;
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });
}

returnbtn.addEventListener("click", function (){
    window.location.href = `http://localhost:3000/index.html`;
})