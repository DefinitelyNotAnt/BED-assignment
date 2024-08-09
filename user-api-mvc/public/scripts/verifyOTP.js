const returnbtn = document.getElementById("return");
const currentwindow = window.location.href;
const getOtp = document.getElementById("otp");
const icon = document.getElementById("avatarIcon");
const submitbtn = document.getElementById("checkOTP");
var userId = localStorage.getItem("userId");


returnbtn.addEventListener("click", function (){
    window.location.href = `http://localhost:3000/html/forgotPassword.html`;
})

window.addEventListener("DOMContentLoaded", async ()=> {
    function loadProfile(){
        // Getting Icon and Description
        // Get info
        fetch('http://localhost:3000/profiles', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'userid': userId
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            // Handle successful response
            if (data.userProfile != null){
                icon.src = data.userProfile;
            }
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
            alert('There was an error retrieving your profile.');
        });
    }
    loadProfile();

    submitbtn.addEventListener("click", function (event) {
        event.preventDefault();
        verifyOTP()
    })
    // Verify OTP
    function verifyOTP(){
        console.log("fetching "+`http://localhost:3000/users/forgot?userId=${userId}&otp=${getOtp.value}`)
        // Get info
        fetch(`http://localhost:3000/users/forgot?userId=${userId}&otp=${getOtp.value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            // Handle successful response
            window.location.href = "http://localhost:3000/html/ResetPasswordScreen.html";
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
            alert('Invalid OTP.');
        });
    }
})


