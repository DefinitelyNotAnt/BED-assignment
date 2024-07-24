// =========================================================================
// ===========================  Get User Data  =============================
// =========================================================================
var globalData;
var userId;


window.addEventListener("DOMContentLoaded", async ()=> {
    // Get boxes
    const userid = document.getElementById("userId");
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const oldPassword = document.getElementById("oldPassword")
    const newPassword = document.getElementById("newPassword")
    const confirmPassword = document.getElementById("confirmPassword");

    // Get token
    function getCookie(name) {
        function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
        var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
        return match ? match[1] : null;
    }
    const token = getCookie('jwt');

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
        // Testing
        // console.log('Success:', data);
        globalData = data;
        username.value = data.loginName;
        email.value = data.email;
        userid.innerText = "Your user id: "+data.userId;
        userId = data.userId;
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
        alert('There was an error retrieving your profile.');
    });




    // =================================================================================
    // ========================      Update User     ===================================
    // =================================================================================

    document.getElementById('updateForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        if (newPassword.value != confirmPassword.value){
            alert("The passwords do not match.");
            confirmPassword.value = "";
            newPassword.value = "";
            return;
        }
        // Gather form data
        const loginData = {
            "userId": userId,
            "userData": {
                "username": username.value,
                "password": newPassword.value,
                "email": email.value
            },
            "oldPassword": oldPassword.value
        };
        console.log(loginData);
        // Send the form data using Fetch API
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
            console.log('Success:', data);
            alert('Updated successfully!');
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
            alert('There was an error updating your profile.');
        });
    });


    
});



    // =================================================================================
    // ========================      Delete User     ===================================
    // =================================================================================

    function deleteCheck(){
        let output;
        let input = prompt('Type out "CONFIRM DELETION"', "");
        if (input === "CONFIRM DELETION"){
            fetch("http://localhost:3000/users",{
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "userid": userId
                })
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
                window.location.href = `http://localhost:3000/index.html`
                alert('Deleted user successfully!');
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
                alert('There was an error deleting your profile.');
            });
        }
        else{
            output = "Cancelled Deletion.";
            alert(output);
        }
    }