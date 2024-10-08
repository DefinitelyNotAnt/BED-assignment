// =========================================================================
// ===========================  Get User Data  =============================
// =========================================================================


// Get boxes
const userid = document.getElementById("userId");
const username = document.getElementById("username");
const displayUsername = document.getElementById("displayName");
const smallName = document.getElementById("smallName");
const icon = document.getElementById("iconUrl");
const displayIcon = document.getElementById("displayIcon");
const smallIcon = document.getElementById("smallProfile");
const description = document.getElementById("description");
const displayDescription = document.getElementById("displayDescription");
const email = document.getElementById("email");
const oldPassword = document.getElementById("oldPassword")
const newPassword = document.getElementById("newPassword")
const confirmPassword = document.getElementById("confirmPassword");


const logout = document.getElementById("logout");

var userId;



window.addEventListener("DOMContentLoaded", async ()=> {

    // Get token
    function getCookie(name) {
        function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
        var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
        return match ? match[1] : null;
    }


    const token = getCookie('jwt');
    console.log("fetching session");
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
        displayUsername.innerText = data.loginName;
        smallName.innerText = data.loginName;
        username.value = data.loginName;
        email.value = data.email;
        userid.innerText = "Your user id: "+data.userId;
        userId = data.userId;
        loadProfile();
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
        alert('There was an error retrieving your profile.');
    });
    

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
        icon.value = data.userProfile;
        description.value = data.userDesc;
        displayDescription.innerHTML = `<div id="displayDescription">${data.userDesc}</div>`;
        if (data.userProfile != "undefined" && data.userProfile != "" && data.userProfile != null){
            try{
                displayIcon.src = data.userProfile;
                smallIcon.src = data.userProfile;
            }
            catch{
                displayIcon.src = "../media/defaultIcon.png";
                smallIcon.src = "../media/defaultIcon.png";
            }
        }
        else{
            displayIcon.src = "../media/defaultIcon.png";
        }
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
        alert('There was an error retrieving your profile.');
    });
}



    // =================================================================================
    // ========================      Update User     ===================================
    // =================================================================================

    document.getElementById('updateForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        if (oldPassword.value == ""){
            console.log("Not changing sensitive info.");
        }
        else{
            if (newPassword.value != confirmPassword.value){
                alert("The passwords do not match.");
                confirmPassword.value = "";
                newPassword.value = "";
                return;
            }
            if (newPassword.value == "" || newPassword.value == null){
                newPassword.value == oldPassword.value;
            }
            // Gather form data
            const loginData = {
                "userid": userId,
                "newUserData": {
                    "username": username.value,
                    "password": newPassword.value,
                    "confirmPassword": confirmPassword.value,
                    "email": email.value
                },
                "oldPassword": oldPassword.value
            };
            if (newPassword.value == ''){
                loginData.userData.password = oldPassword.value;
            }
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
                icon.value = data.userProfile;
                description.value = data.userDesc;
                displayDescription.innerHTML = `<div id="displayDescription">${data.userDesc}</div>`;
                if (data.userProfile != "undefined" && data.userProfile != "" && data.userProfile != null && data.userProfile != "null"){
                    try{
                        displayIcon.src = data.userProfile;
                    }
                    catch{
                        displayIcon.src = "../media/defaultIcon.png";
                    }
                }
                else{
                    displayIcon.src = "../media/defaultIcon.png";
                }
                alert('Updated successfully!');
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
                alert('Password is incorrect or new password is not 8 characters long.');
            });
        }
        
    });
    
});


document.getElementById('updateForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    // Gather form data
    const displayData = {
        "userId": userId,
        "newProfileData": {
            "profileUrl": icon.value,
            "desc": description.value
        }
    };
    // Send the form data using Fetch API
    fetch('http://localhost:3000/profiles', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(displayData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        // Handle successful response
        displayUsername.innerText = username.value;
        icon.value = data.userProfile;
        description.value = data.userDesc;
        displayDescription.innerHTML = `<div id="displayDescription">${data.userDesc}</div>`;
        if (data.userProfile != "undefined" && data.userProfile != "" && data.userProfile != null && data.userProfile != "null"){
            try{
                displayIcon.src = data.userProfile;
            }
            catch{
                displayIcon.src = "../media/defaultIcon.png";
            }
        }
        else{
            displayIcon.src = "../media/defaultIcon.png";
        }
        alert('Updated successfully!');
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
        alert('There was an error updating your profile.');
    });
});


// =================================================================================
// ========================      Delete User     ===================================
// =================================================================================

function deleteCheck(){
    if (oldPassword.value == ""){
        console.log("Not changing sensitive info.");
        alert("Type in your password to allow deletion.");
        return;
    }
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
            alert('Deleted user successfully!');
            window.location.href = `http://localhost:3000/index.html`
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
        return;
    }
    alert('Deleted user successfully!');
    window.location.href = `http://localhost:3000/index.html`;
}

// =================================================================================
// ========================      Logout User     ===================================
// =================================================================================


logout.addEventListener("click", function (event){
    event.preventDefault();
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    window.location.href = `http://localhost:3000/index.html`;
})
