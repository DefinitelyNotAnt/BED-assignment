const returnbtn = document.getElementById("return");
const submitbtn = document.getElementById("submitbtn");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const showNew = document.getElementById("showPassword");
const showConfirm = document.getElementById("showConfirmPassword");


function showPassword(passInput) {
    if (passInput.type === "password") {
      passInput.type = "text";
    } else {
      passInput.type = "password";
    }
}

showNew.addEventListener("click", function (){
    showPassword(newPassword);
})
showConfirm.addEventListener("click", function (){
    showPassword(confirmPassword);
})

document.addEventListener('DOMContentLoaded', async () => {
    submitbtn.addEventListener("click", function (event) {
        event.preventDefault();
        // Get token
        function getCookie(name) {
            function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
            var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
            return match ? match[1] : null;
        }


        const token = getCookie('usrdta');
        // Get info
        fetch('http://localhost:3000/users/id', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
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
            changePassword(data)
            window.location.href = "http://localhost:3000/index.html"
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
            alert('There was an error retrieving your account.');
        });
    })
})

returnbtn.addEventListener("click", function (){
    window.location.href = `http://localhost:3000/index.html`;
})



function changePassword(data){
    // Gather form data
    const loginData = {
        "userid": data.userId,
        "newUserData": {
            "username": data.loginName,
            "password": newPassword.value,
            "confirmPassword": confirmPassword.value,
            "email": data.email
        },
        "oldPassword": data.password
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
        console.log(data);
        alert('Updated successfully!');
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
        alert('Password is incorrect or new password is not 8 characters long.');
    });

}