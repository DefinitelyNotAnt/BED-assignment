const returnbtn = document.getElementById("return");


document.addEventListener('DOMContentLoaded', async () => {
    const emailbtn = document.getElementById("sendEmail");
    const terms = document.getElementById("searchTerms");

    emailbtn.addEventListener("click", function (event) {
        event.preventDefault();

        const searchTerms = {
            "searchTerms": terms.value,
            "email": terms.value,
            "username": terms.value
        }
        fetch('http://localhost:3000/users/forgot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchTerms)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            console.log("Email sent.");
            console.log(data);
            window.location.href = `http://localhost:3000/html/OTPEnterScreen.html?email=${data.newUserData.email}`
            // Handle successful response
            if (input == data.otp){
                let input = prompt('Confirmation Successful! Enter new password: ');
                changePassword(input,data);
                window.location.href = `http://localhost:3000/index.html`;
            }
            else{
                alert('Confirmation Failed.');
            }
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });
    })
});

returnbtn.addEventListener("click", function (){
    window.location.href = `http://localhost:3000/index.html`;
})


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