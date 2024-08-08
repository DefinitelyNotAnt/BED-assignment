const returnbtn = document.getElementById("return");

returnbtn.addEventListener("click", function (){
    window.location.href = `http://localhost:3000/index.html`;
})


function verifyOTP(otp){
    
}





function changePassword(pass,data){
    // Gather form data
    const loginData = {
        "userid": data.userid,
        "newUserData": {
            "username": data.newUserData.username,
            "password": pass,
            "confirmPassword": pass,
            "email": data.newUserData.email
        },
        "oldPassword": data.newUserData.password
    };
    fetch('http://localhost:3000/users', {
        method: 'PUT',
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
        alert('Updated successfully!');
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
        alert('Password is incorrect or new password is not 8 characters long.');
    });
}




